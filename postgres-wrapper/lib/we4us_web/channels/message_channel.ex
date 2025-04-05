defmodule We4usWeb.MessageChannel do
  use We4usWeb, :channel

  @impl true
  def join("message:"  <> user_id, payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, "Joined Notification:#{user_id}", %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("new_message", %{"to" => to_user, "body" => body}, socket) do
    from_user = socket.assigns.user_id
    message_params = %{
      from_user: from_user,
      to_user: to_user,
      message: body
    }
    # Save message to database
    case We4us.Messages.create_message(%{
      from_user: from_user,
      to_user: to_user,
      message: body
    }) do
      {:ok, _message} ->
        topic = "message:#{to_user}"

        broadcast!(socket, "new_message", %{from: from_user, body: body})
        Phoenix.PubSub.broadcast(We4us.PubSub, topic, %{
          event: "new_message",
          payload: %{from: from_user, body: body}
        })


        {:noreply, socket}

      {:error, changeset} ->
        {:reply, {:error, changeset}, socket}
    end
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (message:lobby).
  @impl true
def handle_in("send_message", %{"to" => to_user, "body" => body}, socket) do
  topic = "message:#{to_user}"
  from_user = socket.assigns.user_id

  # 1. Broadcast to the recipient
  We4usWeb.Endpoint.broadcast(topic, "new_message", %{
    from: from_user,
    body: body
  })

  # 2. Save to DB
  message_params = %{
    "from_user" => from_user,
    "to_user" => to_user,
    "body" => body
  }

  %We4us.Messages.Message{}
  |> We4us.Messages.Message.changeset(message_params)
  |> We4us.Repo.insert()

  {:noreply, socket}
end


  @impl true
def handle_info(:after_join, socket) do
  We4us.Message.get_messages()
  |> Enum.reverse() # revers to display the latest message at the bottom of the page
  |> Enum.each(fn msg -> push(socket, "shout", %{
      name: msg.name,
      message: msg.message,
      inserted_at: msg.inserted_at,
    }) end)
  {:noreply, socket} # :noreply
end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
