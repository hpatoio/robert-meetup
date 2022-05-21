# Meetup manager

## Configuration

1. Rename `.env.dist` into `.env` and fill the environment variables properly.

## Prepare dev environment

1. Build the container

```shell
docker build --target dev . --tag ts
```

2. Install needed packages

```shell
docker run -it --rm -v $(pwd):/var/ts ts npm install
```

3. Start the server

```shell
docker run -it --rm -v $(pwd):/var/ts -p 6060:6060 ts npm run dev
```

You can now connect to `http://localhost:6060/meetups`

## Linting

Run `npm run lint` to check for linting errors.
Run `npm run lint:fix` to automatic fix common errors.

## Deploying

The app is conteneraized and deploied in Heroku. Here the steps to build and release

- `npx heroku login` (log in to Heroku)
- `npx heroku container:login` (log in to Heroku Container Registry)
- `npx heroku container:push web -a criptup` (builds, then pushes Docker images to deploy your Heroku app)
- `npx heroku container:release web -a criptup` (Releases previously pushed Docker images to your Heroku app)
