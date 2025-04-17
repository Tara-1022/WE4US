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
        |> json(%{error: "Profile with username '#{username}' not found"})
      profile ->
        json(conn, %{profile: profile_json(profile)})
    end
  end

  @doc "Create a new profile."
  def create(conn, %{"profile" => profile_params}) do
    case Profiles.create_profile(profile_params) do
      {:ok, profile} ->
        conn
        |> put_status(:created)
        |> json(%{profile: profile_json(profile)})

      {:error, :missing_username} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Username is required to create a profile"})

      {:error, :username_taken} ->
        conn
        |> put_status(:conflict)
        |> json(%{error: "Username already exists."})

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: ChangesetJSON.errors(changeset)})
    end
  end

  @doc "Update a profile by username."
  def update(conn, %{"username" => username, "profile" => profile_params}) do
    case Profiles.get_profile(username) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Profile with username '#{username}' not found"})

      profile ->
        # Convert string values to appropriate types and handle image fields
        processed_params = profile_params
          |> Map.update("years_of_experience", profile.years_of_experience, fn
            nil -> nil
            "" -> nil
            val when is_binary(val) -> String.to_integer(val)
            val -> val
          end)
          |> Map.update("areas_of_interest", profile.areas_of_interest, fn
            areas when is_list(areas) -> areas
            _ -> profile.areas_of_interest
          end)

        case Profiles.update_profile(username, processed_params) do
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
   @doc "Delete a profile by username."
   def delete(conn, %{"username" => username}) do
    case Profiles.delete_profile(username) do
      {:ok, :deleted} ->
        conn
        |> put_status(:no_content)
        |> json(%{message: "Profile deleted successfully"})

      {:error, :profile_not_found} ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Profile with username '#{username}' not found"})

      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Profile deletion failed: #{inspect(reason)}"})
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
      areas_of_interest: profile.areas_of_interest,
      image_filename: profile.image_filename,
      image_delete_token: profile.image_delete_token
    }
  end
end
