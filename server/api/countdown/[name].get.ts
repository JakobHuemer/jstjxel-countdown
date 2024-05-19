import countdownManager from "~/utils/CountdownManager";
import CountdownManager from "~/utils/CountdownManager";

export default eventHandler(async event => {

    // get param name
    let name = await getRouterParam(event, "name");
    const nameRegex = /^[A-Za-z0-9_-]+$/

    if (!name || !nameRegex.test(name)) {
        return { status: 400, msg: "Bad Request" }
    }

    let cd = CountdownManager.getCountdown(name);

    if (!cd) {
        return { status: 404, msg: `${name} does not exist!` }
    }

    return {
        status: 200,
        msg: "OK",
        timestamp: Date.now(),
        countdown: {
            running: cd.isRunning,
            remaining: cd.getTimeRemaining(),
            duration: cd.maxTime
        }
    }
})
