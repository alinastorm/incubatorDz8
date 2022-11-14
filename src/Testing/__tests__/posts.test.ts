// const request = require("supertest")
import request from "supertest"
import DbMongo from "../../_common/services/mongoDb-service/mongoDb-adapter"
import Ajv from "ajv"
import { PostInputModel, PostViewModel } from "../../Posts/types"
import httpService from "../../_common/services/http-service/http-service"

const ajv = new Ajv({ strict: false })
function check(schema: any, body: any) {
    const validate = ajv.compile(schema)
    const validBody = validate(body)
    if (!validBody) console.log(validate.errors)
    return validBody
}
describe("/posts", () => {
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
    test('GET Posts []', async () => {

        const { status, body } = await request(httpService.httpServer).get("/posts")

        expect(status).toBe(200)
        expect(body).toStrictEqual({
            "pagesCount": 0,
            "page": 1,
            "pageSize": 10,
            "totalCount": 0,
            "items": []
        })

    })
    test('POST Posts unauthorized', async () => {
        const { status } = await request(httpService.httpServer)
            .post("/posts")
            .send({
                "name": "string",
                "youtubeUrl": "https://someurl.com"
            })

        expect(status).toBe(401)
    })
    let post: PostViewModel | null = null
    let newPost: PostInputModel = {
        "title": "string",
        "shortDescription": "string",
        "content": "string",
        "blogId": "string"
    }
    test('POST Blog for POST Post ', async () => {
        const { status, body } = await request(httpService.httpServer)
            .post("/blogs")
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                "name": "string",
                "youtubeUrl": "https://someurl.com"
            })

        expect(status).toBe(201)

    })
    test('GET Blogs for Post post', async () => {
        const { status, body } = await request(httpService.httpServer).get("/blogs")
        expect(status).toBe(200)
        newPost.blogId = body.items[0].id
    })
    test('POST Post ', async () => {
        const { status, body } = await request(httpService.httpServer)

            .post("/posts")
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
        post = body
    })
    test('GET Post ID', async () => {
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

        const { status, body } = await request(httpService.httpServer).get(`/posts/${post?.id}`)

        expect(status).toBe(200)
        expect(check(schema, body)).toBe(true)
        expect(body).toStrictEqual(post)
    })
    const updatePost = {
        "title": "string2",
        "shortDescription": "string2",
        "content": "string2",
    }
    test('PUT Post ', async () => {
        const { status } = await request(httpService.httpServer)
            .put(`/posts/${post?.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({ ...newPost, ...updatePost })

        expect(status).toBe(204)

    })
    test('GET Post by ID after update ', async () => {

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
        const { status, body } = await request(httpService.httpServer).get(`/posts/${post?.id}`)

        expect(status).toBe(200)
        expect(check(schema, body)).toBe(true)
        expect(body).toStrictEqual({ ...post, ...updatePost })

    })

    test('Delete Post by ID', async () => {

        const { status } = await request(httpService.httpServer)
            .delete(`/posts/${post?.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')

        expect(status).toBe(204)
    })
    test('GET Post after delete ', async () => {
        const { status } = await request(httpService.httpServer).get(`/posts/${post?.id}`)

        expect(status).toBe(404)

    })
    // test('GET Posts after update', async () => {
    //     const schema = {
    //         "type": "object",
    //         "properties": {
    //             "pagesCount": {
    //                 "type": "integer"
    //             },
    //             "page": {
    //                 "type": "integer"
    //             },
    //             "pageSize": {
    //                 "type": "integer"
    //             },
    //             "totalCount": {
    //                 "type": "integer"
    //             },
    //             "items": {
    //                 "type": "array",
    //                 "items": [
    //                     {
    //                         "type": "object",
    //                         "properties": {
    //                             "id": {
    //                                 "type": "string"
    //                             },
    //                             "name": {
    //                                 "type": "string"
    //                             },
    //                             "youtubeUrl": {
    //                                 "type": "string"
    //                             },
    //                             "createdAt": {
    //                                 "type": "string"
    //                             }
    //                         },
    //                         "required": [
    //                             "id",
    //                             "name",
    //                             "youtubeUrl",
    //                             "createdAt"
    //                         ]
    //                     }
    //                 ]
    //             }
    //         },
    //         "required": [
    //             "pagesCount",
    //             "page",
    //             "pageSize",
    //             "totalCount",
    //             "items"
    //         ]

    //     }
    //     const { status, body } = await request(httpServerService.server).get("/posts")

    //     expect(status).toBe(200)
    //     expect(check(schema, body)).toBe(true)
    //     expect(body.items.length).toBe(1)
    //     expect(body.items[0]).toStrictEqual({ ...post, ...updatePost })
    // })

})