# Meetup manager

## Configuration

1. Copy `.env.dist` into `.env` and fill the environment variables properly.
1. Copy `docker-compose.override.yml.dist` into `docker-compose.override.yml` and change things accordling

## Prepare dev environment

1. Build the dev environment

```shell
docker-compose up -d --build
```

2. Install needed packages

```shell
docker-compose exec nodejs npm install
```

3. Start the server

```shell
docker-compose exec nodejs npm run dev
```

You can now connect to `http://localhost:6060/meetups`

## Consumer

To run the consumer you can use

```shell
docker-compose exec nodejs npm run consumer
```

## Linting

Run `docker-compose exec nodejs npm run lint` to check for linting errors.
Run `docker-compose exec nodejs npm run lint:fix` to automatic fix common errors.

## Deploying

The app is conteneraized and deploied in Heroku. Here the steps to build and release

- `npx heroku login` (log in to Heroku)
- `npx heroku container:login` (log in to Heroku Container Registry)
- `npx heroku container:push web -a criptup` (builds, then pushes Docker images to deploy your Heroku app)
- `npx heroku container:release web -a criptup` (Releases previously pushed Docker images to your Heroku app)
