# lib/we4us_web/lemmy_client.ex
defmodule We4usWeb.LemmyClient do
  use HTTPoison.Base

  @base_url "https://lemmy.ml/api/v3"

  def process_url(url), do: @base_url <> url

  def process_request_headers(headers) do
    [{"Content-Type", "application/json"} | headers]
  end

  def list_posts do
    case get("/post/list") do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        {:ok, Jason.decode!(body)}
      error ->
        {:error, error}
    end
  end
end
