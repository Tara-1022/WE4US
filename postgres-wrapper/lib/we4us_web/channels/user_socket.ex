defmodule We4usWeb.UserSocket do
  use Phoenix.Socket

  import We4us.LemmyAuthenticator, only: [get_lemmy_username_from_token: 1]

  # A Socket handler
  #
  # It's possible to control the websocket connection and
  # assign values that can be accessed by your channel topics.

  ## Channels

  channel("message:*", We4usWeb.MessageChannel)

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error` or `{:error, term}`. To control the
  # response the client receives in that case, [define an error handler in the
  # websocket
  # configuration](https://hexdocs.pm/phoenix/Phoenix.Endpoint.html#socket/3-websocket-configuration).
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.
  @impl true
  def connect(%{"token" => token}, socket, _connect_info) do
    case get_lemmy_username_from_token(token) do
      {:ok, username} ->
        socket =
          socket
          |> assign(:user_token, token)
          |> assign(:lemmy_username, username)

        {:ok, socket}

      {:error, message} ->
        Logger.error("Authorization failure: #{message}")
        {:error, :unauthorized}
    end
  end

  def connect(_params, _socket, _connect_info) do
    {:error, :unauthorized}
  end

  # Socket IDs are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     Elixir.We4usWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  @impl true
  def id(socket), do: "user_socket:#{socket.assigns.lemmy_username}"
end
