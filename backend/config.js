import path from 'path'
import dotenv from 'dotenv';
dotenv.config({ path: path.join('../.env') });
const env = process.env;

import mysql from 'mysql';
export default mysql.createConnection({
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    dateStrings: true,
});