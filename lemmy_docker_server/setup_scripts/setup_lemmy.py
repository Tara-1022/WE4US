import requests
import time
import sys
import logging
from typing import Dict, List

# Import the UserManagement class
from user_management import UserManagement

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("lemmy_setup.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class LemmySetup:
    def __init__(self, base_url: str, admin_username: str = None, admin_password: str = None):
        self.base_url = base_url
        self.admin_username = admin_username
        self.admin_password = admin_password
        self.auth_token = None
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "User-Agent": "WE4US-Setup-Script/1.0"
        })

        # Initialize the UserManagement instance
        self.user_manager = UserManagement(base_url, self.session)

        self.communities = [
            {"name": "job_board", "title": "Job Board", "description": "List job and internship openings"},
            {"name": "announcements", "title": "Announcements", "description": "Important announcements and updates"},
            {"name": "pg_finder", "title": "PG Finder", "description": "PG recommendations with reviews"},
            {"name": "meet_up", "title": "Meet Up", "description": "Upcoming meet-up events and activities"}
        ]

        self.site_config = {
            "name": "WE4US",
            "description": "A platform for students to connect, share, and grow.",
            "enable_downvotes": True,
            "enable_nsfw": True,
            "community_creation_admin_only": True,
            "require_email_verification": False,
            "application_question": "",
            "private_instance": True,
            "federation_enabled": False
        }

    def verify_site(self) -> dict:
        try:
            logger.info("Verifying site configuration...")
            response = self.session.get(f"{self.base_url}/api/v3/site")

            if response.status_code == 200:
                site_data = response.json()
                logger.info(f"Site verification successful. Current site name: {site_data.get('site_view', {}).get('site', {}).get('name')}")
                return site_data
            else:
                logger.error(f"Site verification failed with status code: {response.status_code}")
                return {}

        except requests.exceptions.RequestException as e:
            logger.error(f"Error verifying site: {str(e)}")
            if hasattr(e, 'response') and hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            return {}

    def login(self, username: str, password: str) -> bool:
        # Use the UserManagement login method
        login_success = self.user_manager.login(username, password)

        if login_success:
            # Update our auth token from the UserManagement instance
            self.auth_token = self.user_manager.auth_token
            return True
        return False

    def configure_site(self) -> bool:
        if not self.auth_token:
            logger.error("Auth token required. Please login as admin first.")
            return False

        try:
            logger.info("Configuring site settings...")

            site_config = {
                "name": self.site_config["name"],
                "description": self.site_config["description"],
                "enable_downvotes": self.site_config["enable_downvotes"],
                "enable_nsfw": self.site_config["enable_nsfw"],
                "community_creation_admin_only": self.site_config["community_creation_admin_only"],
                "require_email_verification": self.site_config["require_email_verification"],
                "application_question": "Why would you like to join the WE4US community?",
                "private_instance": self.site_config["private_instance"],
                "federation_enabled": self.site_config["federation_enabled"]
            }

            logger.info(f"Applying site configuration: {site_config}")

            response = self.session.put(
                f"{self.base_url}/api/v3/site",
                json=site_config
            )

            response.raise_for_status()
            logger.info(f"Site configuration applied successfully: {response.status_code}")

            time.sleep(2)
            verification = self.verify_site()
            site_name = verification.get("site_view", {}).get("site", {}).get("name")
            logger.info(f"Verified site name is now: {site_name}")

            return site_name == self.site_config["name"]

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to configure site: {str(e)}")
            if hasattr(e, 'response') and hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            return False

    def create_communities(self) -> List[Dict]:
        if not self.auth_token:
            logger.error("Auth token required. Please login as admin first.")
            return []

        created_communities = []

        for community in self.communities:
            try:
                logger.info(f"Creating community: {community['name']}")

                # Check if community already exists
                search_response = self.session.get(
                    f"{self.base_url}/api/v3/community",
                    params={"name": community["name"]}
                )

                if search_response.status_code == 200 and "community_view" in search_response.json():
                    logger.info(f"Community {community['name']} already exists")
                    created_communities.append(search_response.json())
                    continue

                # Create the community
                response = self.session.post(
                    f"{self.base_url}/api/v3/community",
                    json={
                        "name": community["name"],
                        "title": community["title"],
                        "description": community["description"],
                        "nsfw": False,
                        "visibility": "Public"
                    }
                )

                response.raise_for_status()
                result = response.json()
                logger.info(f"Successfully created community: {community['name']}")
                created_communities.append(result)

                # Wait between community creations
                time.sleep(1)

            except requests.exceptions.RequestException as e:
                logger.error(f"Failed to create community {community['name']}: {str(e)}")
                if hasattr(e, 'response') and hasattr(e.response, 'text'):
                    logger.error(f"Response: {e.response.text}")

        return created_communities

def main():
    LEMMY_URL = "http://localhost:10633"
    ADMIN_USERNAME = "" # left blank intentionally
    ADMIN_PASSWORD = ""

    setup = LemmySetup(LEMMY_URL, ADMIN_USERNAME, ADMIN_PASSWORD)

    if not setup.login(ADMIN_USERNAME, ADMIN_PASSWORD):
        logger.error("Failed to login as admin. Please check your credentials.")
        return

    # Verify site setup first
    logger.info("Performing initial site verification...")
    setup.verify_site()

    # Configure the site with WE4US settings
    logger.info("Configuring site with WE4US settings...")
    if setup.configure_site():
        logger.info("Site configuration successful!")
    else:
        logger.error("Site configuration failed!")

    # Create communities
    logger.info("Creating communities...")
    communities = setup.create_communities()
    logger.info(f"Created/verified {len(communities)} communities")

    csv_path = 'sample_users.csv'
    if csv_path:
        logger.info(f"Registering users from {csv_path}...")
        registered = setup.user_manager.bulk_register_users_from_csv(csv_path)
        logger.info(f"Registered {len(registered)} users")

    # Verify site after user registration
    logger.info("Performing final site verification...")
    setup.verify_site()

    logger.info("Setup process completed!")

if __name__ == "__main__":
    main()