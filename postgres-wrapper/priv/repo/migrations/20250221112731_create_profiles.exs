defmodule We4us.Repo.Migrations.CreateProfiles do
  use Ecto.Migration

  def change do
    create table(:profiles) do
      add :display_name, :string
      add :username, :string
      add :cohort, :string
      add :join_date, :date, default: fragment("CURRENT_DATE"), null: false
      add :posts, :integer, default: 0, null: false
      add :comments, :integer, default: 0, null: false

      timestamps(type: :utc_datetime)
    end
  end
end
