// const request = require("supertest")
import request from "supertest"
import DbMongo from "../../_common/services/mongoDb-service/mongoDb-adapter"
import Ajv from "ajv"
import { Response } from 'express';
import { UserViewModel } from "../../Users/types"
import { Paginator } from "../../_common/abstractions/Repository/types";
import httpService from "../../_common/services/http-service/http-service";


const ajv = new Ajv({ strict: false })
function checkSchema(schema: any, body: any) {
    const validate = ajv.compile(schema)
    const validBody = validate(body)
    if (!validBody) console.error('checkSchema:', validate.errors)
    return validBody
}
describe("/users", () => {
    beforeAll(() => {
        httpService.runHttpsServer()
    })
    afterAll(async () => {
        await DbMongo.disconnect()
        httpService.stop()
    })

    test('All delete', async () => {
        const { status } = await request(httpService.httpServer).delete("/testing/all-data")
        expect(status).toBe(204)
    })
    test('Return All users = []', async () => {

        const { status, body } = await request(httpService.httpServer)
            .get("/users")
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')


        expect(status).toBe(200)

        expect(body).toStrictEqual({
            "pagesCount": 0,
            "page": 1,
            "pageSize": 10,
            "totalCount": 0,
            "items": []
        })

    })
    test('Add new user to the system', async () => {
        const { status, body } = await request(httpService.httpServer)
            .post("/users")
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                "login": "User1",
                "password": "Password1",
                "email": "user1@gmail.com"
            })
        const schema = {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "login": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "createdAt": {
                    "type": "string"
                }
            },
            "required": [
                "id",
                "login",
                "email",
                "createdAt"
            ]
        }
        expect(status).toBe(201)
        expect(checkSchema(schema, body)).toBe(true)
    })
    test('Try login user to the system', async () => {
        const { status } = await request(httpService.httpServer)
            .post("/auth/login")
            .send({
                "login": "User1",
                "password": "Password1",
            })
        expect(status).toBe(200)
    })
    test('Try login wrong user to the system', async () => {
        const { status } = await request(httpService.httpServer)
            .post("/auth/login")
            .send({
                "login": "UserWrong",
                "password": "PasswordWrong",
            })
        expect(status).toBe(401)
    })
    let user: UserViewModel
    test('Return All users after added', async () => {

        const { status, body }: { status: any, body: Paginator<UserViewModel> } = await request(httpService.httpServer)
            .get("/users")
        const schema = {
            "type": "object",
            "properties": {
                "pagesCount": {
                    "type": "integer"
                },
                "page": {
                    "type": "integer"
                },
                "pageSize": {
                    "type": "integer"
                },
                "totalCount": {
                    "type": "integer"
                },
                "items": {
                    "type": "array",
                    "items": [
                        {
                            "type": "object",
                            "properties": {
                                "id": {
                                    "type": "string"
                                },
                                "login": {
                                    "type": "string"
                                },
                                "email": {
                                    "type": "string"
                                },
                                "createdAt": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "id",
                                "login",
                                "email",
                                "createdAt"
                            ]
                        }
                    ]
                }
            },
            "required": [
                "pagesCount",
                "page",
                "pageSize",
                "totalCount",
                "items"
            ]
        }
        expect(status).toBe(200)
        expect(checkSchema(schema, body)).toBe(true)
        user = body.items[0]
    })
    test('Delete User by ID', async () => {

        const { status } = await request(httpService.httpServer)
            .delete(`/users/${user.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')

        expect(status).toBe(204)
    })
    test('Try login after delete User to the system', async () => {
        const { status } = await request(httpService.httpServer)
            .post("/auth/login")
            .send({
                "login": "User1",
                "password": "Password1",
            })
        expect(status).toBe(401)
    })
    test('GET User after delete by ID', async () => {
        const { status } = await request(httpService.httpServer)
            .get(`/blogs/${user?.id}`)

        expect(status).toBe(404)

    })
})