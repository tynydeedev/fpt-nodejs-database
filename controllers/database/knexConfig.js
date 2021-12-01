module.exports = {
  deverlopment: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'nodeJS-02',
      password: process.env.DATABASE_PASSWORD,
      database: 'fa_nodejs',
    },
    pool: {
      min: 0,
      max: 10,
    },
  },
};
