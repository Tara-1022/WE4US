defmodule We4us.Repo do
  use Ecto.Repo,
    otp_app: :we4us,
    adapter: Ecto.Adapters.Postgres
end
