require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const path = require("path");
const cookie = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const morgan = require("morgan");
const xss = require("xss-clean");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");

const { scheduler } = require('../src/controllers/ScheduleControllers.js')
const { attackMiddleware } = require("./middlewares/security.js");


const AuthRouter = require("../src/routers/AuthRouters.js");
const LinkRouter = require("../src/routers/LinkRouters.js");


const MainRouter = express.Router();
const app = express();

// Rate limiting
const rateLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 100, // limit each IP to 100 requests per window
});

const corsOptions = {
	origin: (origin, callback) => {
		const allowedOrigins = [];
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: ["DELETE", "GET", "POST", "PUT"],
	allowedHeaders: ["Content-Type"],
	optionsSuccessStatus: 200,
	credentials: true,
};

// Trust proxy
app.set("trust proxy", 1);

// Middleware setup
app.use(xss());
app.use(hpp());
app.use(mongoSanitize());
app.use(morgan("combined"));
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(cookie());
app.use(rateLimiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(attackMiddleware);
app.disable("x-powered-by");

// Session setup with MongoStore
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URI,
			ttl: 24 * 60 * 60, // 1 day
			autoRemove: "native",
		}),
		cookie: {
			secure: process.env.NODE_ENV === "production",
			maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
			httpOnly: true,
		},
	})
);

app.get("/robots.txt", (req, res) => res.sendFile(path.join(__dirname, "/robots.txt")));
app.get("/health", (req, res) => res.status(200).json({
	message: "i am healthy and alive 🚀🧘🏾‍♂️",
	timestamp: Date.now(),
}));

app.post('/nxxx', scheduler); //Cron Jobs


// Main routers
MainRouter.use("/auth", AuthRouter);
MainRouter.use("/l", LinkRouter);

app.use("/api/v1", MainRouter);

module.exports = app;