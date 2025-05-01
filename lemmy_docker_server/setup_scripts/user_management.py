import requests
import time
import pandas as pd
import csv
from datetime import datetime
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("user_management.log"),
        logging.StreamHandler()
    ]
)

class UserManager:
    def __init__(self, base_url="http://localhost:10633/api/v3", jwt_token=None):
        self.base_url = base_url
        self.jwt_token = jwt_token
        self.headers = {"Authorization": f"Bearer {jwt_token}"} if jwt_token else {}
        self.error_users = []
    
    def set_jwt_token(self, jwt_token):
        self.jwt_token = jwt_token
        self.headers = {"Authorization": f"Bearer {jwt_token}"}
    
    def register_or_login(self, username, password, email):
        # Try login first
        login_res = requests.post(f"{self.base_url}/user/login", json={
            "username_or_email": username,
            "password": password
        })

        if login_res.status_code == 200 and "jwt" in login_res.json():
            logging.info(f"Logged in as {username}")
            return login_res.json()["jwt"]

        # If login fails, try registration
        logging.info(f"Registering new user: {username}")
        reg_res = requests.post(f"{self.base_url}/user/register", json={
            "username": username,
            "password": password,
            "password_verify": password,
            "email": email,
            "show_nsfw": True
        })

        if reg_res.status_code == 200 and "jwt" in reg_res.json():
            logging.info(f"User registered successfully: {username}")
            return reg_res.json()["jwt"]
        else:
            error_msg = f"Failed to register user {username}: {reg_res.status_code} - {reg_res.text}"
            logging.error(error_msg)
            return None
    
    def promote_to_admin(self, username):
        if not self.jwt_token:
            logging.error("JWT token required for admin promotion")
            return False
            
        user_res = requests.get(f"{self.base_url}/user", params={"username": username}, headers=self.headers)
        
        if user_res.status_code == 200:
            person_id = user_res.json()["person_view"]["person"]["id"]

            admin_res = requests.post(f"{self.base_url}/admin", headers=self.headers, json={
                "person_id": person_id,
                "admin": True
            })

            if admin_res.status_code == 200:
                logging.info(f"User {username} promoted to admin.")
                return True
            else:
                error_msg = f"Failed to promote {username} to admin: {admin_res.status_code} - {admin_res.text}"
                logging.error(error_msg)
                return False
        else:
            error_msg = f"Could not fetch user {username}: {user_res.status_code} - {user_res.text}"
            logging.error(error_msg)
            return False
    
    def create_users_from_excel(self, excel_path, default_password="Password123!", admin_jwt=None):
        if admin_jwt and not self.jwt_token:
            self.set_jwt_token(admin_jwt)
            
        successful_count = 0
        error_count = 0
        self.error_users = []
            
        try:
            df = pd.read_excel(excel_path)
            
            for idx, row in df.iterrows():
                email = row.get('Email', '')
                
                # Skip empty emails
                if not email:
                    continue
                    
                # Generate username from email if not provided
                username = row.get('Username', email.split('@')[0].replace('.', '_'))
                password = row.get('Password', default_password)
                is_admin = row.get('IsAdmin', False)
                
                try:
                    # Register the user
                    user_jwt = self.register_or_login(username, password, email)
                    
                    if user_jwt:
                        successful_count += 1
                        
                        # Promote to admin if needed
                        if is_admin and self.jwt_token:
                            if not self.promote_to_admin(username):
                                self.error_users.append({
                                    'Email': email,
                                    'Username': username,
                                    'Password': password,
                                    'IsAdmin': is_admin,
                                    'Error': "Admin promotion failed"
                                })
                    else:
                        error_count += 1
                        self.error_users.append({
                            'Email': email,
                            'Username': username,
                            'Password': password,
                            'IsAdmin': is_admin,
                            'Error': "Registration failed"
                        })

                except Exception as e:
                    error_count += 1
                    error_msg = f"Error creating user {username}: {str(e)}"
                    logging.error(error_msg)
                    
                    self.error_users.append({
                        'Email': email,
                        'Username': username,
                        'Password': password,
                        'IsAdmin': is_admin,
                        'Error': str(e)
                    })

                time.sleep(0.5)
                
            # Save error users to CSV
            if error_count > 0:
                self._save_error_users_to_csv()
                
            logging.info(f"User creation completed: {successful_count} successful, {error_count} errors")
            return successful_count, error_count
                
        except Exception as e:
            error_msg = f"Error processing Excel file: {str(e)}"
            logging.error(error_msg)
            return 0, 0
    
    def _save_error_users_to_csv(self):
        if not self.error_users:
            return
            
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"error_users_{timestamp}.csv"
        
        try:
            with open(filename, 'w', newline='') as csvfile:
                fieldnames = ['Email', 'Username', 'Password', 'IsAdmin', 'Error']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                
                for user in self.error_users:
                    writer.writerow(user)
                    
            logging.info(f"Error users saved to {filename}")
        except Exception as e:
            logging.error(f"Failed to save error users to CSV: {str(e)}")
    
    def retry_error_users(self, csv_path, admin_jwt=None):
        if admin_jwt and not self.jwt_token:
            self.set_jwt_token(admin_jwt)
            
        successful_count = 0
        error_count = 0
        self.error_users = []
            
        try:
            df = pd.read_csv(csv_path)
            
            for idx, row in df.iterrows():
                email = row.get('Email', '')
                username = row.get('Username', '')
                password = row.get('Password', '')
                is_admin = row.get('IsAdmin', False)
                
                if isinstance(is_admin, str):
                    is_admin = is_admin.lower() == 'true'
                
                try:
                    # Register the user
                    user_jwt = self.register_or_login(username, password, email)
                    
                    if user_jwt:
                        successful_count += 1
                        
                        # Promote to admin if needed
                        if is_admin and self.jwt_token:
                            if not self.promote_to_admin(username):
                                self.error_users.append({
                                    'Email': email,
                                    'Username': username,
                                    'Password': password,
                                    'IsAdmin': is_admin,
                                    'Error': "Admin promotion failed"
                                })
                    else:
                        error_count += 1
                        self.error_users.append({
                            'Email': email,
                            'Username': username,
                            'Password': password,
                            'IsAdmin': is_admin,
                            'Error': "Registration failed"
                        })

                except Exception as e:
                    error_count += 1
                    error_msg = f"Error creating user {username}: {str(e)}"
                    logging.error(error_msg)
                    
                    self.error_users.append({
                        'Email': email,
                        'Username': username,
                        'Password': password,
                        'IsAdmin': is_admin,
                        'Error': str(e)
                    })

                time.sleep(0.5)
                
            # Save error users to CSV
            if error_count > 0:
                self._save_error_users_to_csv()
                
            logging.info(f"Retry completed: {successful_count} successful, {error_count} remaining errors")
            return successful_count, error_count
                
        except Exception as e:
            error_msg = f"Error processing CSV file: {str(e)}"
            logging.error(error_msg)
            return 0, 0


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Lemmy User Management Tool')
    parser.add_argument('--excel', type=str, help='Path to Excel file with user data')
    parser.add_argument('--retry', type=str, help='Path to error CSV file to retry')
    parser.add_argument('--base-url', type=str, default="http://localhost:10633/api/v3", help='Base URL for Lemmy API')
    parser.add_argument('--admin-username', type=str, default="cohort2_user2", help='Admin username')
    parser.add_argument('--admin-password', type=str, default="nishita123", help='Admin password')
    
    args = parser.parse_args()
    
    user_manager = UserManager(base_url=args.base_url)
    
    # Login as admin
    admin_jwt = user_manager.register_or_login(args.admin_username, args.admin_password, "admin@localhost")
    
    if not admin_jwt:
        logging.error("Failed to login as admin")
        exit(1)
    
    user_manager.set_jwt_token(admin_jwt)
    
    if args.excel:
        logging.info(f"Creating users from Excel file: {args.excel}")
        user_manager.create_users_from_excel(args.excel, admin_jwt=admin_jwt)
    
    if args.retry:
        logging.info(f"Retrying users from CSV file: {args.retry}")
        user_manager.retry_error_users(args.retry, admin_jwt=admin_jwt)