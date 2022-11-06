// const request = require("supertest")
import request from "supertest"
import DbMongo from "../../_common/db/mongo/mongoDb-adapter"
import Ajv from "ajv"
import { BlogViewModel } from "../../Blogs/types"
import httpService from "../../_common/services/http-service/http-service"


const ajv = new Ajv({ strict: false })
function check(schema: any, body: any) {
    const validate = ajv.compile(schema)
    const validBody = validate(body)
    if (!validBody) console.log(validate.errors)
    return validBody
}
describe("/blogs", () => {
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
    test('GET Blogs []', async () => {

        const { status, body } = await request(httpService.httpServer).get("/blogs")

        expect(status).toBe(200)

        expect(body).toStrictEqual({
            "pagesCount": 0,
            "page": 1,
            "pageSize": 10,
            "totalCount": 0,
            "items": []
        })

    })
    test('POST Blogs unauthorized', async () => {
        const { status, body } = await request(httpService.httpServer)
            .post("/blogs")
            .send({
                "name": "string",
                "youtubeUrl": "https://someurl.com"
            })

        expect(status).toBe(401)
    })
    let blog: BlogViewModel | null = null
    test('POST Blogs ', async () => {
        const { status, body } = await request(httpService.httpServer)
            .post("/blogs")
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                "name": "string",
                "youtubeUrl": "https://someurl.com"
            })
        const schema = {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "youtubeUrl": {
                    "type": "string"
                },
                "createdAt": {
                    "type": "string"
                }
            },
            "required": [
                "id",
                "name",
                "youtubeUrl",
                "createdAt"
            ]
        }

        expect(status).toBe(201)
        expect(check(schema, body)).toBe(true)
        blog = body
    })
    test('GET Blogs ID', async () => {
        const schema = {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "youtubeUrl": {
                    "type": "string"
                },
                "createdAt": {
                    "type": "string"
                }
            },
            "required": [
                "id",
                "name",
                "youtubeUrl",
                "createdAt"
            ]
        }

        const { status, body } = await request(httpService.httpServer).get(`/blogs/${blog?.id}`)

        expect(status).toBe(200)
        expect(check(schema, body)).toBe(true)
        expect(body).toStrictEqual(blog)
    })
    const newElem = {
        "name": "string2",
        "youtubeUrl": "https://someurl2.com"
    }
    test('PUT Blogs ', async () => {


        const { status } = await request(httpService.httpServer)
            .put(`/blogs/${blog?.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newElem)

        expect(status).toBe(204)

    })
    test('GET Blog after update ', async () => {

        const schema = {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "youtubeUrl": {
                    "type": "string"
                },
                "createdAt": {
                    "type": "string"
                }
            },
            "required": [
                "id",
                "name",
                "youtubeUrl",
                "createdAt"
            ]
        }
        const { status, body } = await request(httpService.httpServer).get(`/blogs/${blog?.id}`)

        expect(status).toBe(200)
        expect(check(schema, body)).toBe(true)
        expect(body).toStrictEqual({ ...blog, ...newElem })

    })
    test('GET Blogs after update', async () => {
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
                                "name": {
                                    "type": "string"
                                },
                                "youtubeUrl": {
                                    "type": "string"
                                },
                                "createdAt": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "id",
                                "name",
                                "youtubeUrl",
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
        const { status, body } = await request(httpService.httpServer).get("/blogs")

        expect(status).toBe(200)
        expect(check(schema, body)).toBe(true)
        expect(body.items.length).toBe(1)
        expect(body.items[0]).toStrictEqual({ ...blog, ...newElem })
    })
    let newPost: any = {
        "title": "string",
        "shortDescription": "string",
        "content": "string"
    }
    test('POST Post by Blog ID', async () => {
        const { status, body } = await request(httpService.httpServer)
            .post(`/blogs/${blog?.id}/posts`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newPost)
        const schema = {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "title": {
                    "type": "string"
                },
                "shortDescription": {
                    "type": "string"
                },
                "content": {
                    "type": "string"
                },
                "blogId": {
                    "type": "string"
                },
                "blogName": {
                    "type": "string"
                },
                "createdAt": {
                    "type": "string"
                }
            },
            "required": [
                "id",
                "title",
                "shortDescription",
                "content",
                "blogId",
                "blogName",
                "createdAt"
            ]
        }
        expect(status).toBe(201)
        expect(check(schema, body)).toBe(true)
        // post = body
    })
    test('Delete Blog by ID', async () => {

        const { status } = await request(httpService.httpServer)
            .delete(`/blogs/${blog?.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')

        expect(status).toBe(204)
    })
    test('GET Blog after delete ', async () => {
        const { status } = await request(httpService.httpServer).get(`/blogs/${blog?.id}`)

        expect(status).toBe(404)

    })
})