endpoint = r"http://localhost:10633"
import requests

import json

response = requests.get(endpoint + r"/api/status")
print(response.text)

headers={"Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaXNzIjoid2U0dXMiLCJpYXQiOjE3MzgyNDA5ODJ9.540HES3baJfvXy3GqzmBEnTmyvNA957bgCMaFmUmCqA"}

response = requests.get(r"http://localhost:10633/api/v3/post/list", headers=headers)
print(response.text)

j = json.loads(response.text)
print(j["posts"][0]["post"]["name"])
print(j["posts"][0]["post"]["body"])
print(j["posts"][1]["post"]["name"])
print(j["posts"][1]["post"]["creator"])
print(j["posts"][1]["post"]["name"])

curl --request POST \
     --url http://localhost:10633/api/v3/post \
     --header "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaXNzIjoid2U0dXMiLCJpYXQiOjE3MzgyNDA5ODJ9.540HES3baJfvXy3GqzmBEnTmyvNA957bgCMaFmUmCqA"\
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
     {
        "name": "API post",
        "community_id":2,
        "body": "this post was made via api"
     }
'
data = json.loads("""{
        "name": "API post 2",
        "community_id":2,
        "body": "this post was made via api second time"
        }"""
)
response = requests.post(r"http://localhost:10633/api/v3/post/list", headers=headers, data=data)

print(response.text)