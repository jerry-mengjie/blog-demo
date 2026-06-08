export const MYSQL_CONFIG: any = {
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  database: process.env.MYSQL_DATABASE || 'backend-nestjs',
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'qwqwqw78',
  // entities: [__dirname + '/**/*.entity{.ts,.js}'], //实体文件
  synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库
};
