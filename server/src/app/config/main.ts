export const config = {
  secret: process.env.SECRET || '!(:--(=myChatPassword=)--:)!',
  database: process.env.DB || 'mongodb://@localhost:27017/token'
};
