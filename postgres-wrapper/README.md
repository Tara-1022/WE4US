# Phoenix Backend Setup Guide

## Prerequisites

Ensure you have the following installed:
- **Elixir** (>= 1.17) – Check with `elixir -v`
- **Erlang/OTP** – Installed along with Elixir
- **Phoenix Framework** – Install with `mix archive.install hex phx_new`
- **PostgreSQL** (>= 14) – Ensure it's running (`sudo service postgresql start`)
- **inotify-tools** (for Linux file watching) – Install with `sudo apt install inotify-tools`

## Setup Instructions

### 1. Clone the repository
```sh
git clone <repo-url>
cd postgres-wrapper
```

### 2. Install dependencies
```sh
mix deps.get
mix deps.compile
```

### 3. Configure database connection

#### Update `config/dev.exs` with correct PostgreSQL credentials:
```elixir
config :we4us, We4Us.Repo,
  username: "your_postgres_username",
  password: "your_postgres_password",
  database: "we4us_dev",
  hostname: "localhost",
  show_sensitive_data_on_connection_error: true,
  pool_size: 10
```

> ⚠️ If you get a database connection error, follow the PostgreSQL troubleshooting steps below.

### 4. Set up the database
```sh
mix ecto.create
mix ecto.migrate
mix run priv/repo/seeds.exs
```

### 5. Start the Phoenix server
```sh
mix phx.server
```

The API should now be running at `http://localhost:4000`.

## PostgreSQL Troubleshooting

### Reset PostgreSQL Password
1. Locate `pg_hba.conf`:
   ```sh
   sudo nano /etc/postgresql/16/main/pg_hba.conf
   ```
   > Replace `16` with your PostgreSQL version.

2. Find this line:
   ```
   local    all      postgres     peer
   ```
   Change `peer` to `trust` temporarily.

3. Restart PostgreSQL:
   ```sh
   sudo service postgresql restart
   ```

4. Connect to PostgreSQL:
   ```sh
   psql -U postgres
   ```

5. Reset your password:
   ```sql
   ALTER USER your_postgres_username WITH PASSWORD 'your_new_password';
   ```

6. Exit PostgreSQL:
   ```sh
   \q
   ```

7. Revert `pg_hba.conf` changes (`trust` → `md5`) and restart PostgreSQL again.

## CORS Configuration
If you encounter CORS issues, check `lib/we4us_web/endpoint.ex` and update:
```elixir
plug CORSPlug, origin: ["http://localhost:5173"]
```
If using a different frontend port, update accordingly (e.g., `5174`).

## Learn More
- [Phoenix Deployment Guide](https://hexdocs.pm/phoenix/deployment.html)
- Key files for reference:
  - `lib/we4us/profiles/profile.ex`
  - `lib/we4us_web/controllers/profile_controller.ex`
  - `lib/we4us_web/endpoint.ex`
  - `config/dev.exs`
