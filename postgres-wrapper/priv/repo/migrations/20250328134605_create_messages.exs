defmodule We4us.Repo.Migrations.CreateMessages do
  use Ecto.Migration

  def change do
    create table(:messages) do
      add :from_user, :string
      add :to_user, :string
      add :body, :string

      timestamps(type: :utc_datetime)
    end
  end

end
