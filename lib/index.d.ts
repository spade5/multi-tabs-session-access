declare const Session: {
    ready(): Promise<void>;
    getItemSync(key: string): string;
    getItem(key: string): Promise<string>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    listen(callback: (data: any) => any): void;
};
export default Session;
