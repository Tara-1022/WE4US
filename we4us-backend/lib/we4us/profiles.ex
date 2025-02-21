#Context module fro managing and fetching profiles.

defmodule We4us.Profiles do
  import Ecto.Query, warn: false
  alias We4us.Repo
  alias We4us.Profiles.Profile

  #Fetch all profiles
  def list_profiles do
    Repo.all(Profile)
  end

  #Fetch a single profile by id
  def get_profile!(id) do
    Repo.get!(Profile, id)
  end

  #Create a profile
  def create_profile(attrs) do
    %Profile{}
    |> Profile.changeset(attrs)
    |> Repo.insert()
  end
end
