"https://mv-gh.github.io/lemmy_openapi_spec/#tag/Site/paths/~1site/get"

import requests
import time
import pandas as pd
import os
from user_management import UserManager

BASE_URL = "http://localhost:10633/api/v3"

ADMIN_USERNAME = "cohort2_user2"
ADMIN_PASSWORD = "nishita123"
EMAIL = "admin@localhost"

SITE_CONFIG = {
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

COMMUNITIES = [
    {"name": "job_board", "title": "Job Board", "description": "List job and internship openings"},
    {"name": "announcements", "title": "Announcements", "description": "Important announcements and updates"},
    {"name": "pg_finder", "title": "PG Finder", "description": "PG recommendations with reviews"},
    {"name": "meet_up", "title": "Meet Up", "description": "Upcoming meet-up events and activities"}
]

def register_or_login():
    # Try login
    login_res = requests.post(f"{BASE_URL}/user/login", json={
        "username_or_email": ADMIN_USERNAME,
        "password": ADMIN_PASSWORD
    })

    if login_res.status_code == 200 and "jwt" in login_res.json():
        print("[+] Logged in as admin.")
        return login_res.json()["jwt"] 

    # Else register
    print("[*] Registering new admin...")
    reg_res = requests.post(f"{BASE_URL}/user/register", json={
        "username": ADMIN_USERNAME,
        "password": ADMIN_PASSWORD,
        "password_verify": ADMIN_PASSWORD,
        "email": EMAIL,
        "show_nsfw": True
    })

    if reg_res.status_code != 200 or "jwt" not in reg_res.json():
        raise Exception("[-] Failed to register admin: " + reg_res.text)

    print("[+] Admin registered.")
    return reg_res.json()["jwt"]  

def setup_site(jwt_token):
    headers = {"Authorization": f"Bearer {jwt_token}"}
    
    site_config = {
        "name": SITE_CONFIG["name"],
        "sidebar": SITE_CONFIG["description"],
        "description": SITE_CONFIG["description"],
        "enable_downvotes": SITE_CONFIG["enable_downvotes"],
        "enable_nsfw": SITE_CONFIG["enable_nsfw"],
        "community_creation_admin_only": SITE_CONFIG["community_creation_admin_only"],
        "require_email_verification": SITE_CONFIG["require_email_verification"],
        "application_question": SITE_CONFIG["application_question"],
        "private_instance": SITE_CONFIG["private_instance"],
        "federation_enabled": SITE_CONFIG["federation_enabled"]
    }
    
    res = requests.put(f"{BASE_URL}/site", headers=headers, json={"site": site_config})
    
    if res.status_code == 200:
        print("[+] Site configured successfully.")
        
        # Verify settings were applied correctly
        verify_res = requests.get(f"{BASE_URL}/site", headers=headers)
        if verify_res.status_code == 200:
            verify_data = verify_res.json()
            site_view = verify_data.get("site_view", {}).get("site", {})
            
            if site_view.get("name") == SITE_CONFIG["name"] and \
               site_view.get("private_instance") == SITE_CONFIG["private_instance"] and \
               site_view.get("federation_enabled", None) == SITE_CONFIG.get("federation_enabled", None):
                print("[+] Site configuration verified.")
            else:
                print("[-] Site configuration verification failed! Settings don't match requested values.")
                print(f"    Expected: {SITE_CONFIG}")
                print(f"    Actual: {site_view}")
        else:
            print(f"[-] Failed to verify site config: {verify_res.status_code} - {verify_res.text}")
    else:
        print(f"[-] Failed to configure site: {res.status_code} - {res.text}")

def create_communities(jwt_token):
    headers = {"Authorization": f"Bearer {jwt_token}"}

    for comm in COMMUNITIES:
        try:
            res = requests.post(f"{BASE_URL}/community", headers=headers, json={
                "name": comm["name"],
                "title": comm["title"],
                "description": comm["description"],
                "nsfw": True,  
                "icon": None,
                "banner": None
            })

            if res.status_code == 200:
                print(f"[+] Created community: {comm['name']}")
            else:
                print(f"[!] Failed to create community {comm['name']}: {res.status_code} - {res.text}")
        except Exception as e:
            print(f"[!] Error creating community {comm['name']}: {str(e)}")

if __name__ == "__main__":
    print("[*] Starting Lemmy setup...")
    
    try:
        jwt = register_or_login()
        
        print("[*] Setting up site configuration...")
        setup_site(jwt)
        
        print("[*] Creating standard communities...")
        create_communities(jwt)
        
        excel_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_users.xlsx")
        print("[*] Creating test users from Excel file...")
        
        # Use the UserManager to create users
        user_manager = UserManager(BASE_URL, jwt)
        successful, errors = user_manager.create_users_from_excel(excel_path)
        print(f"[*] User creation completed: {successful} successful, {errors} with errors")
        if errors > 0:
            print("[!] Check error_users_*.csv file for details on failed users")
        
        # Final verification of site settings
        headers = {"Authorization": f"Bearer {jwt}"}
        final_check = requests.get(f"{BASE_URL}/site", headers=headers)
        if final_check.status_code == 200:
            site_data = final_check.json().get("site_view", {}).get("site", {})
            print("\n[*] Final site configuration check:")
            print(f"    Site name: {site_data.get('name')}")
            print(f"    Private instance: {site_data.get('private_instance')}")
            print(f"    Federation enabled: {site_data.get('federation_enabled', 'Not available')}")
        
        print("[+] Setup complete!")
    except Exception as e:
        print(f"[-] Setup failed: {str(e)}")