import 'jest'
import * as request from 'supertest'
import {Server} from '../server/server'
import {environment} from '../common/environment'
import {usersRouter} from './users.router'
import {User} from './users.model'

let address: string
let server: Server

beforeAll(() => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test'
    environment.server.port = process.env.SERVER_PORT || 3001
    address = `http://localhost:${environment.server.port}`

    server = new Server()
    return server.bootstrap([usersRouter])
        .then(() => {
            User.remove({}).exec()
        })
        .catch(console.error)
})

//test.only
//test.skip
test('get /users', () => {
    return request(address)
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})

test('post /users', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'usuario1',
            email: 'usuario1@gmail.com',
            password: '123456',
            cpf: '956.148.860-44'
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('usuario1')
            expect(response.body.email).toBe('usuario1@gmail.com')
            expect(response.body.password).toBeUndefined()
            expect(response.body.cpf).toBe('956.148.860-44')
        }).catch(fail)
})

test('get /users/aaaa - not found', () => {
    request(address)
    .get('/users/aaaa')
    .then(response => {
        expect(response.status).toBe(404)
    }).catch(fail)
})

test('patch /users/:id', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'usuario2',
            email: 'usuario2@gmail.com',
            password: '123456',
        })
        .then(response => {
            return request(address)
                .patch(`/users/${response.body._id}`)
                .send({
                    name: 'usuario2-patch'
                })
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('usuario2-patch')
            expect(response.body.email).toBe('usuario2@gmail.com')
            expect(response.body.password).toBeUndefined()
        })
        .catch(fail)
})

afterAll(() => {
    return server.shutdown()
})