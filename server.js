import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import { PORT, IN_PROD } from "./config/index.js";
import connectMongo from "./db/db.js";
import typeDefs from "./typeDefs/index.js";
import resolvers from "./resolvers/index.js";
import AuthMiddleware from "./middlewares/auth.js";
import { schemaDirectives } from "./directives/index.js";
import localhost from "./security/localhost.js";
import production from "./security/production.js";
import helmet from "helmet";
import cors from "cors";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIP_SECRET_TEST);
const app = express();

(async () => {
  try {
    app.use(cors());
    app.use(express.json());
    app.post("/payment", cors(), async (req, res) => {
      const { productt, token } = req.body;

      return stripe.customers
        .create({
          email: token.email,
          source: token.id,
        })
        .then((customer) => {
          stripe.charges
            .create({
              amount: productt.price * 100,
              currency: "usd",
              customer: customer.id,
              receipt_email: token.email,
              description: productt.name,
            })
            .then((result) => res.status(200).json(result))
            .catch((error) => console.log(error));
        });
    });

    const connect = await connectMongo();
    if (connect) {
      console.log("connected succesfully");
    }

    app.use(AuthMiddleware);
    app.use("/server/uploads", express.static("./uploads"));
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      playground: IN_PROD,
      context: async ({ req }) => {
        let { isAuth, user } = req;

        return {
          req,
          isAuth,
          user,
        };
      },
    });

    app.use(helmet.hidePoweredBy());

    server.applyMiddleware({ app });
    process.env.NODE_ENV = process.env.NODE_ENV || "development";
    if (process.env.NODE_ENV === "production") {
      production(app, PORT);
    } else {
      localhost(app, 8000, PORT);
    }

    // app.listen(PORT, () => console.log(`🚀 Server is ready on port ${PORT}`));
  } catch (e) {
    console.log("server error: " + e.message);
  }
})();
