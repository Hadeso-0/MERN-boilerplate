const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: true,
    })
    console.log('Mongo Connected', connect.connection.host)
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectDB
