import { DataSource } from 'typeorm';
import User from '../entities/User';

// export const ceateDataBase = async (): Promise<Connection> =>
//   createConnection({
//     type: 'postgres',
//     host: process.env.DB_ENDPOINT || 'localhost',
//     port: 5432,
//     username: process.env.DB_USERNAME || 'typeorm',
//     password: process.env.DB_PASSWORD || '1q2w3e4r',
//     database: 'public',
//     synchronize: true,
//     logging: true,
//     entities: [User],
//   });
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_ENDPOINT || 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME || 'shop_admin',
  password: process.env.DB_PASSWORD || 'shop1234',
  database: 'image_shop',
  synchronize: true,
  logging: true,
  entities: [User],
  //entities: [__dirname + './**/*.{js,ts}'],
  migrations: [],
  subscribers: [],
});
