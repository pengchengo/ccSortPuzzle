export class TYEvent {
    public target: any;
    public data: any;
    public type: string;
    public isPropagationImmediateStopped: boolean;

    public stopImmediatePropagation(): void {
        this.isPropagationImmediateStopped = true;
    }

    protected clean(): void {
        this.data = this.target = null;
        this.isPropagationImmediateStopped = false;
    }

    public constructor(type: string, data?: any) {
        this.type = type;
        this.data = data;
    }

    public static create<T extends TYEvent>(EventClass: { new(type: string): T; eventPool?: TYEvent[] }, type: string): T {
        let eventPool: TYEvent[];
        let hasEventPool = (EventClass as any).hasOwnProperty("eventPool");
        if (hasEventPool) {
            eventPool = EventClass.eventPool;
        }

        if (!eventPool) {
            eventPool = EventClass.eventPool = [];
        }
        if (eventPool.length) {
            let event: T = <T>eventPool.pop();
            event.type = type;
            return event;
        }
        return new EventClass(type);
    }

    public static dispatchEvent(target: any, type: string, data?: any) {
        let event = TYEvent.create(TYEvent, type);
        event.data = data;
        target.dispatchEvent(event);
        TYEvent.release(event);
    }

    public static release(event: TYEvent): void {
        event.clean();
        let EventClass: any = Object.getPrototypeOf(event).constructor;
        EventClass.eventPool.push(event);
    }

}

export class EventDef {
    static energyChange = "energyChange"
    static coinChange = "coinChange"
    static onlineCoinChange = "onlineCoinChange"
    static pieceChange = "pieceChange"
    static drinkChange = "drinkChange"
    static matChange = "matChange"
    static seasonChange = "seasonChange"
    
}