import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);

mongoose.connect(process.env.MONGO_URL, {}).then(() => {
    console.log("connected successfully");
}).catch((err) => {
    console.log(err)
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})