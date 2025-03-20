defmodule We4usWeb.ProfileController do
  use We4usWeb, :controller

  alias We4us.Profiles
  alias We4us.Profiles.Profile
  alias We4usWeb.ChangesetJSON
  alias We4us.Repo

  @doc "Fetch all profiles from the database and return them as JSON."
  def index(conn, _params) do
    profiles = Profiles.list_profiles()
    json(conn, %{profiles: Enum.map(profiles, &profile_json/1)})
  end

  @doc "Fetch a single profile by username and return it as JSON."
  def show(conn, %{"username" => username}) do
    case Profiles.get_profile(username) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Profile not found"})
      profile ->
        json(conn, %{profile: profile_json(profile)})
    end
  end

  @doc "Create a new profile."
  def create(conn, params) do
    profile_params =
      case params do
        %{"profile" => p} -> p
        _ -> params
      end

    case Profiles.create_profile(profile_params) do
      {:ok, profile} ->
        conn
        |> put_status(:created)
        |> json(%{profile: profile_json(profile)})

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: ChangesetJSON.errors(changeset)})
    end
  end

  @doc "Update a profile by username."
  def update(conn, %{"username" => username} = params) do
    case Profiles.get_profile(username) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Profile not found"})

      profile ->
        case Profiles.update_profile(profile, params) do
          {:ok, updated_profile} ->
            conn
            |> put_status(:ok)
            |> json(%{message: "Profile updated", profile: profile_json(updated_profile)})

          {:error, %Ecto.Changeset{} = changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{errors: ChangesetJSON.errors(changeset)})
        end
    end
  end

  @doc "Delete a profile by username."
  def delete(conn, %{"username" => username}) do
    case Profiles.get_profile(username) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Profile not found"})

      profile ->
        case Profiles.delete_profile(profile) do
          {:ok, _} ->
            conn
            |> put_status(:no_content)
            |> json(%{message: "Profile deleted successfully"})

          {:error, _reason} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{error: "Profile deletion failed"})
        end
    end
  end


  defp profile_json(profile) do
    %{
      username: profile.username,
      display_name: profile.display_name,
      cohort: profile.cohort,
      current_role: profile.current_role,
      company_or_university: profile.company_or_university,
      years_of_experience: profile.years_of_experience,
      areas_of_interest: profile.areas_of_interest
    }
  end
end
