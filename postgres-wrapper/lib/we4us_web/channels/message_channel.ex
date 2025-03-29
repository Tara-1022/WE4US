defmodule We4usWeb.MessageChannel do
  use We4usWeb, :channel

  @impl true
  def join("message:lobby", payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("new_message", %{"body" => body}, socket) do
    broadcast!(socket, "new_message", %{body: body})
    {:noreply, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (message:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    We4us.Message.changeset(%We4us.Message{}, payload) |> We4us.Repo.insert
    broadcast(socket, "shout", payload)
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
