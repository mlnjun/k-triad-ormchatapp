module.exports = {
  "development":{
    "username": process.env.DB_USER,
    "password": process.env.DB_PW,
    "database": process.env.DB_NAME,
    "host": "127.0.0.1",
    "port": Number(process.env.DB_PORT),
    "dialect": "mysql",
    "timezone":"+09:00"
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PW,
    "database": process.env.DB_NAME,
    "host": "127.0.0.1",
    "port": Number(process.env.DB_PORT),
    "dialect": "mysql",
    "timezone":"+09:00"
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PW,
    "database": process.env.DB_NAME,
    "host": "127.0.0.1",
    "port": Number(process.env.DB_PORT),
    "dialect": "mysql",
    "timezone":"+09:00"
  }
}