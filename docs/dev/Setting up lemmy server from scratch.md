# **This file is now rendered irrelevant**

**Setting up from scratch is hard + we are using docker in prod anyway. See `docs/dev/Setting up lemmy via docker.md` to setup Lemmy**

---------------------------------------------

Tweaked from the steps at https://join-lemmy.org/docs/administration/from_scratch.html

Rewritten below, with the changed segments highlighted.

first part is the same. run commands until 'Install rust'.

### Setup
#### Install dependencies
```
sudo apt install -y wget ca-certificates pkg-config
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
sudo apt update
sudo apt install libssl-dev libpq-dev postgresql
```

#### Setup Lemmy database
replace 'db-passwd' with password of choice and *note it down for later*
```
sudo -iu postgres psql -c "CREATE USER lemmy WITH PASSWORD 'db-passwd';"
sudo -iu postgres psql -c "CREATE DATABASE lemmy WITH OWNER lemmy;"
```

#### Install rust
as said, follow the instructions at [Rustup](https://rustup.rs/)
i.e, for wsl:
`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
 
 >After installation, check the docker file (which we know works) and ensure the correct version of rust is installed: https://github.com/LemmyNet/lemmy/blob/main/docker/Dockerfile 
>
>Right now it's 1.81 (if you're installing pict-rs separately, use 1.82)
>
>do > rustup default 1.81

Not sure if protobuf-compiler is needed or not. I ran the command anyway
`sudo apt install protobuf-compiler gcc`

#### Setup pict-rs (Optional)
I built it from source ([Standalone pict-rs installation](https://join-lemmy.org/docs/administration/from_scratch.html#install-dependencies:~:text=Standalone%20pict%2Drs%20installation)), but ended up using the embedded one anyway. Better to skip this step for now.

### Lemmy Backend

Create user account: `sudo adduser lemmy --system --disabled-login --no-create-home --group`

Fetch the code from git
```
git clone https://github.com/LemmyNet/lemmy.git lemmy 
cd lemmy
```

>after cloning into git, run `git checkout release/v0.19`
>The docs install an older version of lemmy, which I did not want.

Follow the next steps

```
git submodule init 
git submodule update --recursive --remote echo "pub const VERSION: &str = \"$(git describe --tag)\";" > "crates/utils/src/version.rs"
```

##### Error 
Got this error in the next step
```
error: failed to run custom build command for `lemmy_utils v0.19.8 (/mnt/e/lemmy_scratch/lemmy/crates/utils)`

Caused by:
  process didn't exit successfully: `/mnt/e/lemmy_scratch/lemmy/target/release/build/lemmy_utils-ab94b42c2698552d/build-script-build` (exit status: 1)
  --- stdout
  cargo:rerun-if-changed=translations/email/en.json

  --- stderr
  Error: Parse(InvalidParameters { key: "notification_post_reply_body", missing: ["post_title", "comment_link"], unknown: [] })
  ```

Ended up being because the version of the translations submodule did not match the expected one for that release.

>Go to `https://github.com/LemmyNet/lemmy-translations.git`, branch `11aacb1`. 
>Download the code, and replace the contents of lemmy/crates/utils/translations entirely with this.

TODO: write a better flow for this as per https://stackoverflow.com/questions/826715/how-do-i-manage-conflicts-with-git-submodules#:~:text=First%2C%20find%20the%20hash%20you%20want%20to%20your%20submodule%20to%20reference.%20then%20run
#### Build
Run  `cargo build --release` to build a release (optimised) version

>For me, this ended up with a `(signal: 9, SIGKILL: kill)` when building lemmy_server, indicating I ran out of memory. Probably because I'm using WSL (which eats up some memory), and I have only 8GB RAM in the first place.

>For dev purposes, a regular `cargo build` should work fine. (or, `cargo build --verbose` allows better debugging if needed)

If you're using the embedded pict-rs (or not able to set up pict-rs from scratch) use `cargo build --features embed-pictrs` Pict-rs is used to store images.

You now have the build in the targets/debug folder. 

#### Deployment

run
```
sudo mkdir /opt/lemmy
sudo mkdir /opt/lemmy/lemmy-server
sudo mkdir /opt/lemmy/pictrs
sudo mkdir /opt/lemmy/pictrs/files
sudo mkdir /opt/lemmy/pictrs/sled-repo
sudo mkdir /opt/lemmy/pictrs/old
sudo chown -R lemmy:lemmy /opt/lemmy
```

run 
```
sudo cp target/release/lemmy_server /opt/lemmy/lemmy-server/lemmy_server
```

paste these contents into /opt/lemmy/lemmy-server/lemmy.hjson
replace db-passwd with whatever you used earlier

>**NOTE**: If you get an error like below, check the [defaults.hjson](https://github.com/LemmyNet/lemmy/blob/main/config/defaults.hjson) for the specific version you're installing.  The newer builds require a connection string instead of database-password.
```
 Starting Lemmy v0.20.0-alpha.5
Feb 06 12:19:55 fyg lemmy_server[635]: thread 'main' panicked at crates/utils/src/settings/mod.rs:22:22:
Feb 06 12:19:55 fyg lemmy_server[635]: Failed to load settings file, see documentation (https://join-lemmy.org/docs/en/administration/configuration.html).:>
Feb 06 12:19:55 fyg lemmy_server[635]: note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
Feb 06 12:19:55 fyg systemd[1]: lemmy.service: Main process exited, code=exited, status=101/n/a
Feb 06 12:19:55 fyg systemd[1]: lemmy.service: Failed with result 'exit-code'.
```

```
{
  database: {
    password: "db-passwd"
  }
  # replace with your domain
  hostname: example.com
  bind: "127.0.0.1"
  federation: {
    enabled: false
  }
  # remove this block if you don't require image hosting
  pictrs: {
    url: "http://localhost:8080/"
  }
}
```

run `chown -R lemmy:lemmy /opt/lemmy/`

create/open file `/etc/systemd/system/lemmy.service`
and paste this
```
[Unit]
Description=Lemmy Server
After=network.target

[Service]
User=lemmy
ExecStart=/opt/lemmy/lemmy-server/lemmy_server
Environment=LEMMY_CONFIG_LOCATION=/opt/lemmy/lemmy-server/lemmy.hjson
Environment=PICTRS_ADDR=127.0.0.1:8080
Environment=RUST_LOG="debug,lemmy_server=debug,lemmy_api=debug,lemmy_api_common=debug,lemmy_api_crud=debug,lemmy_apub=debug,lemmy_db_schema=debug,lemmy_db_views=debug,lemmy_db_views_actor=debug,lemmy_db_views_moderator=debug,lemmy_routes=debug,lemmy_utils=debug,lemmy_websocket=debug"
Restart=on-failure
WorkingDirectory=/opt/lemmy

# Hardening
ProtectSystem=yes
PrivateTmp=true
MemoryDenyWriteExecute=true
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

finally, run
```
sudo systemctl daemon-reload
sudo systemctl start lemmy
```

>to pull the server down, run
>`sudo systemctl stop lemmy`

if you want the server to start up every time the system does, run
`sudo systemctl enable lemmy` after the daemon-reload command

#### See the logs
`sudo journalctl -u lemmy` shows all logs.

#### API requests
requests should be directed to `localhost:8536` (NOT 10633, this was what is set up in the docker file through port forwarding)

### UI
I'm not setting up the lemmy-ui because we'll be working on our own, and i'm having issues setting up npm in WSL.
