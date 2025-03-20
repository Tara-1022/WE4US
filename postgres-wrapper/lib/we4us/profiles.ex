#Context module fro managing and fetching profiles.

defmodule We4us.Profiles do
  import Ecto.Query, warn: false
  alias We4us.Repo
  alias We4us.Profiles.Profile

  #Fetch all profiles
  def list_profiles do
    Repo.all(Profile)
  end

  #Fetch a single profile by username
  def get_profile!(username) do
    Repo.get!(Profile, username)
  end

  def get_profile(username) do
    Repo.get(Profile, username)
  end

  #Create a profile
  def create_profile(attrs) do
    # Ensure username is present
    case Map.fetch(attrs, "username") do
      {:ok, username} ->

        attrs = Map.put(attrs, "username", username)

        %Profile{}
        |> Profile.changeset(attrs)
        |> Repo.insert()
    end
  end

  #Update a profile
  def update_profile(%Profile{} = profile, attrs) do
    profile
    |> Profile.changeset(attrs)
    |> Repo.update()
  end

  #Delete a profile
  def delete_profile(%Profile{} = profile) do
    Repo.delete(profile)
  end

end
