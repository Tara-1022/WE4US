
| *Web-only (phoenix)*                                                                                                   | **React (React JS)**              | React (start with RN)                     |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------- |
| *- Communities aren't really built around mobile application - convenience (discourse) impromptu nature & informality* | **- Less risk for web app**       | - More effort early on but easy to deploy |
| *- fast set up & streamlined dev; scalable*                                                                            | **- potentially more work later** | - Risk of difficulties for RN-web         |
| *- less well-known & less community support*                                                                           |                                   |                                           |
| *- More 'barebones'*                                                                                                   | difficulty                        |                                           |

## 05/02
- [x] set up react UI (menu with 3)
- [x] Figuring out voyager - **difficult**
- [ ] landing page displaying n recent posts
- [x] set Google auth lemmy login - **on hold**
## 07/02/25
- [x] landing page displaying *n* recent posts - Tara
	- [x] Fetch posts (06/02)
	- [x] Proper styling
- [x] Setting up routes - Saathwika
- [ ] 'Create community' component; review them first? - Naveena
	- [x] Review React
- [ ] Google auth - trying again [based on the response](https://github.com/LemmyNet/lemmy/issues/2930#:~:text=%40Tara%2D1022%20You%20can%20use%20the%20development%20version%2C%20using%20dessalines/lemmy%3A0.20.0%2Dalpha.5.%20Note%20that%20the%20frontend%20is%20not%20updated%20for%20the%20new%20version%20yet); assuming they meant [this commit](https://github.com/LemmyNet/lemmy/commit/f7ab9cebd53d9cf57309b6fb6cd5e7773ea7be85) - Tara
	- [x] Build server with Oauth (06/02)
	- [x] Oauth set up steps (enable + log in) - tedious setting up with just cli. 
### 08/02
- [x] Going over basics - Nishita
## 10/02
- [ ] Design decisions - Nishita + Soumili (13/02)
- [ ] push routing changes - Saathwika (10/02)
- [ ] 'Create post' page - common component - Saathwika
- [ ] Full post page - Tara 
	- [ ] render posts (10/02)
	- [ ] render comments
	- [ ] comment creation
	- [ ] reflect votes
- [ ] 'Create community' component; review them first? - Naveena
	- [x] Set up private instance
	- [ ] Create UI form + API interaction (12/02)
-------------------
Task pool
- [ ] more (relevant) details to post in feed
- [ ] search and filter feature within feed
- [ ] issue persisting data in docker setup
- [ ] bugs in setting up pict-rs from scratch
- [ ]  Google auth - Tara
	- [ ] E2E with UI  - **On hold** till UI is mostly ready
- [ ] Improve Sidebar ui (https://www.youtube.com/watch?v=YOV_nrl0sfI)
- [ ] Set up themes when it comes to site colours

-----------
debugging commands:
```
sudo cp target/debug/lemmy_server /opt/lemmy/lemmy-server/lemmy_server
 sudo nano /etc/systemd/system/lemmy.service
  sudo journalctl -u lemmy -n 150
  cat /opt/lemmy/lemmy-server/lemmy.hjson
```
-----------------
OAuth
send API request based on [request struct](https://github.com/LemmyNet/lemmy/blob/main/crates/api_common/src/oauth_provider.rs#L13) and [request path](https://github.com/LemmyNet/lemmy/blob/main/src/api_routes_v4.rs#L415) for OAuth, available in v4 api only.
```json
pub struct CreateOAuthProvider {
 ...
}
```
referring the known [create post api format](https://github.com/LemmyNet/lemmy/blob/main/crates/api_common/src/post.rs#L24). request and [google's set up steps](https://developers.google.com/identity/sign-in/web/sign-in)
see [scopes](https://developers.google.com/identity/protocols/oauth2/scopes#google-sign-in), [OIDC spec scopes](https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims)

**Full steps**
- log in to admin account & obtain jwt
```
curl --request POST \
     --url http://localhost:8536/api/v3/user/login \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "username_or_email": "admin",
  "password": "admin12345"
}
'
```
jwt: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaXNzIjoid2U0dXMuaW4iLCJpYXQiOjE3Mzg5MTg2ODB9.wwMAXs9KBHcl0GCCr1MMsUR3ntJ60GBXHYJ_1Pj_G1s
```
# testing by creating community
curl --request POST \
  --url http://localhost:8536/api/v4/community \
  --header 'content-type: application/json' \
  --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaXNzIjoid2U0dXMuaW4iLCJpYXQiOjE3Mzg5MTg2ODB9.wwMAXs9KBHcl0GCCr1MMsUR3ntJ60GBXHYJ_1Pj_G1s"\
  --data '{
    "name": "Community1",
    "title": "First",
    "visibility": "LocalOnly"
  }' --verbose
```
{"community_view":{"community":{"id":2,"name":"Community1","title":"First","removed":false,"published":"2025-02-07T08:58:52.381374Z","deleted":false,"nsfw":false,"actor_id":"https://we4us.in/c/Community1","local":true,"hidden":false,"posting_restricted_to_mods":false,"instance_id":1,"visibility":"LocalOnly"},"subscribed":"Subscribed","blocked":false,"counts":{"community_id":2,"
```
curl --request PUT "http://localhost:8536/api/v4/site" \
    --header 'content-type: application/json' \
     --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaXNzIjoid2U0dXMuaW4iLCJpYXQiOjE3Mzg5MTg2ODB9.wwMAXs9KBHcl0GCCr1MMsUR3ntJ60GBXHYJ_1Pj_G1s"\
        --data '
        {
  "name": "WE4US",
  "description": "string",
  "community_creation_admin_only": true,
  "require_email_verification": false,
  "private_instance": true,
  "federation_enabled": false
}' --verbose
```
- set up oauth
```
curl --request POST "http://localhost:8536/api/v4/oauth_provider" \
     --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaXNzIjoid2U0dXMuaW4iLCJpYXQiOjE3Mzg5MTg2ODB9.wwMAXs9KBHcl0GCCr1MMsUR3ntJ60GBXHYJ_1Pj_G1s"\
    --header 'content-type: application/json' \
        --data '{
  "display_name": "TestAuth",
  "issuer": "https://accounts.google.com",
  "authorization_endpoint": "https://accounts.google.com/o/oauth2/auth",
  "token_endpoint": "https://oauth2.googleapis.com/token",
  "userinfo_endpoint": "https://www.googleapis.com/oauth2/v3/userinfo",
  "id_claim": "sub",
  "client_id": "730846544451-8fp6qgqok3mif3sdoml03ec0pq7tkkfo.apps.googleusercontent.com",
  "client_secret": "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",
  "scopes": "profile, email, openid"
}' --verbose
```
{"id":1,"display_name":"TestAuth","issuer":"https://accounts.google.com/","authorization_endpoint":"https://accounts.google.com/o/oauth2/auth","token_endpoint":"https://oauth2.googleapis.com/token","userinfo_endpoint":"https://www.googleapis.com/oauth2/v3/userinfo","id_claim":"sub","client_id":"730846544451-8fp6qgqok3mif3sdoml03ec0pq7tkkfo.apps.googleusercontent.com","scopes":"profile, email, openid","auto_verify_email":true,"account_linking_enabled":false,"enabled":true,"published":"2025-02-07T09:00:51.250703Z","use_pkce":false}
- log in as user with oauth [should give OK response](https://github.com/LemmyNet/lemmy/blob/865f0734baa157e6b1a555496cf08a3e40bd7661/crates/api_crud/src/user/create.rs#L196)
```
curl --request POST "http://localhost:8536/api/v4/oauth/authenticate" \
    --header 'content-type: application/json' \
        --data '{
  "code": "",
  "oauth_provider_id": 1,
  "redirect_uri": "http://localhost:8536/land"
}' --verbose
```
probably have to get the code from UI once the google auth pops up & returns.