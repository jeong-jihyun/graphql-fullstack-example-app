import { DataSource } from 'typeorm';
import User from '../entities/User';
import { CutVote } from '../entities/CutVote';
import { CutReview } from '../entities/CutReview';
import Notification from '../entities/Notification';
import dotenv from 'dotenv';
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
// entities 생성시 아래에 정의를 해야 한다.
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [User, CutVote, CutReview, Notification],
  //entities: [__dirname + './**/*.{js,ts}'],
  migrations: [],
  subscribers: [],
});

// export const ceateDataBase = async (): Promise<Connection> =>
//   createConnection({
//     type: 'mysql',
//     host: process.env.DB_ENDPOINT || 'localhost',
//     port: 3306,
//     username: process.env.DB_USERNAME || 'shop_admin',
//     password: process.env.DB_PASSWORD || 'shop1234',
//     database: 'image_shop',
//     synchronize: true,
//     logging: true,
//     entities: [User],
//     migrations: [],
//     subscribers: [],
//   });
