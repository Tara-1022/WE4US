# Server configuration
LEMMY_API_URL = "http://localhost:10633/api/v3"
PHOENIX_API_URL = "http://localhost:4000/api"

# Admin credentials - MUST BE SET BEFORE RUNNING THE SCRIPT
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "{{ADMIN_PASSWORD_AS_PER_LEMMY_HJSON}}"

# For User Generation
CSV_FILE = "sample_users.csv"
DEFAULT_PASSWORD="{{CHANGE_THIS_PASSWORD_FOR_EVERY_BATCH}}"

# Community configuration - DO NOT CHANGE
COMMUNITY_NSFW = True

SITE_CONFIG = {
    "name": "WE4US",
    "description": "A platform for students to connect, share, and grow.",
    "enable_downvotes": True,
    "enable_nsfw": True,
    "community_creation_admin_only": True,
    "require_email_verification": False,
    "application_question": "Why would you like to join the WE4US community?",
    "private_instance": True,
    "federation_enabled": False,
    "registration_mode": "RequireApplication"
}

COMMUNITIES = [
    {"name": "job_board", "title": "Job Board", "description": "List job and internship openings"},
    {"name": "announcements", "title": "Announcements", "description": "Important announcements and updates"},
    {"name": "pg_finder", "title": "PG Finder", "description": "PG recommendations with reviews"},
    {"name": "meet_up", "title": "Meet Up", "description": "Upcoming meet-up events and activities"}
]
