# Docker Setup for WE4US Project

This guide provides instructions for setting up and running the WE4US project using Docker. 

**Note: The guide has been written on a machine with `docker-compose`. The standard is to use `docker compose`. Strictly follow this unless your machine has restrictions.** 

**Replace `docker-compose` with `docker compose` in all commands below.**

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) for multi-container setups
- Git repository of the WE4US project cloned to your local machine

## Initial Setup

1. Navigate to the project root directory:

   ```bash
   cd /path/to/WE4US
   ```

2. Pull the required Docker images:
   ```bash
   docker-compose pull
   ```

## Running the Application

### Starting the Services

To start all services defined in the docker-compose file:

```bash
docker-compose up
```

To run the services in detached mode (background):

```bash
docker-compose up -d
```

### Viewing Logs

If running in detached mode, you can view logs with:

```bash
docker-compose logs
```

To follow logs in real-time:

```bash
docker-compose logs -f
```

To view logs for a specific service:

```bash
docker-compose logs -f [service_name]
```

## Rebuilding and Pushing Docker Images

If you need to rebuild the frontend image:

```bash
cd we4us
docker build -f ./Dockerfile.frontend -t yashaswinisharma/we4us-react:latest .
docker push yashaswinisharma/we4us-react:latest
```

After pushing the updated image, you may need to restart your containers to use the new image:

```bash
docker-compose down
docker-compose pull
docker-compose up -d
```

## Stopping the Application

To stop all running services:

```bash
docker-compose down
```

