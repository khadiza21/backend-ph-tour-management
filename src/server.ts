/* eslint-disable no-console */
import { Server } from "http"; // import from node js
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server; //create server

// this function connect with database and connect with main app
const startServer = async () => {
    try {

        console.log(envVars.NODE_ENV);
        // connect with mongoose 
        await mongoose.connect(envVars.DB_URL)
        console.log("connected to DB!");

        // listen the app with port
       server = app.listen(envVars.PORT, () => {
            console.log(`Server is listening to port ${envVars.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }

}
// call the startServer function for server start
startServer();

//  after closing server then process exit occur. 
// process is node js server which run on terminal and server is close express server 


/* .................. error type 1 .................. */
// * unhandled rejection error 
process.on("unhandledRejection", (err)=> {
    console.log("Unhandled Rejection detected ,, Server shutting down..", err);

    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
     process.exit(1);
})

/* .................. error type 2 .................. */
// * uncaught exception error
process.on("uncaughtException", (err)=> {
    console.log("uncaught Exception detected ,, Server shutting down..", err);

    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
     process.exit(1);
})

/* .................. error type 3 .................. */
process.on("SIGTERM", ()=> {
    console.log("SIGTERM signal received... server shutting down");

    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
     process.exit(1);
})


// running server off signal pass
process.on("SIGINT", ()=> {
    console.log("SIGINT signal received... server shutting down");

    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
     process.exit(1);
})


// unhandled rejection error
//  Promise.reject(new Error ("I forgot to catch this promise."))

// uncaught exception error
// throw  new Error("I forgot to handle this local error")


/* 3type error
* unhandled rejection error
* uncaught exception error
* signal termination sigterm
*/

