The default endpoint for lemmy server is `http://localhost:8536`. If you've set it up via docker, the port number is based on the forwarding in your yaml file. This is usually forwarded to `http://localhost:10633`

Unofficial API docs: https://mv-gh.github.io/lemmy_openapi_spec/#tag/Site/paths/~1site/get

Official docs (less useful): https://join-lemmy.org/docs/contributors/04-api.html

Since the instance is private, it denies almost all API actions unless you're logged in as a valid user. Once you're logged in, save the `jwt` token in the response and replace it wherever mentioned below.
## Lemmy API Curl Commands
Sample curl commands:

**Get basic info**
`curl localhost:10633/api/v3/site`

**Log in**
```bash
curl --request POST \
     --url http://localhost:10633/api/v3/user/login \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "username_or_email": "<username>",
  "password": "<password>"
}
'
```

The response contains the jwt token. take note of it.

**Validate login**
```bash
curl --request GET http://localhost:10633/api/v3/user/validate_auth \
     --header "Authorization: Bearer <jwt>"
```

**List recent posts**
```bash
curl --request GET \
     --url http://localhost:10633/api/v3/post/list \
     --header "Authorization: Bearer <jwt>"
```

**List community info**
```bash
curl --request GET \
     --url http://localhost:10633/api/v3/community/list \
     --header "Authorization: Bearer <jwt>"
```

**Create post**
Make sure there is an existing community first. Replace community_id with whatever the id required is. The first community created has the id 2.
```bash
curl --request POST \
     --url http://localhost:10633/api/v3/post \
     --header "Authorization: Bearer <jwt>"\
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
     {
        "name": "API post",
        "community_id":2,
        "body": "this post was made via api"
     }
     '
```
## PostgreSQL-backed API Curl Commands

These commands interact with the API running on `http://localhost:4000`, which manages user profiles and messages in a PostgreSQL database.

### Profiles

**Get All Profiles**
```bash
curl -i -X GET http://localhost:4000/api/profiles
```

**Get a Single Profile**
```bash
curl -i -X GET http://localhost:4000/api/profiles/1
curl -i -X GET http://localhost:4000/api/profiles/9999
curl -i -X GET http://localhost:4000/api/profiles/abc
```

**Create a New Profile**
```bash
curl -X POST http://localhost:4000/api/profiles \
           -H "Content-Type: application/json" \
           -H "Authorization: Bearer <jwt>" \
           -d '{
                "profile": {
                     "username": "newUser",
                     "display_name": "New User",
                     "cohort": "4",
                     "current_role": "Data Scientist",
                     "company_or_university": "Meta",
                     "working_since": "1999",
                     "areas_of_interest": ["AI", "Big Data"]
                }
           }'
```

**Update a Profile**
```bash
curl -X PUT "http://localhost:4000/api/profiles/<username>" \
           -H "Content-Type: application/json" \
           -H "Authorization: Bearer <jwt>" \
           -d '{
                "profile": {
                     "display_name": "Updated User"
                }
           }'
```

**Delete a Profile**
```bash
curl -X DELETE "http://localhost:4000/api/profiles/<username>" \
           -H "Authorization: Bearer <jwt>"
```

**Update Profile Image**
```bash
curl -X PUT http://localhost:4000/api/profiles/<username> \
           -H "Content-Type: application/json" \
           -H "Authorization: Bearer <jwt>" \
           -d '{
                "profile": {
                     "image_filename": null,
                     "image_delete_token": null
                }
           }'
```

### Messages

**Get Last Message**
```bash
curl -i -X GET http://localhost:4000/api/messages/last/<username> \
           -H "Content-Type: application/json" \
           -H "Authorization: Bearer <jwt>"
```

## Python
You could also play around with the API like this

```python
import requests
import json

ENDPOINT = r"http://localhost:<port_number>"

# Will be required for most requests
headers={"Authorization":"Bearer <jwt>"}

# See basic info
response = requests.get(ENDPOINT + r"/api/status")
print(response.text)

# List posts
response = requests.get(ENDPOINT + r"/api/v3/post/list", headers=headers)
j = json.loads(response.text)
print("Raw json:", j)

# Inspect name and body of the first post
print(j["posts"][0]["post"]["name"])
print(j["posts"][0]["post"]["body"])
```