const config = {
  type: 'postgres',
  url: process.env.TYPE_ORM_CONNECTION_STRING,
  synchronize: true,
  logging: false,
  entities: ['./database/entities/*.ts'],
  migrations: ['./database/migrations/*.ts'],
  cli: {
    entitiesDir: './database/entities',
    migrationsDir: './database/migrations',
  },
};

if (process.env.NODE_ENV === 'production') {
  config.ssl = {
    ca: process.env.SSL_CERT,
  };
}

module.exports = config;