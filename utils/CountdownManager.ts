import fs from 'fs';

export class Countdown {
    private readonly duration: number;
    private lastStarted: number; // unix ts seconds
    private timeToGo: number; // in seconds
    private running: boolean;
    public readonly name: string;
    public listeners: CountdownListener[] = []
    public onFinish: () => void = () => { };
    private finishTimeout: NodeJS.Timeout | null = null;

    constructor(name: string, duration: number) {
        this.lastStarted = Date.now();
        this.name = name;
        this.duration = duration;
        this.timeToGo = this.duration;
        this.running = false;
    }

    // Start the countdown
    resume(): void {
        if (this.running) {
            return;

        }
        this.running = true;
        this.lastStarted = Date.now()
        countdownManager.write();

        this.notifyListeners(true, this.timeToGo);

        this.finishTimeout = setTimeout(this.onFinish, this.timeToGo)
    }

    // Stop the countdown
    stop(): void {
        if (!this.running) {
            return;
        }

        this.running = false;


        this.timeToGo -= this.getTimeRemaining();
        countdownManager.write();

        this.notifyListeners(false, this.timeToGo);
        if (this.finishTimeout) clearTimeout(this.finishTimeout)
    }

    // Get the time remaining
    getTimeRemaining(): number {
        if (this.running) {

            let delta = (Date.now() - this.lastStarted) / 1000;
            return this.timeToGo - delta;

        }
        return this.timeToGo;
    }

    // Method to convert the instance to a JSON object
    toJSON(): object {
        return {
            duration: this.duration,
            timeToGo: this.timeToGo,
            lastStarted: this.lastStarted,
            running: this.running,
            name: this.name,
        };
    }

    private notifyListeners(newState: boolean, time: number) {
        this.listeners.forEach(l => {
            console.log("Notifying", l.id, newState, time)
            l.callback(newState, time)
        });
    }

    public addListener(l: CountdownListener) {
        console.log("Adding listener", l.id, l.name);
        this.listeners.push(l);
    }

    public removeListener(id: number) {
        this.listeners = this.listeners.filter(e => e.id != id);
    }

    // Static method to create an instance from a JSON object
    static fromJSON(json: any): Countdown | null {
        if (!json) {
            return null;
        }
        if (json.duration == undefined || json.timeToGo == undefined || json.lastStarted == undefined || json.running == undefined || !json.name) {

            console.log(json.duration, json.timeToGo, json.lastStarted, json.running, json.name)

            return null;

        }
        if (typeof json.duration != "number" || typeof json.timeToGo != "number" || typeof json.lastStarted != "number" || typeof json.running != "boolean" || typeof json.name != "string") {
            console.log("F")
            return null;
        }
        const countdown = new Countdown(json.name, json.duration);
        countdown.lastStarted = json.lastStarted
        countdown.timeToGo = json.timeToGo
        countdown.running = json.running

        console.log(countdown)


        return countdown;
    }
}

class CountdownManager {
    private list: Countdown[] = [];
    private jsonFilePath: string;
    private lastId: number = 999;

    constructor(jsonFilePath: string) {
        this.jsonFilePath = jsonFilePath
        this.read();
    }

    getNextId(): number {
        return ++this.lastId;
    }

    create(name: string, duration: number): Countdown | null {
        const cd = new Countdown(name, duration);
        if (this.getCountdown(name) != undefined) {
            return null
        }
        this.list.push(cd);
        this.write();
        return cd;
    }

    remove(name: string): boolean {
        let oldLength = this.list.length;
        this.list = this.list.filter(e => e.name != name);

        this.write();
        return oldLength != this.list.length;
    }

    getCountdown(name: string): Countdown | undefined {
        return this.list.find(e => e.name == name);
    }

    write() {
        // TODO: parse all countdowns and write to filepath


        const json = JSON.stringify(this.list.map(e => e.toJSON()));
        fs.writeFileSync(this.jsonFilePath, json);
    }

    read() {
        const json = fs.readFileSync(this.jsonFilePath, 'utf-8');
        const countdowns = JSON.parse(json);
        this.list.length = 0;
        for (const c of countdowns) {
            let cd = Countdown.fromJSON(c);
            if (cd) this.list.push(cd);
        }
    }

}

export interface CountdownListener {
    id: number,
    name?: string,
    callback: (newState: boolean, time: number) => void
}

const countdownManager = new CountdownManager("./assets/countdowns.json");

export default countdownManager