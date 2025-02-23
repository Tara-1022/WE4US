defmodule We4usWeb.ProfileController do
  use We4usWeb, :controller

  alias We4us.Profiles, as: Profiles

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


  def create(conn, %{"profile" => profile_params}) do
    case Profiles.create_profile(profile_params) do
      {:ok, profile} ->
        conn
        |> put_status(:created)
        |> json(%{profile: profile})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: changeset})
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
end
