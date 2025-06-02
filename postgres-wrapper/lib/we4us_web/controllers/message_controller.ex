defmodule We4usWeb.MessageController do
  use We4usWeb, :controller

  alias We4us.Messages
  # This is for API and is distinct from what happens live
  # - for that logic, see message_channel.ex

  def create(conn, %{"body" => body, "from_user" => from_user, "to_user" => to_user}) do
    case Messages.create_message(%{
           "body" => body,
           "from_user" => from_user,
           "to_user" => to_user
         }) do
      {:ok, message} ->
        json(conn, %{message: "Message saved", data: message})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Failed to save message", details: changeset.errors})
    end
  end

  def last_message_list(conn, %{"for_user" => for_user}) do
    # fetch the latest message per channel involving the user
    # either from or to
    case Messages.get_last_message_per_pair(for_user) do
      {:ok, messages} ->
        conn
        |> put_status(:created)
        |> json(%{messages: messages})

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: ChangesetJSON.errors(changeset)})
    end
  end
end
