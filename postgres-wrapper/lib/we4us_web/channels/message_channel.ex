defmodule We4usWeb.MessageChannel do
  use We4usWeb, :channel
  alias We4us.Profiles

  import We4us.LemmyAuthenticator, only: [get_lemmy_username_from_token: 1]

  require Logger
  @impl true
  def join("message:" <> channelName, payload, socket) do
    case authorized?(socket) do
      {:ok, socket} ->
        sender_id = payload["username"]

        if sender_id != socket.assigns.lemmy_username do
          {:error,
           %{
             reason:
               "User #{socket.assigns.lemmy_username} is not authorised to join channel as #{sender_id}",
             status: 404
           }}
        else
          if String.contains?(channelName, "#") do
            [user1, user2] = String.split(channelName, "#")
            other_user = if sender_id == user1, do: user2, else: user1

            case Profiles.get_profile(other_user) do
              nil ->
                {:error, %{reason: "Profile does not exist", status: 404}}

              _profile ->
                socket = assign(socket, :username, sender_id)

                # Log the join attempt for debugging
                Logger.debug("User #{sender_id} joining channel for #{channelName}")

                # Get conversation
                messages =
                  case We4us.Messages.get_conversation(sender_id, other_user) do
                    {:ok, msgs} ->
                      Logger.debug("Found #{length(msgs)} messages for combined channel")
                      msgs

                    {:error, err} ->
                      Logger.error(
                        "Error fetching messages for combined channel: #{inspect(err)}"
                      )

                      []
                  end

                {:ok, %{messages: format_messages(messages)}, socket}
            end
          else
            {:error, %{reason: "Invalid channel name for messages", status: 422}}
          end
        end

      {:error, :unauthorized} ->
        {:error, %{reason: "Authorisation failed", status: 401}}
    end
  end

  @impl true
  def handle_in("send_message", %{"to" => to_user, "body" => body}, socket) do
    from_user = socket.assigns.username
    users = [from_user, to_user] |> Enum.sort()

    message_params = %{
      "from_user" => from_user,
      "to_user" => to_user,
      "body" => body
    }

    case %We4us.Messages.Message{}
         |> We4us.Messages.Message.changeset(message_params)
         |> We4us.Repo.insert() do
      {:ok, message} ->
        formatted_message = %{
          id: message.id,
          from_user: from_user,
          to_user: to_user,
          body: body,
          inserted_at: message.inserted_at
        }

        topic = "message:#{Enum.join(users, "#")}"
        We4usWeb.Endpoint.broadcast(topic, "new_message", formatted_message)

        {:reply, {:ok, formatted_message}, socket}

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

  # Add authorization logic here as required.
  defp authorized?(socket) do
    case get_lemmy_username_from_token(socket.assigns.user_token) do
      {:ok, username} ->
        {:ok, assign(socket, :lemmy_username, username)}

      {:error, message} ->
        Logger.error("Authorisation failure: #{message}")
        {:error, :unauthorized}
    end
  end
end
