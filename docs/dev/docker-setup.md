# Docker Setup for WE4US Project

This guide provides instructions for setting up and running the WE4US project using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) for multi-container setups
- Git repository of the WE4US project cloned to your local machine

## Initial Setup

1. Navigate to the project root directory:
   ```bash
   cd /path/to/WE4US
   ```

2. Build the Docker images:
   ```bash
   docker-compose build
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

## Stopping the Application

To stop all running services:

```bash
docker-compose down
```

To stop and remove all containers, networks, and volumes:

```bash
docker-compose down -v
```

## Development Workflow

### Rebuilding After Changes

If you make changes to the Dockerfile or code that requires rebuilding:

```bash
docker-compose build
docker-compose up -d
```

### Executing Commands Inside Containers

To run commands inside a running container:

```bash
docker-compose exec [service_name] [command]
```

Example:
```bash
docker-compose exec web npm install
```

### Running Tests

To run tests within the Docker environment:

```bash
docker-compose exec [service_name] npm test
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: If you see an error about ports already in use, ensure no other service is using the same ports or modify the port mapping in your docker-compose file.

2. **Permission issues**: If you encounter permission problems when mounting volumes, check the ownership and permissions of the directories being mounted.

3. **Container not starting**: Check the logs for errors:
   ```bash
   docker-compose logs [service_name]
   ```

4. **Changes not reflected**: Make sure you rebuild the images after significant changes:
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up
   ```

## Environment Variables

The application may require certain environment variables to function properly. These should be defined in a `.env` file at the root of your project or passed directly to the containers.

Example `.env` file:
```
DATABASE_URL=postgresql://user:password@db:5432/mydatabase
API_KEY=your_api_key_here
NODE_ENV=development
```

## Resource Management

To view resource usage:
```bash
docker stats
```

To clean up unused resources:
```bash
docker system prune
```

For more information, refer to the [official Docker documentation](https://docs.docker.com/).
