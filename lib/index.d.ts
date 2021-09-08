interface MsgProps {
    type: string;
    payload?: string;
}
export default class SharedSession {
    _ready: Boolean;
    constructor();
    changeCallback: (data: any) => any;
    onChange(callback: (data: any) => any): void;
    handleMsg(msg: string): void;
    sendMsg(msg: MsgProps): void;
    request(): void;
    reply(): void;
    syncData(): void;
    handleRequest(): void;
    handleReply(str?: string): void;
    handleSync(str?: string): void;
    ready: () => Promise<void>;
    get dataStr(): string;
    set dataStr(str: string);
    get data(): {
        [key: string]: string;
    };
    set data(_data: {
        [key: string]: string;
    });
    getItem: (key: string) => Promise<string>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem(key: string): void;
    clear(): void;
}
export {};
