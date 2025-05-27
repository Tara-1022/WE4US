defmodule We4us.Repo.Migrations.AddDescriptionToProfile do
  use Ecto.Migration

  def change do
    alter table(:profiles) do
      add :description, :string, default: nil
    end
  end
end
