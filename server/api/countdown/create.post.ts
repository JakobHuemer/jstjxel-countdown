import CountdownManager, { Countdown } from "~/utils/CountdownManager"
import checkPassword from "~/utils/auth";


export default eventHandler(async event => {
    let body = await readBody(event);
    const nameRegex = /^[A-Za-z0-9_-]+$/

    if (!nameRegex.test(body.name) || typeof body.duration != "number") {
        return { status: 400, msg: "Bad Request" }
    }

    if (!(await checkPassword(event))) {
        return { status: 401, msg: "Unauthorized" }
    }


    const cd = CountdownManager.create(body.name, body.duration);
    if (!cd) {
        return {
            status: 400,
            nsg: "Bad Request",
            description: "This name probably already exists!"
        }
    }
    return {
        status: 201,
        msg: "Created",
        countdown: cd
    }

})