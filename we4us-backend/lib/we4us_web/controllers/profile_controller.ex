defmodule We4UsWeb.ProfileController do
  use We4UsWeb, :controller

  alias We4Us.Profiles

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
    case Profiles.get_profile!(id) do
      nil ->
        send_resp(conn, 404, "Profile not found")
      profile ->
        json(conn, %{profile: profile_json(profile)})
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
