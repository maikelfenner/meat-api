import {Server} from './server/server'
import {usersRouter} from './users/users.router'
import {restaurantsRouter} from './restaurants/restaurants.router'
import {reviewsRouter} from './reviews/reviews.router'
import {mainRouter} from './main.router'

const server = new Server()
const routers = [
    usersRouter,
    restaurantsRouter,
    reviewsRouter,
    mainRouter
]

server.bootstrap(routers).then(server => {
    console.log('Server is listening on:', server.application.address())
}).catch(error => {
    console.log('Server failed to start')
    console.error(error)
    process.exit(1)
})
