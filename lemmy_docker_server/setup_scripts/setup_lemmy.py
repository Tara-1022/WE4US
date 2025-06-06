import requests
import time
import sys
import logging
from typing import Dict, List

from constants import LEMMY_API_URL, ADMIN_USERNAME, ADMIN_PASSWORD, SITE_CONFIG, COMMUNITIES, COMMUNITY_NSFW

# ADMIN MUST FIRST BE SETUP WITH THE OFFICIAL UI/COMMAND LINE

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
    def __init__(self):
        self.auth_token = None
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "User-Agent": "WE4US-Setup-Script/1.0"
        })

        self.communities = COMMUNITIES
        self.site_config = SITE_CONFIG

    def verify_site(self) -> dict:
        try:
            logger.info("Verifying site configuration...")
            response = self.session.get(f"{LEMMY_API_URL}/site")

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

    def configure_site(self) -> bool:
        if not self.auth_token:
            logger.error("Auth token required. Please login as admin first.")
            return False

        try:
            logger.info("Configuring site settings...")
            logger.info(f"Applying site configuration: {self.site_config}")

            response = self.session.put(
                f"{LEMMY_API_URL}/site",
                json=self.site_config
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
                    f"{LEMMY_API_URL}/community",
                    params={"name": community["name"]}
                )

                if search_response.status_code == 200 and "community_view" in search_response.json():
                    logger.info(f"Community {community['name']} already exists")
                    created_communities.append(search_response.json())
                    continue

                # Create the community
                response = self.session.post(
                    f"{LEMMY_API_URL}/community",
                    json={
                        "name": community["name"],
                        "title": community["title"],
                        "description": community["description"],
                        "nsfw": COMMUNITY_NSFW,
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
    logger.info("Starting Lemmy setup process...")

    if not ADMIN_USERNAME or not ADMIN_PASSWORD:
        logger.error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in constants.py before running the script.")
        return

    # Initialize the setup
    setup = LemmySetup()

    # Login as admin
    if not setup.login(ADMIN_USERNAME, ADMIN_PASSWORD):
        logger.error("Failed to login as admin. Setup cannot proceed.")
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

    # Verify site after setup
    logger.info("Performing final site verification...")
    setup.verify_site()

    logger.info("Setup process completed!")

if __name__ == "__main__":
    main()