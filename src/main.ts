import dbMongoService from "./_common/db/mongo/mongoDb-adapter";
import httpService from "./_common/services/http-service/http-service";
import emailService from "./_common/services/email-service/gmail-adapter";




(async function () {
    await dbMongoService.connect()
    httpService.runHttpServer()
    emailService.createTransporter()
})()