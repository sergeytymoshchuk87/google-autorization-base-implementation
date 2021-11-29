const mongoose = require('mongoose')

exports.mongooseConnect = () => {
  const mongooseURL = 'mongodb://localhost:27017/testdbuser'
  return mongoose
    .connect(mongooseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(() => {
      console.log('MongoDB  is connecting....')
    })
}
