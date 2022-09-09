/** source/server.ts */
import "dotenv/config";
import http from "http";
import express, { Express } from "express";
import morgan from "morgan";
import { connectToMongoDB } from "./services/db/index";
import meetupRoutes from "./routes/meetup";
import userRoutes from "./routes/user";
import organizationRoutes from "./routes/organization";

const router: Express = express();

/** Logging */
router.use(morgan("dev"));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
  // set the CORS policy
  res.header("Access-Control-Allow-Origin", "*");
  // set the CORS headers
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  // set the CORS method headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return res.status(200).json({});
  }
  return next();
});

/** Routes */
router.use("/meetups", meetupRoutes);
router.use("/organizations", organizationRoutes);
router.use("/users", userRoutes);

/** Error handling */
router.use((req, res) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 6060;

connectToMongoDB().then(() => {
  httpServer.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`The server is running on port ${PORT}`);
  });
});
