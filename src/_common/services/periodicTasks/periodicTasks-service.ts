//TODO реализовать удаление не активированных пользователей
//TODO реализовать удаление link code активации

import tokensRepository from "../../../Auth/tokens-repository"
import { RottenToken } from "../../../Auth/types"

const restartTime = process.env.TIME_RESTART_PERIODICTASKS ?? 5 * 60 * 1000

const tasks = [
    deletingRootenTokens
]

function runTasks() {
    tasks.forEach(handler => {
        handler()
    })
}

export function run() {
    console.log("runTasks:", runTasks, "restartTime:", restartTime);
    setInterval(runTasks, +restartTime)
}

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


