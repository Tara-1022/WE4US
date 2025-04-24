"https://mv-gh.github.io/lemmy_openapi_spec/#tag/Site/paths/~1site/get"

import requests
import time
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_URL = "http://localhost:10633/api/v3"

ADMIN_USERNAME = "cohort2_user2"
ADMIN_PASSWORD = "nishita123"
EMAIL = "admin@localhost"

# Standard communities to create
COMMUNITIES = [
    {"name": "job_board", "title": "Job Board", "description": "List job and internship openings"},
    {"name": "announcements", "title": "Announcements", "description": "Important announcements and updates"},
    {"name": "pg_finder", "title": "PG Finder", "description": "PG recommendations with reviews"},
    {"name": "meet_up", "title": "Meet Up", "description": "Upcoming meet-up events and activities"}
]

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
    
    get_site_res = requests.get(f"{BASE_URL}/site", headers=headers)
    if get_site_res.status_code != 200:
        print(f"[-] Failed to get site config: {get_site_res.status_code} - {get_site_res.text}")
        return False
    
    current_site_data = get_site_res.json()
    
    if "site" not in current_site_data:
        print("[-] Invalid site data returned")
        return False
    
    print("[+] Retrieved current site configuration")
    
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
    
    if res.status_code != 200:
        print(f"[-] Failed to configure site: {res.status_code} - {res.text}")
        return False
        
    verify_res = requests.get(f"{BASE_URL}/site", headers=headers)
    if verify_res.status_code != 200:
        print(f"[-] Failed to verify site config: {verify_res.status_code}")
        return False
        
    updated_site_data = verify_res.json()
    
    if "site" not in updated_site_data:
        print("[-] Invalid site data returned during verification")
        return False
        
    # Check key settings to ensure they were updated correctly
    site_settings = updated_site_data["site"]
    if (site_settings.get("name") != SITE_CONFIG["name"] or
            site_settings.get("private_instance") != SITE_CONFIG["private_instance"] or
            site_settings.get("federation_enabled", True) != SITE_CONFIG["federation_enabled"]):
        print("[-] Site configuration didn't update correctly!")
        print(f"Expected: {SITE_CONFIG}")
        print(f"Got: {site_settings}")
        return False
        
    print("[+] Site configured successfully and verified.")
    return True

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

def create_test_users(jwt_token, excel_path):
    try:
        df = pd.read_excel(excel_path)
        
        for _, row in df.iterrows():
            email = row.get('Email', '')
            username = email.split('@')[0].replace('.', '_')
            password = "WE4US_Password!123"
            is_admin = row.get('IsAdmin', False)
            
            try:
                # Register regular user
                res = requests.post(f"{BASE_URL}/user/register", json={
                    "username": username,
                    "password": password,
                    "password_verify": password,
                    "email": email,
                    "show_nsfw": True 
                })
                
                if res.status_code == 200:
                    print(f"[+] Created test user: {username} / {email}")
                    
                    # If this user should be an admin and isn't the main admin, promote them
                    if is_admin and username != ADMIN_USERNAME:
                        user_jwt = res.json().get("jwt")
                        if user_jwt:
                            # TODO: Add code to make this user an admin if needed
                            # This would require proper Lemmy API calls to promote a user
                            pass
                else:
                    print(f"[!] Failed to create user {username}: {res.status_code} - {res.text}")
            except Exception as e:
                print(f"[!] Error creating user {username}: {str(e)}")
            
            time.sleep(0.5)
            
    except Exception as e:
        print(f"[!] Error processing Excel file: {str(e)}")

if __name__ == "__main__":
    print("[*] Starting Lemmy setup...")
    
    try:
        jwt = register_or_login()
        
        print("[*] Setting up site configuration...")
        site_setup_success = setup_site(jwt)
        if not site_setup_success:
            print("[-] Site setup failed, but continuing with other tasks...")
        
        print("[*] Creating standard communities...")
        create_communities(jwt)
        
        excel_path = os.path.join(BASE_DIR, "test_users.xlsx")
	print("[*] Creating test users from Excel file...")
        create_test_users(jwt, excel_path)
        
        # Final verification of site configuration
        print("[*] Performing final site configuration verification...")
        headers = {"Authorization": f"Bearer {jwt}"}
        final_check = requests.get(f"{BASE_URL}/site", headers=headers)
        if final_check.status_code == 200:
            site_data = final_check.json()
            if "site" in site_data and site_data["site"].get("name") == SITE_CONFIG["name"]:
                print("[+] Final verification successful - site is configured correctly!")
            else:
                print("[-] Warning: Final verification shows site may not be configured correctly.")
                print(f"Current site configuration: {site_data.get('site', {})}")
        else:
            print(f"[-] Warning: Could not verify final site configuration: {final_check.status_code}")
        
        print("[+] Setup complete!")
    except Exception as e:
        print(f"[-] Setup failed: {str(e)}")
