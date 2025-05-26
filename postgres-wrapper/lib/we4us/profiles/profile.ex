defmodule We4us.Profiles.Profile do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:username, :string, autogenerate: false}
  # Prevents Ecto metadata from causing encoding errors
  @derive {Jason.Encoder, only: [:username, :display_name, :cohort, :current_role, :company_or_university, :working_since, :areas_of_interest, :inserted_at, :updated_at]}

  schema "profiles" do
    field(:cohort, :string)
    field(:display_name, :string)
    field(:current_role, :string)
    field(:company_or_university, :string)
    field(:areas_of_interest, {:array, :string}, default: [])
    field(:image_filename, :string, default: nil)
    field(:image_delete_token, :string, default: nil)
    field(:description, :string, default: nil)
    field(:working_since, :string, default: nil)
    timestamps(type: :naive_datetime)
  end

  @doc false
  def changeset(profile, attrs) do
    profile
    |> cast(attrs, [:display_name, :username, :cohort, :current_role,
     :company_or_university, :areas_of_interest,
      :image_filename, :image_delete_token, :description, :working_since])
    |> validate_required([:display_name, :username])  # cohort remains optional
    |> validate_length(:display_name, min: 3, max: 100)
    |> validate_length(:username, min: 3, max: 50)
    |> validate_format(:username, ~r/^[a-z0-9_]+$/, message: "must be lowercase, no spaces, and use underscores")
    |> unique_constraint(:username, message: "Username is already taken")
  end
end
