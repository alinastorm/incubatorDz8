// const request = require("supertest")
import request from "supertest"
import DbMongo from "../../_common/db/mongo/mongoDb-adapter"
import Ajv from "ajv"
import { HTTP_STATUSES } from "../../_common/services/http-service/types"
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
    httpService.runHttpServer()
  })
  afterAll(async () => {
    await DbMongo.disconnect()
    httpService.stop()
  })

  test('Wrong route', async () => {
    const { status } = await request(httpService.server).get("/wrong")
    expect(status).toBe(HTTP_STATUSES.NOT_FOUND_404)
  })

})