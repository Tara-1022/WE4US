defmodule We4usWeb.ProfileController do
  use We4usWeb, :controller

  alias We4us.Profiles, as: Profiles
  alias We4usWeb.ChangesetJSON


  @doc """
  Fetch all profiles from the database and return them as JSON.

  Endpoint: GET /api/profiles
  """

  def index(conn, _params) do
    profiles = Profiles.list_profiles()
    json(conn, %{profiles: Enum.map(profiles, &profile_json/1)})
  end

  @doc """
  Fetch a single profile by ID and return it as JSON.

  Endpoint: GET /api/profiles/:id
  """

  def show(conn, %{"id" => id}) do
    case Integer.parse(id) do
      {parsed_id, ""} ->  # Ensures `id` is a valid integer
        case Profiles.get_profile(parsed_id) do
          nil ->
            conn
            |> put_status(:not_found)
            |> json(%{error: "Profile not found"})
          profile ->
            json(conn, profile)
        end

      _ ->  # Handles non-integer IDs
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Invalid ID format"})
    end
  end

  @doc """
  Create a new profile.

  Accepts both wrapped and flat JSON input.

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
        |> json(%{errors: ChangesetJSON.errors(changeset)})  # Use JSON helper
    end
  end

  def update(conn, %{"id" => id} = params) do
    case We4us.Profiles.get_profile(id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Profile not found"})

      profile ->
        changeset = We4us.Profiles.update_profile(profile, params)

        case changeset do
          {:ok, updated_profile} ->
            conn
            |> put_status(:ok)
            |> json(%{message: "Profile updated", profile: updated_profile})

          {:error, changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{error: "Update failed", details: changeset.errors})
        end
    end
  end

  def delete(conn, %{"id" => id}) do
    case We4us.Profiles.get_profile(id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Profile not found"})

      profile ->
        case We4us.Profiles.delete_profile(profile) do
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


  #Helper function to format profile data for JSON responses
  defp profile_json(profile) do
    %{
      id: profile.id,
      display_name: profile.display_name,
      username: profile.username,
      cohort: profile.cohort,
      join_date: profile.join_date,
      posts: profile.posts,
      comments: profile.comments
    }
  end

  #Format Ecto changeset errors
  defp format_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, &ChangesetView.translate_error/1)
  end

end
