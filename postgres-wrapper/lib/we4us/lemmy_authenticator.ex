defmodule We4us.LemmyAuthenticator do
  @moduledoc """
  Validate jwt tokens and fetch user data if a request needs to be cross-verified with Lemmy
  """
  import Plug.Conn
  import Phoenix.Controller

  @doc """
  Helper function to get base request
  """

  # reference: https://hexdocs.pm/req/Req.html#new/1
  # https://github.com/wojtekmach/req
  # https://hexdocs.pm/req/readme.html
  defp get_base_req do
    Req.new(base_url: System.fetch_env!("LEMMY_API_URL"))
  end

  @doc """
  Validate the token within the connection header with Lemmy
  """
  def ensure_lemmy_token_valid(conn, _opts) do
    with ["Bearer " <> jwt] <- Plug.Conn.get_req_header(conn, "authorization"),
         {:ok, resp} <- Req.get(get_base_req(), url: "/user/validate_auth", auth: {:bearer, jwt}) do
      case resp do
        %{body: %{"success" => true}} ->
          conn

        %{body: %{"success" => false}} ->
          conn
          |> put_status(401)
          |> json(%{error: "Unauthorised"})
          |> halt()

          %{body: %{"error" => "not_logged_in"}} ->
          conn
          |> put_status(:bad_request)
          |> json(%{error: "Invalid authorisation header. Looks like you're not logged in."})
          |> halt()

      end
    else
      [] ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Authorization header missing"})
        |> halt()

      {:error, message} ->
        conn
        |> put_status(500)
        |> json(%{error: "Received error: #{inspect(message)}"})
        |> halt()

      _ ->
        conn
        |> put_status(500)
        |> json(%{error: "Unexpected error"})
        |> halt()
    end
  end

  @doc """
  gets username of the logged in user
  """
  def get_username(conn) do
    with ["Bearer " <> jwt] <- Plug.Conn.get_req_header(conn, "authorization"),
         {:ok,
          %{body: %{"my_user" => %{"local_user_view" => %{"person" => %{"name" => username}}}}}} <-
           Req.get(get_base_req(), url: "/site", auth: {:bearer, jwt}) do
      {:ok, username}
    else
      [] ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Authorization header missing"})
        |> halt()

      {:error, message} ->
        conn
        |> put_status(500)
        |> json(%{error: "Received error: #{inspect(message)}"})
        |> halt()

      {:ok, _} ->
        conn
        |> put_status(500)
        |> json(%{error: "No 'my_user' field in response"})
        |> halt()

      _ ->
        conn
        |> put_status(500)
        |> json(%{error: "Unexpected error"})
        |> halt()
    end
  end

  @doc """
  checks if logged in user is an admin
  """
  def is_user_admin(conn) do
    with ["Bearer " <> jwt] <- Plug.Conn.get_req_header(conn, "authorization"),
         {:ok,
          %{body: %{"my_user" => %{"local_user_view" => %{"local_user" => %{"admin" => isAdmin}}}}}} <-
           Req.get(get_base_req(), url: "/site", auth: {:bearer, jwt}) do
      {:ok, isAdmin}
    else
      [] ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Authorization header missing"})
        |> halt()

      {:error, message} ->
        conn
        |> put_status(500)
        |> json(%{error: "Received error: #{inspect(message)}"})
        |> halt()

      {:ok, _} ->
        conn
        |> put_status(500)
        |> json(%{error: "No 'my_user' field in response"})
        |> halt()

      _ ->
        conn
        |> put_status(500)
        |> json(%{error: "Unexpected error"})
        |> halt()
    end
  end
end
