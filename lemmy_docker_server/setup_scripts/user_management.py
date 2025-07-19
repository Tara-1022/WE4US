import requests
import pandas as pd
import time
import logging
import sys
from typing import Dict, List, Optional
import re

from constants import LEMMY_API_URL, PHOENIX_API_URL, ADMIN_USERNAME, ADMIN_PASSWORD, CSV_FILE, DEFAULT_PASSWORD

# Use something like https://www.convertsimple.com/convert-tsv-to-csv/ to copy the newer rows from form responses
# and replace sample_users.csv (or the csv file in use)

CSV_REQUIRED_COLUMNS = ["cohort", "email","username_1", "username_2", "display_name"]

# regex from profile.ex (https://github.com/Tara-1022/WE4US/blob/main/postgres-wrapper/lib/we4us/profiles/profile.ex)
USERNAME_REGEX = r"^[a-z0-9_]+$"

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("user_management.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class UserManagement:
    def __init__(self, session: requests.Session = None, auth_token: str = None):
        self.auth_token = auth_token

        if session:
            self.session = session
        else:
            self.session = requests.Session()
            self.session.headers.update({
                "Content-Type": "application/json",
                "User-Agent": "WE4US-Setup-Script/1.0"
            })

    def __del__(self):
        logger.info("Destroying object...")
        logger.info("Setting registration to Requires Application...")
        self.session.put(
                f"{LEMMY_API_URL}/site",
                json={"registration_mode": "RequireApplication"}
        )
        logger.info("Logging admin out...")
        self.session.post(f"{LEMMY_API_URL}/user/logout")
       
    def login(self, username: str, password: str) -> bool:
        try:
            logger.info(f"Attempting to login as {username}")
            response = self.session.post(
                f"{LEMMY_API_URL}/user/login",
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

    def check_user_exists_lemmy(self, username: str) -> Optional[Dict]:
        try:
            # Try to get user info directly
            response = self.session.get(
                f"{LEMMY_API_URL}/user?username={username}"
            )

            if response.status_code == 200:
                user_data = response.json()
                if user_data and "person_view" in user_data:
                    logger.info(f"User {username} found via user endpoint")
                    return user_data.get("person_view")


            # If not found, try the site's users list
            users_list_response = self.session.get(
                f"{LEMMY_API_URL}/user/list",
                params={"limit": 50, "sort": "New"}
            )

            if users_list_response.status_code == 200:
                users_data = users_list_response.json()
                users = users_data.get("users", [])

                for user in users:
                    user_name = user.get("person", {}).get("name", "")
                    if user_name == username:
                        logger.info(f"Found user {username} in site users list")
                        return user

            # If still not found, try searching
            search_response = self.session.get(
                f"{LEMMY_API_URL}/search",
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
                    user_info = user.get("person", {}).get("name", "")
                    if user_info == username:
                        logger.info(f"Found user {username} through search")
                        return user

            logger.info(f"User {username} does not exist")
            return None

        except requests.exceptions.RequestException as e:
            logger.error(f"Error checking if user exists: {str(e)}")
            if hasattr(e, 'response') and hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            return None
        
    def check_user_exists_phoenix(self, username: str) -> Optional[Dict]:
        try:
            # Try to get user info directly
            response = self.session.get(
                f"{PHOENIX_API_URL}/profiles/{username}"
            )

            if response.status_code == 200:
                user_data = response.json()
                profiles = user_data.get("profiles", [])

                for profile in profiles:
                    if profile.get("username") == username:
                        logger.info(f"User {username} has a profile")
                        return profile

            logger.info(f"User {username} does not have a profile")
            return None

        except requests.exceptions.RequestException as e:
            logger.error(f"Error checking if user exists: {str(e)}")
            if hasattr(e, 'response') and hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            return None

    def register_user_lemmy(self, username: str, password: str, email: str) -> Optional[Dict]:
        try:
            logger.info(f"Registering user {username}")
            user_info = self.check_user_exists_lemmy(username)

            if user_info:
                logger.info(f"User {username} already exists")
                return

            # Register the new user
            register_data = {
                "username": username,
                "password": password,
                "password_verify": password,
                "show_nsfw": True
            }

            # avoid a situation where lemmy profile is created but phoenix cannot be
            # which is a headache to fix and wastes stora
            if (not re.fullmatch(USERNAME_REGEX, username)):
                logger.error("Invalid username. Abandoning")
                return None

            if email:
                register_data["email"] = email

            logger.info(f"Sending registration request for {username}")
            response = self.session.post(
                f"{LEMMY_API_URL}/user/register",
                json=register_data
            )

            if response.status_code == 400 and "email_already_exists" in response.text:
                logger.error(f"Email already exists for user {username}")
                logger.warning("PLEASE CREATE PROFILE IN PHOENIX IF IT DOES NOT EXIST")
                return None

            response.raise_for_status()
            registration_response = response.json()
            logger.info(f"Successfully registered user {username}")

            # Wait for user to be fully registered in system
            logger.info(f"Waiting for user {username} to be fully registered in the system...")
            time.sleep(5)

            # After waiting, try to get user info
            user_info = self.check_user_exists_lemmy(username)

            if not user_info:
                logger.warning(f"Could not retrieve user info for {username}")
                return registration_response

            # Extract user ID for admin setting
            user_id = None
            if "person" in user_info:
                user_id = user_info.get("person", {}).get("id")
            elif "person_view" in user_info:
                user_id = user_info.get("person_view", {}).get("person", {}).get("id")
            logger.info(f"New user {username} (ID: {user_id})")

            return registration_response

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to register user {username}: {str(e)}")
            if hasattr(e, 'response') and hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            return None
        
    def register_user_phoenix(self, username: str, display_name: str, cohort: str) -> Optional[Dict]:
        try:
            logger.info(f"Creating profile for {username}")
            user_info = self.check_user_exists_phoenix(username)

            if user_info:
                logger.info(f"User {username} already has a profile")
                return

            # Register the new user
            profile_data = { "profile": {
                "username": username,
                "display_name": display_name,
                "cohort": cohort
            }
            }

            logger.info(f"Sending profile creation request for {username}")
            response = self.session.post(
                f"{PHOENIX_API_URL}/profiles",
                json=profile_data
            )

            if response.status_code != 201:
                logger.error(f"ERROR: {response.text}")
                return None

            response.raise_for_status()
            new_profile = response.json()
            logger.info(f"Successfully created profile for {username}")

            return new_profile

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create profile for {username}: {str(e)}")
            if hasattr(e, 'response') and hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            return None

    def bulk_register_users_from_csv(self, csv_file: str) -> List[Dict]:
        logger.info("Setting registration open...")
        self.session.put(
                f"{LEMMY_API_URL}/site",
                json={
                    "registration_mode": "Open"
                }
            )
        try:
            df = pd.read_csv(csv_file)

            # Check that all required columns are present
            for col in CSV_REQUIRED_COLUMNS:
                if col not in df.columns:
                    logger.error(f"CSV file missing required column: {col}")
                    return []

            registered_users = []
            used_emails = set()  # Track emails we've already tried to use

            for _, row in df.iterrows():
                cohort = str(row["cohort"])
                email = str(row.get("email", ""))
                username = str(row["username_1"])
                username2 = str(row.get("username_2", ""))
                display_name = str(row.get("display_name"))

                # Skip if email is empty or already used
                if not email or email in used_emails:
                    logger.warning(f"Skipping registration for {display_name}: Empty email or email already used")
                    continue

                used_emails.add(email)

                logger.info(f"Processing registration for {display_name} from Cohort {cohort}")

                username_tried = username
                # Try first username, then fallback to second
                user = self.register_user_lemmy(username, DEFAULT_PASSWORD, email)
                
                if not user and username2:
                    logger.info(f"First username {username} unavailable, trying alternate username {username2}")
                    user = self.register_user_lemmy(username2, DEFAULT_PASSWORD, email)
                    username_tried = username2
                if user:
                    registered_users.append({
                        "username": username_tried,
                        "name": display_name,
                        "email": email,
                        "response": user
                    })
                    self.register_user_phoenix(username_tried, display_name, cohort)

                    logger.info(f"Successfully registered {display_name} with username: {username_tried}")
                    time.sleep(3)
                else:
                    logger.error(f"Failed to register user {display_name} with either username")

            logger.info(f"Successfully registered {len(registered_users)} users out of {len(df)} entries")
            return registered_users

        except Exception as e:
            logger.error(f"Error processing CSV file: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            return []


def main():

    logger.info("Starting user management process...")

    # Initialize the user manager
    user_manager = UserManagement()

    # Login as admin
    if user_manager.login(ADMIN_USERNAME, ADMIN_PASSWORD):
        logger.info("Admin login successful")

        # Register users from CSV
        logger.info(f"Starting bulk registration from {CSV_FILE}")
        registered_users = user_manager.bulk_register_users_from_csv(CSV_FILE)

        logger.info(f"Registration process completed. Registered {len(registered_users)} users.")
    else:
        logger.error("Admin login failed. User registration cannot proceed.")
    
    del user_manager

if __name__ == "__main__":
    main()