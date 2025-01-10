# lib/we4us_web/controllers/page_controller.ex
defmodule We4usWeb.PageController do
  use We4usWeb, :controller

  def index(conn, _params) do
    case We4usWeb.LemmyClient.list_posts() do
      {:ok, %{"posts" => posts}} ->
        render(conn, :index, posts: posts)
      {:error, _} ->
        render(conn, :index, posts: [])
    end
  end
end
