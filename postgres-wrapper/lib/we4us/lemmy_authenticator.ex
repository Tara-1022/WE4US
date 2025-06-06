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

  def get_lemmy_username_from_token(jwt) do
    case Req.get(get_base_req(), url: "/site", auth: {:bearer, jwt}) do
      {:ok, %{body: %{"my_user" => %{"local_user_view" => %{"person" => %{"name" => username}}}}}} ->
        {:ok, username}

      {:error, message} ->
        {:error, "Received error: #{inspect(message)}"}

      {:ok, _} ->
        {:error, "No 'my_user' field in response"}

      _ ->
        {:error, "Unexpected error"}
    end
  end

  @doc """
  gets username of the logged in user
  """
  def get_lemmy_username(conn) do
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
  def is_user_admin_in_lemmy(conn) do
    with ["Bearer " <> jwt] <- Plug.Conn.get_req_header(conn, "authorization"),
         {:ok,
          %{
            body: %{"my_user" => %{"local_user_view" => %{"local_user" => %{"admin" => isAdmin}}}}
          }} <-
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
