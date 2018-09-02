"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jestCli = require("jest-cli");
const server_1 = require("./server/server");
const environment_1 = require("./common/environment");
const users_router_1 = require("./users/users.router");
const reviews_router_1 = require("./reviews/reviews.router");
const restaurants_router_1 = require("./restaurants/restaurants.router");
const users_model_1 = require("./users/users.model");
const reviews_model_1 = require("./reviews/reviews.model");
let server;
const routers = [
    users_router_1.usersRouter,
    reviews_router_1.reviewsRouter,
    restaurants_router_1.restaurantsRouter
];
const beforeAllTests = () => {
    environment_1.environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test';
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    server = new server_1.Server();
    return server.bootstrap(routers)
        .then(() => {
        users_model_1.User.remove({}).exec();
    })
        .then(() => {
        reviews_model_1.Review.remove({}).exec();
    });
};
const afterAllTests = () => {
    return server.shutdown();
};
beforeAllTests()
    .then(() => {
    return jestCli.run();
})
    .then(() => {
    return afterAllTests();
})
    .catch(console.error);
