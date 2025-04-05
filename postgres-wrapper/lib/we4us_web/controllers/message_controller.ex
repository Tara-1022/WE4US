defmodule We4usWeb.MessageController do
  use We4usWeb, :controller

  alias We4us.Messages

  def create(conn, %{"body" => body, "from_user" => from_user, "to_user" => to_user}) do
    case Messages.create_message(%{"body" => body, "from_user" => from_user, "to_user" => to_user}) do
      {:ok, message} ->
        json(conn, %{message: "Message saved", data: message})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Failed to save message", details: changeset.errors})
    end
  end
end
