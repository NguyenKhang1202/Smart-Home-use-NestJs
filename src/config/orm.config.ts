import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const config: MysqlConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'nestjs.mysql',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
};

export default config;
