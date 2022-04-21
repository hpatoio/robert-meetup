# Meetup manager

## Prepare dev environment

1. Build the container

```shell
docker build . --tag ts
```

1. Install needed package

```shell
docker run -it --rm -v $(pwd):/var/ts ts tsc
```

1. Start the server

```shell
docker run -it --rm -v $(pwd):/var/ts -p 6060:6060 ts npm run dev
```

You can now connect to `http://localhost:6060/meetups`