defmodule We4us.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      We4usWeb.Telemetry,
      # Start the Ecto repository
      We4us.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: We4us.PubSub},
      # Start Finch
      {Finch, name: We4us.Finch},
      # Start the Endpoint (http/https)
      We4usWeb.Endpoint
      # Start a worker by calling: We4us.Worker.start_link(arg)
      # {We4us.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: We4us.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    We4usWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
