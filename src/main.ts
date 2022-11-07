import dbMongoService from "./_common/db/mongo/mongoDb-adapter";
import httpService from "./_common/services/http-service/http-service";
import emailService from "./_common/services/email-service/gmail-adapter";
import { run } from "./_common/services/periodicTasks/periodicTasks-service";




(async function () {
    await dbMongoService.connect()
    httpService.runHttpsServer()
    emailService.createTransporter()
    // run()
})()