## Original Flow
This is the steps I followed to get it up. You can also skip to 'Alternate flow' to get the final files.

Based on https://join-lemmy.org/docs/administration/install_docker.html

create and cd into any dedicated folder for this. Mine was lemmy_docker

follow the steps a mentioned from [downloading files](https://join-lemmy.org/docs/administration/install_docker.html#:~:text=Then%20download%20default%20config%20files%3A) to [folder permissions](https://join-lemmy.org/docs/administration/install_docker.html#folder-permissions)

After docker compose up, you should see the UI at at `http://localhost:10633/` 
### Debugging
If you're using WSL and the server doesn't seem to work, inspect the logs with

`docker compose logs -f lemmy` and `docker compose logs -f postgres`

Seeing a database connection error at lemmy, and `error: initdb: error: could not change permissions of directory "/var/lib/postgresql/data": Operation not permitted` at postgres. This could be because you're using WSL.

Solution is found [here](https://forums.docker.com/t/data-directory-var-lib-postgresql-data-pgdata-has-wrong-ownership/17963/5#:~:text=This%20problem%20is%20still%20present%20in%20beta19.)

Essentially, in docker-compose.yaml, under `postgres: volumes:`
the first in the list looks something like
- `postgres...:/var/lib/postgresql/data:Z`
remove everything before and after the colon (`:`). i.e, it is now 
- `/var/lib/postgresql/data`

Don't change anything else. run `docker compose up -d` again and you should see the UI 

## Alternate flow

Download the files under `lemmy_docker_server` in this repo.

*Optionally, optimise the database by*
- *cd into the directory (where you downloaded the files)*
- *run `wget https://raw.githubusercontent.com/LemmyNet/lemmy-ansible/main/examples/customPostgresql.conf`*

Run 
```
mkdir -p volumes/pictrs
sudo chown -R 991:991 volumes/pictrs
```

Now, run 
`docker compose up -d` and access at [http://localhost:10633/](http://localhost:10633/)

make sure to run `docker compose down` when you're done.
## Set-up
set up an admin account (email optional) with

Federation: off
Private instance: on
Language: English
## Inspect
You can inspect logs with `docker compose logs -f <component>`

To inspect database, 
run 
```
[sudo] docker exec -it  <container_name> psql -h localhost -p 5432 -U <postgresql_user> -d lemmy
```
Sudo is optional. The container name can be seen with `docker ps -a`, it is usually `lemmy-postgres-1`. The `postgresql_user` is in the yaml file, and is usally `lemmy`.

Now you're in the postgres interaction. run `\dt` to see all tables.