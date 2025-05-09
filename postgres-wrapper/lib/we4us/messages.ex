defmodule We4us.Messages do
  import Ecto.Query, warn: false
  alias We4us.Repo
  alias We4us.Messages.Message

  def create_message(attrs \\ %{}) do
    %Message{}
    |> Message.changeset(attrs)
    |> Repo.insert()
  end

  def get_conversation(user1, user2) do
    try do
      messages = from(m in Message,
        where: (m.from_user == ^user1 and m.to_user == ^user2) or
               (m.from_user == ^user2 and m.to_user == ^user1),
        order_by: [asc: m.inserted_at]
      )
      |> Repo.all()

      {:ok, messages}
    rescue
      e ->
        {:error, "Failed to retrieve messages: #{inspect(e)}"}
    end
  end
end
