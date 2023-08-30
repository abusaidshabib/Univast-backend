dotenv.config({ path: "../config.env" });

const allowedOrigins = [process.env.FRONTEND_URL];

exports.corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
  optionsSuccessStatus: 204,
};
