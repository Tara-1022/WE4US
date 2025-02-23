defmodule We4us.Profiles.Profile do
  use Ecto.Schema
  import Ecto.Changeset

  #Prevents Ecto metadat from causing encoding errors
  @derive {Jason.Encoder, only: [:id, :display_name, :username, :cohort, :join_date, :posts, :comments, :inserted_at, :updated_at]}

  schema "profiles" do
    field :cohort, :string
    field :comments, :integer, default: 0
    field :display_name, :string
    field :join_date, :date, default: Date.utc_today()
    field :posts, :integer, default: 0
    field :username, :string

    timestamps(type: :naive_datetime)
  end

  @doc false
  def changeset(profile, attrs) do
    profile
    |> cast(attrs, [:display_name, :username, :cohort, :join_date, :posts, :comments])
    |> validate_required([:display_name, :username, :cohort, :join_date, :posts, :comments])
  end
end
