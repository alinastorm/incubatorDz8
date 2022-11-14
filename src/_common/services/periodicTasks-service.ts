//TODO реализовать удаление не активированных пользователей
//TODO реализовать удаление link code активации

import tokensRepository from "../../Auth/tokens-repository"
import { RottenToken } from "../../Auth/types"

const restartTime = process.env.TIME_RESTART_PERIODICTASKS ?? 5 * 60 * 1000

//TASKS:
function deletingRootenTokens() {
    tokensRepository.readAll<RottenToken>().then((tokens) => {
        tokens.forEach(token => {
            if (token.expirationDate < new Date()) {
                tokensRepository.deleteOne(token.id)
            }
        })
    })
    console.log('deletingRootenTokens complete');
}
class PeriodicTasks {
    tasks = [
        deletingRootenTokens
    ]

    async then(resolve: any, reject: any) {
        console.log('PeriodicTasks ...');

        try {
            this.run()
            resolve(true)
        } catch (error) {
            console.log('PeriodicTasks error:', error);
            // reject(this)
        }
    }
    run() {
        console.log('PeriodicTasks started');

        setInterval(() => {
            this.tasks.forEach(handler => {
                handler()
            })
        }
            , +restartTime)
    }
}

//@ts-ignore
export default await new PeriodicTasks()