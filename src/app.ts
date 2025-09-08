import express, { Request, Response } from "express"



const app = express(); // create express app

// make a root route
app.get("/", (req:Request, res:Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend "
    })
})

export default app;