import 'jest'
import * as request from 'supertest'


let address: string = (<any> global).address

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

test('post /users - nome obrigatório', () => {
    return request(address)
        .post('/users')
        .send({
            email: 'usuario1@gmail.com',
            password: '123456',
            cpf: '956.148.860-44'
        })
        .then(response => {
            expect(response.status).toBe(400)
            expect(response.body.errors).toBeInstanceOf(Array)
            expect(response.body.errors[0].message).toContain('name')
        }).catch(fail)
})

test('post /users - cpf inválido', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'usuario2',
            email: 'usuario2@gmail.com',
            password: '123456',
            cpf: '956.148.999-99'
        })
        .then(response => {
            expect(response.status).toBe(400)
            expect(response.body.errors).toBeInstanceOf(Array)
            expect(response.body.errors).toHaveLength(1)
            expect(response.body.errors[0].message).toContain('Invalid CPF')
        }).catch(fail)
})

test('post /users - usuario duplicado', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'usuario3',
            email: 'usuario3@gmail.com',
            password: '123456',
            cpf: '956.148.860-44'
        })
        .then(response => {
            return request(address)
                .post('/users')
                .send({
                    name: 'usuario3',
                    email: 'usuario3@gmail.com',
                    password: '123456',
                    cpf: '956.148.860-44'
                })          
        })
        .then(response  => {
            expect(response.status).toBe(400)
            expect(response.body.message).toContain('E11000 duplicate key')
        })
        .catch(fail)
})

test('get /users - findByEmail', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'usuario4',
            email: 'usuario4@gmail.com',
            password: '123456'
        })
        .then(response => {
            return request(address)
                .get('/users')
                .query({email: 'usuario3@gmail.com'})
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.body.items).toBeInstanceOf(Array)
                    expect(response.body.items).toHaveLength(1)
                    expect(response.body.items[0].email).toBe('usuario3@gmail.com')
                })
        })
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
            name: 'usuario5',
            email: 'usuario5@gmail.com',
            password: '123456',
        })
        .then(response => {
            return request(address)
                .patch(`/users/${response.body._id}`)
                .send({
                    name: 'usuario5-patch'
                })
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('usuario5-patch')
            expect(response.body.email).toBe('usuario5@gmail.com')
            expect(response.body.password).toBeUndefined()
        })
        .catch(fail)
})

test('put /users/aaaa - not found', () => {
    return request(address)
        .put('/users/aaaa')
        .then(response => {
            expect(response.status).toBe(404)
        })
        .catch(fail)
})

/*
  1. Cria usuário com gender Male
  2. Atualiza sem informar gender
  3. Testa se o documento foi substituido -> gender undefined
*/

test('put /users/:id', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'usuario66',
            email: 'user6@gmail.com',
            password: '123456',
            cpf: '613.586.318-59',
            gender: 'Male'
        })
        .then(response => {
            return request(address)
                .put(`/users/${response.body._id}`)
                .send({
                    name: 'usuario6',
                    email: 'user6@gmail.com',
                    password: '123456',
                    cpf: '613.586.318-59'
                })
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.name).toBe('usuario6')
                    expect(response.body.email).toBe('user6@gmail.com')
                    expect(response.body.cpf).toBe('613.586.318-59')
                    expect(response.body.gender).toBeUndefined()
                    expect(response.body.password).toBeUndefined()
        })
        .catch(fail)
})