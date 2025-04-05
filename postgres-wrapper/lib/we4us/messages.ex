defmodule We4us.Messages do
  import Ecto.Query, warn: false
  alias We4us.Repo
  alias We4us.Messages.Message

  def create_message(attrs \\ %{}) do
    %Message{}
    |> Message.changeset(attrs)
    |> Repo.insert()
  end

  def get_messages_for_user(to_user) do
    Message
    |> where([m], m.to_user == ^to_user)
    |> order_by([m], desc: m.inserted_at)
    |> Repo.all()
  end
end
