const express = require('express');
const dotenv = require('dotenv')
const notes = require('./data/notes')
const connectDB = require('./config/db')
const {notFound, errorHandler} = require('./middlewares/errorMiddleware')


const app = express();
dotenv.config();
connectDB();
app.use(express.json());


app.get('/', (req, res) => {
    res.send("API is running..")
})


app.use('/api/users', require('./routes/userRouter')); 
app.use("/api/depts", require('./routes/deptRoutes'));

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})