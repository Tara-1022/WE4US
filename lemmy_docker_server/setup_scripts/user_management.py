import requests
import pandas as pd
import time
import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

class UserManagement:
    def __init__(self, base_url: str, session: requests.Session = None, auth_token: str = None):
        self.base_url = base_url
        self.auth_token = auth_token

        if session:
            self.session = session
        else:
            self.session = requests.Session()
            self.session.headers.update({
                "Content-Type": "application/json",
                "User-Agent": "WE4US-Setup-Script/1.0"
            })

        if self.auth_token:
            self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})

    def set_auth_token(self, auth_token: str):
        """Update the authentication token for the session."""
        self.auth_token = auth_token
        self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})

    def check_user_exists(self, username: str) -> Optional[Dict]:
        """Check if a user exists by username."""
        try:
            # Try to get user info directly
            response = self.session.get(
                f"{self.base_url}/api/v3/user?username={username}"
            )

            if response.status_code == 200:
                user_data = response.json()
                if user_data and "person_view" in user_data:
                    logger.info(f"User {username} found via user endpoint")
                    return user_data.get("person_view")

            # If we couldn't find the user directly, try searching
            search_response = self.session.get(
                f"{self.base_url}/api/v3/search",
                params={
                    "q": username,
                    "type_": "Users",
                    "sort": "TopAll",
                    "listing_type": "All",
                    "page": 1,
                    "limit": 50
                }
            )

            if search_response.status_code == 200:
                search_data = search_response.json()
                users = search_data.get("users", [])

                # Look for our user in the search results
                for user in users:
                    user_info = user.get("person", {}).get("name", "").lower()
                    if user_info == username.lower():
                        logger.info(f"Found user {username} through search")
                        return user

            # If still not found, try the site's users list
            users_list_response = self.session.get(
                f"{self.base_url}/api/v3/user/list",
                params={"limit": 50, "sort": "New"}
            )

            if users_list_response.status_code == 200:
                users_data = users_list_response.json()
                users = users_data.get("users", [])

                for user in users:
                    user_name = user.get("person", {}).get("name", "").lower()
                    if user_name == username.lower():
                        logger.info(f"Found user {username} in site users list")
                        return user

            logger.info(f"User {username} does not exist")
            return None

        except requests.exceptions.RequestException as e:
            logger.error(f"Error checking if user exists: {str(e)}")
            if hasattr(e, 'response') and hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            return None

    def set_admin_status(self, person_id: int, is_admin: bool) -> bool:
        """Set or unset admin status for a user."""
        if not self.auth_token:
            logger.error("Auth token required. Please login as admin first.")
            return False

        try:
            logger.info(f"Setting admin status for user ID {person_id} to: {is_admin}")

            response = self.session.post(
                f"{self.base_url}/api/v3/user/admin",
                json={"person_id": person_id, "added": is_admin}
            )

            logger.info(f"Admin status change response: {response.status_code}")

            # Verify the change worked
            time.sleep(2)
            verify_response = self.session.get(
                f"{self.base_url}/api/v3/user?person_id={person_id}"
            )

            if verify_response.status_code == 200:
                verify_data = verify_response.json()
                current_admin = verify_data.get("person_view", {}).get("person", {}).get("admin", False)
                logger.info(f"Verified admin status for user ID {person_id}: {current_admin}")

                if current_admin == is_admin:
                    logger.info(f"Admin status was successfully set to {is_admin} for user ID {person_id}")
                    return True
                else:
                    logger.error(f"Failed to set admin status for user ID {person_id}")
                    return False
            else:
                return response.status_code == 200

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to set admin status for user ID {person_id}: {str(e)}")
            if hasattr(e, 'response') and hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            return False

    def register_user(self, username: str, password: str, email: str,
                      admin: bool = False, captcha_uuid: str = None,
                      captcha_answer: str = None) -> Optional[Dict]:
        """Register a new user or update admin status if user already exists."""
        try:
            logger.info(f"Registering user {username} with admin status: {admin}")
            user_info = self.check_user_exists(username)

            if user_info:
                logger.info(f"User {username} already exists")

                # If we're logged in as admin, we can set admin status
                if self.auth_token:
                    user_id = None
                    # Extract user ID from the response
                    if "person" in user_info:
                        user_id = user_info.get("person", {}).get("id")
                        current_admin_status = user_info.get("person", {}).get("admin", False)
                    elif "person_view" in user_info:
                        user_id = user_info.get("person_view", {}).get("person", {}).get("id")
                        current_admin_status = user_info.get("person_view", {}).get("person", {}).get("admin", False)
                    else:
                        current_admin_status = False

                    logger.info(f"User {username} current admin status: {current_admin_status}")

                    # Only update admin status if it's different from what we want
                    if user_id and admin != current_admin_status:
                        logger.info(f"Setting admin status for user {username} to {admin}")
                        admin_result = self.set_admin_status(user_id, admin)
                        if admin_result:
                            logger.info(f"Successfully set admin status for {username} to {admin}")

                return user_info

            # Register the new user
            register_data = {
                "username": username,
                "password": password,
                "password_verify": password,
                "show_nsfw": True
            }

            if email:
                register_data["email"] = email

            if captcha_uuid and captcha_answer:
                register_data["captcha_uuid"] = captcha_uuid
                register_data["captcha_answer"] = captcha_answer

            logger.info(f"Sending registration request for {username}")
            response = self.session.post(
                f"{self.base_url}/api/v3/user/register",
                json=register_data
            )

            if response.status_code == 400 and "email_already_exists" in response.text:
                logger.error(f"Email already exists for user {username}")
                return None

            response.raise_for_status()
            registration_response = response.json()
            logger.info(f"Successfully registered user {username}")

            # Wait for user to be fully registered in system
            logger.info(f"Waiting for user {username} to be fully registered in the system...")
            time.sleep(5)

            # After waiting, try to get user info
            user_info = self.check_user_exists(username)

            if not user_info:
                logger.warning(f"Could not retrieve user info for {username}")
                return registration_response

            # Extract user ID for admin setting
            user_id = None
            if "person" in user_info:
                user_id = user_info.get("person", {}).get("id")
                current_admin_status = user_info.get("person", {}).get("admin", False)
            elif "person_view" in user_info:
                user_id = user_info.get("person_view", {}).get("person", {}).get("id")
                current_admin_status = user_info.get("person_view", {}).get("person", {}).get("admin", False)
            else:
                current_admin_status = False

            logger.info(f"New user {username} (ID: {user_id}) initial admin status: {current_admin_status}")

            # Set admin status if needed
            if user_id and self.auth_token and admin != current_admin_status:
                logger.info(f"Setting admin status for {username} to {admin}")
                admin_result = self.set_admin_status(user_id, admin)
                if admin_result:
                    logger.info(f"Successfully set admin status for {username} to {admin}")

            return registration_response

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to register user {username}: {str(e)}")
            if hasattr(e, 'response') and hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            return None

    def bulk_register_users_from_csv(self, csv_file: str) -> List[Dict]:
        """Register multiple users from a CSV file."""
        try:
            df = pd.read_csv(csv_file)
            required_columns = ["name", "cohort", "username", "username2", "email", "is_admin"]

            # Check that all required columns are present
            for col in required_columns:
                if col not in df.columns:
                    logger.error(f"CSV file missing required column: {col}")
                    return []

            registered_users = []
            used_emails = set()  # Track emails we've already tried to use

            for _, row in df.iterrows():
                name = str(row["name"])
                cohort = str(row["cohort"])
                username = str(row["username"]).lower()
                username2 = str(row.get("username2", "")).lower()
                email = str(row.get("email", ""))

                # Parse is_admin value
                raw_is_admin = row.get("is_admin")
                is_admin = False  # Default to False

                if isinstance(raw_is_admin, bool):
                    is_admin = raw_is_admin
                elif isinstance(raw_is_admin, str):
                    is_admin = raw_is_admin.lower() in ["true", "yes", "y", "1"]
                elif isinstance(raw_is_admin, (int, float)):
                    is_admin = raw_is_admin == 1

                # Skip if email is empty or already used
                if not email or email in used_emails:
                    logger.warning(f"Skipping registration for {name}: Empty email or email already used")
                    continue

                used_emails.add(email)

                logger.info(f"Processing registration for {name} from Cohort {cohort}")

                # Try first username, then fallback to second
                user = self.register_user(username, "ChangeMe123!", email, admin=is_admin)

                if not user and username2:
                    logger.info(f"First username {username} unavailable, trying alternate username {username2}")
                    user = self.register_user(username2, "ChangeMe123!", email, admin=is_admin)

                if user:
                    registered_users.append({
                        "username": username if user else username2,
                        "name": name,
                        "email": email,
                        "admin": is_admin,
                        "response": user
                    })

                    logger.info(f"Successfully registered {name} with username: {username if user else username2}, admin status: {is_admin}")
                    time.sleep(3)
                else:
                    logger.error(f"Failed to register user {name} with either username")

            # Final verification pass for all users
            logger.info("Performing final verification of admin status for all users...")
            time.sleep(5)

            for registered_user in registered_users:
                username = registered_user["username"]
                expected_admin = registered_user["admin"]

                user_info = self.check_user_exists(username)
                if user_info:
                    current_admin = False
                    user_id = None

                    if "person" in user_info:
                        current_admin = user_info.get("person", {}).get("admin", False)
                        user_id = user_info.get("person", {}).get("id")
                    elif "person_view" in user_info:
                        current_admin = user_info.get("person_view", {}).get("person", {}).get("admin", False)
                        user_id = user_info.get("person_view", {}).get("person", {}).get("id")

                    logger.info(f"Final check - User {username} admin status: {current_admin}, expected: {expected_admin}")

                    # Fix admin status if needed
                    if current_admin != expected_admin and user_id and self.auth_token:
                        logger.warning(f"Admin status mismatch for {username} - fixing final time")
                        self.set_admin_status(user_id, expected_admin)

            logger.info(f"Successfully registered {len(registered_users)} users out of {len(df)} entries")
            return registered_users

        except Exception as e:
            logger.error(f"Error processing CSV file: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            return []

    def login(self, username: str, password: str) -> bool:
        """Login a user and update the auth token."""
        try:
            logger.info(f"Attempting to login as {username}")
            response = self.session.post(
                f"{self.base_url}/api/v3/user/login",
                json={"username_or_email": username, "password": password}
            )
            response.raise_for_status()
            data = response.json()
            self.auth_token = data.get("jwt")

            if self.auth_token:
                self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                logger.info(f"Successfully logged in as {username}")
                return True
            else:
                logger.error(f"Failed to get auth token for {username}")
                return False

        except requests.exceptions.RequestException as e:
            logger.error(f"Login failed: {str(e)}")
            if hasattr(e, 'response') and hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            return False