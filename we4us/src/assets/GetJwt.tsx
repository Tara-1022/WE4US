import { LemmyHttp } from "lemmy-js-client";

const client = new LemmyHttp("http://localhost:10633");

async function getJwt() {
  try {
    const response = await client.login({
      username_or_email: "username",
      password: "password"
    });

    console.log("JWT Token:", response.jwt);
  } catch (error) {
    console.error("Incorrect Password", error);
  }
}

getJwt();
