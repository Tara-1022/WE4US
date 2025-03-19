defmodule We4usWeb.ProfileController do
  use We4usWeb, :controller

  alias We4us.Profiles
  alias We4us.Profiles.Profile
  alias We4usWeb.ChangesetJSON
  alias We4us.Repo

  @doc """
  Fetch all profiles from the database and return them as JSON.

  Endpoint: GET /api/profiles
  """
  def index(conn, _params) do
    profiles = Profiles.list_profiles()
    json(conn, %{profiles: Enum.map(profiles, &profile_json/1)})
  end

  @doc """
  Fetch a single profile by username.

  Endpoint: GET /api/profiles/by_username/:username
  """
  def get_by_username(conn, %{"username" => username}) do
    case Repo.get_by(Profile, username: username) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Profile not found"})

      profile ->
        json(conn, %{profile: profile_json(profile)})
    end
  end

  @doc """
  Update a profile by username.

  Endpoint: PUT /api/profiles/by_username/:username
  """
  def update_by_username(conn, %{"username" => username} = params) do
    case Repo.get_by(Profile, username: username) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Profile not found"})

      profile ->
        # Remove "username" from params before updating
        updated_params = Map.drop(params, ["username"])
        changeset = Profile.changeset(profile, updated_params)

        case Repo.update(changeset) do
          {:ok, updated_profile} ->
            json(conn, %{
              message: "Profile updated successfully",
              profile: profile_json(updated_profile)
            })

          {:error, changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{error: "Failed to update profile", details: ChangesetJSON.errors(changeset)})
        end
    end
  end

  @doc """
  Create a new profile.

  Endpoint: POST /api/profiles
  """
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

  @doc """
  Update a profile by ID.

  Endpoint: PUT /api/profiles/:id
  """
  def update(conn, %{"id" => id} = params) do
    case Integer.parse(id) do
      {parsed_id, ""} ->
        case Profiles.get_profile(parsed_id) do
          nil ->
            conn
            |> put_status(:not_found)
            |> json(%{error: "Profile not found"})

          profile ->
            case Profiles.update_profile(profile, params) do
              {:ok, updated_profile} ->
                json(conn, %{
                  message: "Profile updated successfully",
                  profile: profile_json(updated_profile)
                })

              {:error, %Ecto.Changeset{} = changeset} ->
                conn
                |> put_status(:unprocessable_entity)
                |> json(%{errors: ChangesetJSON.errors(changeset)})
            end
        end

      _ ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Invalid ID format"})
    end
  end

  @doc """
  Delete a profile by ID.

  Endpoint: DELETE /api/profiles/:id
  """
  def delete(conn, %{"id" => id}) do
    case Integer.parse(id) do
      {parsed_id, ""} ->
        case Profiles.get_profile(parsed_id) do
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

      _ ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Invalid ID format"})
    end
  end

  # Helper function to format profile data for JSON responses
  defp profile_json(profile) do
    %{
      id: profile.id,
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
