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

## Endpoints

See [API documentation](https://occhiodihorusdao.stoplight.io/docs/meetup/dd52083203c7c-community)

## Linting

Run `docker-compose exec nodejs npm run lint` to check for linting errors.
Run `docker-compose exec nodejs npm run lint:fix` to automatic fix common errors.

## Testing

Run `docker-compose exec nodejs npm run test` to run unit tests once.
Run `docker-compose exec nodejs npm run test:watch` to run unit tests [every time a file change](https://jestjs.io/docs/cli#--watch).


## Deploying

The app is conteneraized and deploied in Heroku. Here the steps to build and release

- `npx heroku login` (log in to Heroku)
- `npx heroku container:login` (log in to Heroku Container Registry)
- `npx heroku container:push web -a criptup` (builds, then pushes Docker images to deploy your Heroku app)
- `npx heroku container:release web -a criptup` (Releases previously pushed Docker images to your Heroku app)

## Test with local blockchain (Ganache)

The project has a running [Ganache](https://github.com/trufflesuite/ganache) instance. This allow you to avoid using a distributed blockchain while developing (es: Mumbai, Rinkeby, ...)

To use set it up you need:

##### Set `GANACHE_SEED`

Run `docker-compose logs ganache | grep Mnemonic`. You should get a response like 

```
criptup.ganache  | Mnemonic:      myth like bonus scare over problem client lizard pioneer submit female collect
criptup.ganache  | Mnemonic:      myth like bonus scare over problem client lizard pioneer submit female collect
criptup.ganache  | Mnemonic:      myth like bonus scare over problem client lizard pioneer submit female collect
```

don't worry about the multiples lines. Is because you started the services more times.

Set the value of `GANACHE_SEED` in the `.env` like

```
GANACHE_SEED="asdasd asdasd asd asd as das"
```

##### Deploy the contract on Ganache

Run

```
docker-compose exec nodejs npm run ganache:smart-contract:deploy
```

you will get a response like 

```
> OrganizationFactory contract created:
0x5b1869D9A4C187F2EAa108f3062412ecf0526b24
```

##### Set Community Factory Address

You can set the community address in the `.env`

```
COMMUNITY_FACTORY_ADDRESS="0x5b1869D9A4C187F2EAa108f3062412ecf0526b24"
```

