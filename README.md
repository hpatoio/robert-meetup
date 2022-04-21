# Meetup manager

## Prepare dev environment

1. Build the container

```shell
docker build . --tag ts
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