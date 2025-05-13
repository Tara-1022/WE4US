defmodule We4us.Repo.Migrations.YearsOfExpToWorkingSince do
  use Ecto.Migration

  def change do
    alter table(:profiles) do
      # remove years of experience
      remove :years_of_experience

      # add working since
      add :working_since, :string, default: nil
    end
  end
end
