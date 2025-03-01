defmodule We4usWeb.ErrorJSONTest do
  use We4usWeb.ConnCase, async: true

  test "renders 404" do
    assert We4usWeb.ErrorJSON.render("404.json", %{}) == %{errors: %{detail: "Not Found"}}
  end

  test "renders 500" do
    assert We4usWeb.ErrorJSON.render("500.json", %{}) ==
             %{errors: %{detail: "Internal Server Error"}}
  end
end
