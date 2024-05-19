import CountdownManager, { Countdown } from "~/utils/CountdownManager"
import checkPassword from "~/utils/auth";

export default eventHandler(async event => {
    let body = await readBody(event);
    const nameRegex = /^[A-Za-z0-9_-]+$/

    if (!(await checkPassword(event))) {
        return {
            status: 401,
            msg: "Unauthorized"
        }
    }

    if (!nameRegex.test(body.name)) {
        return { status: 400, msg: "Bad Request" }
    }

    return {
        status: 200,
        deleted: CountdownManager.remove(body.name)
    }

})