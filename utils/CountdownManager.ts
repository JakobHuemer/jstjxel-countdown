import fs from 'fs';
import countdown from 'assets/countdowns.json';

export class Countdown {
    private readonly duration: number;
    private lastStarted: number; // unix ts seconds
    private timeToGo: number; // in seconds
    private running: boolean;
    public readonly name: string;
    public listeners: CountdownListener[] = [];
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
        if ( this.running || this.timeToGo <= 0 ) {
            return;
        }

        this.running = true;
        this.lastStarted = Date.now();
        countdownManager.write();

        this.updateListeners(true, this.timeToGo);

        this.finishTimeout = setTimeout(() => {
            console.log('ENDING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            this.stop();
            this.timeToGo = 0;
            this.notifyEndListeners();
        }, this.timeToGo * 1000);
    }

    // Stop the countdown
    stop(): void {
        if ( !this.running ) {
            return;
        }

        this.timeToGo = Math.max(this.getTimeRemaining(), 0);
        this.running = false;
        countdownManager.write();

        this.updateListeners(false, this.timeToGo);
        if ( this.finishTimeout ) clearTimeout(this.finishTimeout);
    }

    update() {
        console.log(this.getTimeRemaining())
        if ( this.getTimeRemaining() <= 0 ) {
            // this.stop();
            this.running = false;
            this.notifyEndListeners();
            this.timeToGo = 0;
        }
        console.log("jiahwidawd")
    }

    // Get the time remaining
    getTimeRemaining(): number {

        if ( this.running ) {

            let delta = (Date.now() - this.lastStarted) / 1000;

            if (this.timeToGo - delta <= 0) {
                this.running = false;
                this.timeToGo = 0;
                this.notifyEndListeners();
                return 0;
            }

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

    private updateListeners(newState: boolean, time: number) {
        this.listeners.forEach(l => {
            l.callback(newState, time);
        });
    }

    private notifyEndListeners() {
        this.listeners.forEach(l => {
            l.finishCallback();
        });

    }

    public addListener(l: CountdownListener) {
        this.listeners.push(l);
    }

    public removeListener(id: number) {
        this.listeners = this.listeners.filter(e => e.id != id);
    }

    get isRunning(): boolean {
        return this.running;
    }

    get maxTime(): number {
        return this.duration;
    }

    // Static method to create an instance from a JSON object
    static fromJSON(json: any): Countdown | null {
        if ( !json ) {
            return null;
        }
        if ( json.duration == undefined || json.timeToGo == undefined || json.lastStarted == undefined || json.running == undefined || !json.name ) {

            return null;

        }
        if ( typeof json.duration != 'number' || typeof json.timeToGo != 'number' || typeof json.lastStarted != 'number' || typeof json.running != 'boolean' || typeof json.name != 'string' ) {
            return null;
        }
        const countdown = new Countdown(json.name, json.duration);
        countdown.lastStarted = json.lastStarted;
        countdown.timeToGo = json.timeToGo;
        countdown.running = json.running;


        return countdown;
    }
}

class CountdownManager {
    private list: Countdown[] = [];
    private jsonFilePath: string;
    private lastId: number = 999;

    constructor(jsonFilePath: string) {
        this.jsonFilePath = jsonFilePath;
        this.read();
    }

    getNextId(): number {
        return ++this.lastId;
    }

    get all(): Countdown[] {
        return this.list;
    }

    create(name: string, duration: number): Countdown | null {
        const cd = new Countdown(name, duration);
        if ( this.getCountdown(name) != undefined ) {
            return null;
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
        console.log(1, fs.readdirSync("./"))
        console.log(2, fs.readdirSync("./"))
        console.log(3, fs.readdirSync("./"))
        console.log(4, fs.readdirSync("./"))
        console.log(5, fs.readdirSync("./"))
        console.log(6, fs.readdirSync("./"))
        console.log(7, fs.readdirSync("./"))
        const json = fs.readFileSync(this.jsonFilePath, 'utf-8');
        const countdowns = JSON.parse(json);
        this.list.length = 0;
        for ( const c of countdowns ) {
            let cd = Countdown.fromJSON(c);
            if ( cd ) {
                cd.update();
                this.list.push(cd);
            }
        }
    }

}

export interface CountdownListener {
    id: number,
    name?: string,
    callback: (newState: boolean, time: number) => void,
    finishCallback: () => void,
}

// const countdownManager = new CountdownManager('./assets/countdowns.json');
const countdownManager = new CountdownManager('./countdowns.json');

export default countdownManager;