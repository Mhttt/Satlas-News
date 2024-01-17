# SATLAS News

![https://nextjs.org/](https://img.shields.io/badge/-Next.js-000000?logo=nextdotjs&logoColor=white&style=for-the-badge)
![https://www.typescriptlang.org/](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript&logoColor=white&style=for-the-badge)
![https://www.postgresql.org/](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white&style=for-the-badge)
![https://www.docker.com/](https://img.shields.io/badge/-Docker-2496ed?logo=docker&logoColor=white&style=for-the-badge)
![https://azure.microsoft.com/da-dk/services/functions/#overview](https://img.shields.io/badge/-Azure%20Functions-000000?logo=azurefunctions&logoColor=white&style=for-the-badge)
![](https://img.shields.io/codecov/c/github/DHI-GRAS/satlas-news?color=dark&logo=Codecov&logoColor=white&style=for-the-badge&token=UV548SE99L)

![https://github.com/DHI-GRAS/satlas-news/actions](https://github.com/DHI-Gras/satlas-news/actions/workflows/azure-static-web-apps-mango-river-0835c3f03.yml/badge.svg)

## Production URL 

You can find the production URL for the main branch by [clicking here](https://satlas-news.dhigroup.com/) - https://satlas-news.dhigroup.com/. Raw URL (no DNS) can be found [here](https://mango-river-0835c3f03.1.azurestaticapps.net/) - https://mango-river-0835c3f03.1.azurestaticapps.net/.

## Set Up Guide

1. Create a `.env` file in the `api` directory. This flie should contain the following:

```
POSTGRES_PASSWORD="urpassword"
POSTGRES_USER="postgres"
POSTGRES_DB="satlas"
TYPE_ORM_CONNECTION_STRING="postgres://postgres:urpassword@localhost:9999/satlas"
NODE_ENV="development"
```

2. Now create a `local.settings.json` file in the `api` directory. This file is for Azure Functions. It should contain the following:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "NODE_ENV": "development",
    "TYPE_ORM_CONNECTION_STRING": "postgres://postgres:urpassword@localhost:9999/satlas",
    "AUTH0_ID": "ID",
    "AUTH0_SECRET": "SECRET",
    "AZURE_STORAGE_CONNECTION_STRING": "string"
  }
}
```

3. Create a `.env` file in the `front-end` directory. The file is for the front-end. It should contain the following:

```
NEXT_PUBLIC_API_BASE_URL="/"
NEXT_PUBLIC_MAPBOX_TOKEN="token"
```

### Database (Postgres with PostGIS)

Start and stop using the command below:

```powershell
docker compose up/down
```

In order to create a new migration, you will have to use in the `api` directory:

```
yarn run m:create [name]
```

In order to run migrations, you will have to use in the `api` directory:

```
yarn run m:update
```

If you created the `.env` file from step 3, your database should be seeded when you run the program and connect for the first time.
