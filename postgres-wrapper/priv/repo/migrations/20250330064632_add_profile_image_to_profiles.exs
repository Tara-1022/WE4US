defmodule MyApp.Repo.Migrations.AddProfileImageToProfiles do
  use Ecto.Migration

  def change do
    alter table(:profiles) do
      add :image_filename, :string
      add :image_delete_token, :string
    end
  end
end
