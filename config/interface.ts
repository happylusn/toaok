export interface IConfig {
  apiPath: string;
  db: {
    dialect: 'mysql';
    database: string;
    username: string;
    password: string;
    host: string;
    port: number;
  }
}