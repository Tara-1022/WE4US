defmodule We4us.Messages do
  import Ecto.Query, warn: false
  alias We4us.Repo
  alias We4us.Messages.Message

  def create_message(attrs \\ %{}) do
    %Message{}
    |> Message.changeset(attrs)
    |> Repo.insert()
  end
end
