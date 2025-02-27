defmodule We4us.Profiles.Profile do
  use Ecto.Schema
  import Ecto.Changeset

  #Prevents Ecto metadat from causing encoding errors
  @derive {Jason.Encoder, only: [:id, :display_name, :username, :cohort, :current_role, :company_or_university, :years_of_experience, :areas_of_interest, :inserted_at, :updated_at]}

  schema "profiles" do
    field :cohort, :string
    # field :comments, :integer, default: 0
    field :display_name, :string
    # field :join_date, :date, default: Date.utc_today()
    # field :posts, :integer, default: 0
    field :username, :string

    field :current_role, :string
    field :company_or_university, :string
    field :years_of_experience, :integer, default: 0
    field :areas_of_interest, {:array, :string}, default: []

    timestamps(type: :naive_datetime)
  end

  @doc false
  def changeset(profile, attrs) do
    profile
    |> cast(attrs, [:display_name, :username, :cohort, :current_role, :company_or_university, :years_of_experience, :areas_of_interest])
    |> validate_required([:display_name, :username])  # cohort remains optional
    |> validate_length(:display_name, min: 2, max: 100)
    |> validate_length(:username, min: 2, max: 50)
    |> validate_number(:years_of_experience, greater_than_or_equal_to: 0)
  end
end
