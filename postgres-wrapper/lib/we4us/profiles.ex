#Context module fro managing and fetching profiles.

defmodule We4us.Profiles do
  import Ecto.Query, warn: false
  alias We4us.Repo
  alias We4us.Profiles.Profile

  #Fetch all profiles
  def list_profiles do
    Repo.all(from p in Profile, order_by: [asc: p.username])
  end

  #Fetch a single profile by username
  def get_profile!(username) do
    Repo.get!(Profile, username)
  rescue
    Ecto.NoResultsError ->
      nil
  end

  def get_profile(username) do
    Repo.get(Profile, username)
  end

  #Create a profile
  def create_profile(attrs) do
    case Map.fetch(attrs, "username") do
      {:ok, username} ->
        case Repo.get_by(Profile, username: username) do
          nil ->  #No existing profile, proceed with insertion
            %Profile{}
            |> Profile.changeset(attrs)
            |> Repo.insert()

          _existing_profile ->
            {:error, :username_taken}
        end

      :error ->
        {:error, :missing_username}
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
    case Repo.delete(profile) do
      {:ok, _} -> {:ok, :deleted}
      {:error, reason} -> {:error, reason}
    end
  end

end
