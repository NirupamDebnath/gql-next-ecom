export default {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "mysecretpassword",
  database: "ecom_db",
  synchronize: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migrations",
  },
};
