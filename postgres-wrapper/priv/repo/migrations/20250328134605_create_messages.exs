defmodule We4us.Repo.Migrations.CreateMessages do
  use Ecto.Migration

  def change do
    create table(:messages) do
      add :name, :string
      add :message, :string

      timestamps(type: :utc_datetime)
    end
  end
end
