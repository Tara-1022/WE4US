#Context module fro managing and fetching profiles.

defmodule We4Us.Profiles do
  import Ecto.Query, warn: false
  alias We4Us.Repo
  alias We4Us.Profiles.Profile

  # Fetch all profiles
  def list_profiles do
    Repo.all(Profile)
  end

  # Fetch a single profile by id
  def get_profile!(id) do
    Repo.get!(Profile, id)
  end
end
