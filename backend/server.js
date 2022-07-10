const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/DB')
const authRoutes = require('./routes/authRoutes')
const exampleRoutes = require('./routes/exampleRoute')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')

const app = express()
dotenv.config()
connectDB()

app.use(express.json())

app.get('/', (req, res) => res.send('API is Running'))
app.use('/api/auth', authRoutes)
app.use('/api/example', exampleRoutes)
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000
const server = app.listen(port, () =>
  console.log(`Sever running on port ${port}`),
)

process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error: ${err.message}`)
  server.close(() => process.exit(1))
})
