defmodule We4usWeb.Router do
  use We4usWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {We4usWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", We4usWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  # Other scopes may use custom stacks.
  scope "/api", We4usWeb do
    pipe_through :api

    get "/profiles", ProfileController, :index
    get "/profiles/:username", ProfileController, :show
    post "/profiles", ProfileController, :create
    put "/profiles/:username", ProfileController, :update
    delete "/profiles/:username", ProfileController, :delete
    post "/messages", MessageController, :create
    get "/messages/last/:for_user", MessageController, :last_message_list

  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:we4us, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: We4usWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
