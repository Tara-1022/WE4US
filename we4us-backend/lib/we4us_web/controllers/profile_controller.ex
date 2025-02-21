defmodule We4UsWeb.ProfileController do
  use We4UsWeb, :controller

  alias We4Us.Profiles

  # Fetch all profiles
  def index(conn, _params) do
    profiles = Profiles.list_profiles()
    json(conn, profiles)
  end

  # Fetch a profile by ID
  def show(conn, %{"id" => id}) do
    profile = Profiles.get_profile!(id)
    json(conn, profile)
  end
end
