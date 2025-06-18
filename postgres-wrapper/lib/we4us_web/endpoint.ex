defmodule We4usWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :we4us

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  @session_options [
    store: :cookie,
    key: "_we4us_key",
    signing_salt: "Pz0S/VwP",
    same_site: "Lax"
  ]

  socket("/live", Phoenix.LiveView.Socket,
    websocket: [connect_info: [session: @session_options]],
    longpoll: [connect_info: [session: @session_options]]
  )

  # Get WebSocket origins from environment variables or use defaults
  socket("/socket", We4usWeb.UserSocket,
    websocket: [
      timeout: 45_000,
      check_origin: get_allowed_origins()
    ],
    longpoll: false
  )

  # You should set gzip to true if you are running phx.digest
  # when deploying your static files in production.
  plug(Plug.Static,
    at: "/",
    from: :we4us,
    gzip: false,
    only: We4usWeb.static_paths()
  )

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket("/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket)
    plug(Phoenix.LiveReloader)
    plug(Phoenix.CodeReloader)
    plug(Phoenix.Ecto.CheckRepoStatus, otp_app: :we4us)
  end

  plug(Phoenix.LiveDashboard.RequestLogger,
    param_key: "request_logger",
    cookie_key: "request_logger"
  )

  plug(Plug.RequestId)
  plug(Plug.Telemetry, event_prefix: [:phoenix, :endpoint])

  plug(Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()
  )

  plug(Plug.MethodOverride)
  plug(Plug.Head)
  plug(Plug.Session, @session_options)

  # Use the same allowed origins for CORS
  plug(CORSPlug,
    origin: get_allowed_origins(),
    allow_headers: ["content-type"],
    allow_credentials: true,
    max_age: 86400
  )

  plug(We4usWeb.Router)

  # Helper function to get allowed origins from environment variable
  defp get_allowed_origins do
    case System.get_env("ALLOWED_ORIGINS") do
      nil -> ["https://we4us.co.in", "http://localhost:5173"]  # Default fallback
      origins -> String.split(origins, ",") |> Enum.map(&String.trim/1)
    end
  end
end
