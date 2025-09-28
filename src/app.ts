import express, { Request, Response } from "express"
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandle } from "./app/middlewares/globalErrorHandlers";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";


const app = express(); // create express app
app.use(express.json()); // for getting json body
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(cors()) // to prevent cors error in frontend developer

app.use("/api/v1", router) // when hits the user route then will be redirect 

// make a root route
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend "
    })
})

// setting up global error handler
// need 4 var for handle global error handler 
app.use(globalErrorHandle)


// not found route should be below of globalErrorHandler
app.use(notFound)


export default app; 