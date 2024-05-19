import CountdownManager from "~/utils/CountdownManager";

export default eventHandler(async event => {

    // get param name
    let name = await getRouterParam(event, "name");
    const nameRegex = /^[A-Za-z0-9_-]+$/

    if (!name || !nameRegex.test(name)) {
        return { status: 400, msg: "Bad Request" }
    }

    console.log(name);

    return CountdownManager.getCountdown(name)?.getTimeRemaining() ?? { status: 404, msg: `${name} does not exist!` };
})
