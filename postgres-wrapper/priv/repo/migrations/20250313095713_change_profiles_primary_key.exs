defmodule We4us.Repo.Migrations.ChangeProfilesPrimaryKey do
  use Ecto.Migration

  def change do
    # Drop old primary key
    alter table(:profiles) do
      remove :id
      modify :username, :string, primary_key: true
    end

    # Ensure username is unique and not null
    create unique_index(:profiles, [:username])
  end
end
