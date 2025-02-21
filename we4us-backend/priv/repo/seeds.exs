# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     We4us.Repo.insert!(%We4us.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias We4Us.Repo
alias We4Us.Profiles.Profile

profiles = [
  %{
    display_name: "TestUser1",
    username: "testUser1",
    cohort: "5",
    join_date: ~D[2024-06-15],
    posts: 10,
    comments: 25
  },
  %{
    display_name: "TestUser2",
    username: "testUser2",
    cohort: "6",
    join_date: ~D[2024-08-22],
    posts: 5,
    comments: 12
  }
]

for profile <- profiles do
  Repo.insert!(%Profile{profile})
end
