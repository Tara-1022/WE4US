defmodule We4us.Repo.Migrations.UpdateProfiles do
  use Ecto.Migration

  def change do
    alter table(:profiles) do
      # Remove old Lemmy-related fields
      remove :join_date
      remove :posts
      remove :comments

      # Add new professional fields
      add :current_role, :string
      add :company_or_university, :string
      add :years_of_experience, :integer
      add :areas_of_interest, {:array, :string}
    end
  end
end
