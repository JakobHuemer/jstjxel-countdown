import CountdownManager, { Countdown, CountdownListener } from "~/utils/CountdownManager"

export default eventHandler(async event => {

    let name = await getRouterParam(event, "name");
    const nameRegex = /^[A-Za-z0-9_-]+$/

    if (!name || !nameRegex.test(name)) {
        return { status: 400, msg: "Bad Request" }
    }

    let cd = CountdownManager.getCountdown(name);

    if (!cd) {
        return { status: 404, msg: `${name} doesn't exist!` }
    }

    setHeaders(event, {
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    })
    setResponseStatus(event, 200);

    // return sse

    let listener: CountdownListener = {
        id: CountdownManager.getNextId(),
        callback: (newState: boolean, time: number): void => {
            console.log("Sending", newState, time)
            event.node.res.write(`data: ${JSON.stringify({
                newState, time,
            })}\n\n`)
        }
    }

    cd.addListener(listener);

    event.node.res.write(`id: ${listener.id}\n`);

    event.node.res.on("close", () => {
        cd.removeListener(listener.id);
    })

    event._handled = true;
    console.log("Listening to", name, "with id", listener.id)

})