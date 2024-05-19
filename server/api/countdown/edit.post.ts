import CountdownManager from "~/utils/CountdownManager";
import checkPassword from "~/utils/auth";

export default eventHandler(async event => {
    let body = await readBody(event);

    const nameRegex = /^[A-Za-z0-9_-]+$/

    if (!(await checkPassword(event))) {
        return { status: 401, msg: "Unauthorized" }
    }

    if (!body.name || !nameRegex.test(body.name) || typeof body.state != "boolean") {
        return { status: 400, msg: "Bad Request" }
    }

    let newState = body.state;
    console.log(newState)

    let cd = CountdownManager.getCountdown(body.name);

    if (!cd) {
        return { status: 404, msg: `${body.name} doesn't exist!` }
    }


    if (newState) {
        cd.resume();
    } else {
        cd.stop();
    }
})