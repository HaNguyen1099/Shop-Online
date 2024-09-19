import * as dotenv from "dotenv";

dotenv.config();

export class Config {
    // Port
    PORT = +process.env.PORT || 3000;

    // Postgresql
    postgresHost = process.env.POSTGRES_HOST;
    postgresPort = +process.env.POSTGRES_PORT
    postgresUser = process.env.POSTGRES_USER
    postgresPassword = process.env.POSTGRES_PASSWORD
    postgresDatabase = process.env.POSTGRES_DATABASE
}

export const configSystem = new Config();