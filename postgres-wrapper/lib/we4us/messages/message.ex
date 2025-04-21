defmodule We4us.Messages.Message do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :body, :from_user, :to_user, :inserted_at, :updated_at]}  # 👈 Add this

  schema "messages" do
    field :body, :string
    field :from_user, :string
    field :to_user, :string

    timestamps(type: :utc_datetime)
  end

  def changeset(message, attrs) do
    message
    |> cast(attrs, [:body, :from_user, :to_user])
    |> validate_required([:body, :from_user, :to_user])
  end
end
