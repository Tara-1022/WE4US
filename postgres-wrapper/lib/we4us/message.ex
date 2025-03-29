defmodule We4us.Message do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  schema "messages" do
    field :message, :string
    field :name, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(message, attrs) do
    message
    |> cast(attrs, [:name, :message])
    |> validate_required([:name, :message])
  end

  def get_messages(limit \\ 20) do
    We4us.Message
    |> limit(^limit)
    |> order_by([desc: :inserted_at])
    |> We4us.Repo.all()
  end

end
