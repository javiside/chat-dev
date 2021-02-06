export const config = {
  secret: process.env.SECRET || "123"+process.env.SECRET2,
  database: process.env.DB || 'mongodb://@localhost:27017/token'
};
