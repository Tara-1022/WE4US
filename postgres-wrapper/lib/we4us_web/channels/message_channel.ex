defmodule We4usWeb.MessageChannel do
  use We4usWeb, :channel
  require Logger
  @impl true
  def join("message:" <> recipient_id, payload, socket) do
    if authorized?(payload) do
      sender_id = payload["user_id"]
      socket = assign(socket, :user_id, sender_id)

      # Log the join attempt for debugging
      Logger.debug("User #{sender_id} joining channel for #{recipient_id}")

      # Get conversation with consistent field names
      messages = case We4us.Messages.get_conversation(sender_id, recipient_id) do
        {:ok, msgs} ->
          Logger.debug("Found #{length(msgs)} messages")
          msgs
        {:error, err} ->
          Logger.error("Error fetching messages: #{inspect(err)}")
          []
      end

      {:ok, %{messages: format_messages(messages)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
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

  @impl true
  def handle_in("send_message", %{"to" => to_user, "body" => body}, socket) do
    from_user = socket.assigns.user_id

    # 1. Save to DB first
    message_params = %{
      "from_user" => from_user,
      "to_user" => to_user,
      "body" => body
    }

    case %We4us.Messages.Message{}
         |> We4us.Messages.Message.changeset(message_params)
         |> We4us.Repo.insert() do
      {:ok, _message} ->
        topic = "message:#{from_user}"
        We4usWeb.Endpoint.broadcast(topic, "new_message", %{
          from: from_user,
          body: body
        })
        {:noreply, socket}

      {:error, _changeset} ->
        {:reply, {:error, %{reason: "Failed to save message"}}, socket}
    end
  end

  defp format_messages(messages) do
    Enum.map(messages, fn msg ->
      %{
        id: msg.id,
        from_user: msg.from_user,
        to_user: msg.to_user,
        body: msg.body,
        inserted_at: msg.inserted_at
      }
    end)
  end

  @impl true
def handle_info(:after_join, socket) do
  We4us.Message.get_messages()
  |> Enum.reverse() # revers to display the latest message at the bottom of the page
  |> Enum.each(fn msg -> push(socket, "shout", %{
      name: msg.name,
      m: msg.message,
      inserted_at: msg.inserted_at,
    }) end)
  {:noreply, socket}
end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
