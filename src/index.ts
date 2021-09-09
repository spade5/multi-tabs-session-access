const CHANNEL_STORAGE_KEY = '__channel_storage_key__'
const SHARED_SESSION_KEY = '__shared_session_key__'

const MSG_TYPE_REQUEST = '__msg_type_request__'
const MSG_TYPE_REPLY = '__msg_type_reply__'
const MSG_TYPE_SYNC = '__msg_type_sync__'

interface MsgProps {
    type: string,
    payload?: string
}

const TIMEOUT = 200

class SharedSession {
    _ready: Boolean = false
    constructor() {
        window.addEventListener("storage", ({ key, newValue }) => {
            if (key === CHANNEL_STORAGE_KEY) {
                this.handleMsg(newValue || '{}')
            }
        })
        this.request() // 请求连接
        setTimeout(() => {
            this._ready = true
        }, TIMEOUT) //200ms 后超时，设置 ready 状态
    }
    changeCallback: (data: any) => any = () => null
    onChange(callback: (data: any) => any) {
        this.changeCallback = callback
    }
    handleMsg(msg: string) {
        try {
            const msgObj: MsgProps = JSON.parse(msg)
            switch (msgObj.type) {
                case MSG_TYPE_REQUEST: this.handleRequest(); break;
                case MSG_TYPE_REPLY: this.handleReply(msgObj.payload); break;
                case MSG_TYPE_SYNC: this.handleSync(msgObj.payload); break;
            }
        } catch (e) {
            throw 'error message format:' + msg
        }
    }
    sendMsg(msg: MsgProps) {
        localStorage.setItem(CHANNEL_STORAGE_KEY, JSON.stringify(Object.assign({timeStamp: Date.now()}, msg)))
    }
    request() { //发出请求
        this.sendMsg({
            type: MSG_TYPE_REQUEST,
        })
    }
    reply() {  //发出响应，传递数据
        console.log('reply')
        this.sendMsg({
            type: MSG_TYPE_REPLY,
            payload: this.dataStr
        })
    }
    syncData() {  //同步数据
        this.sendMsg({
            type: MSG_TYPE_SYNC,
            payload: this.dataStr
        })
    }
    handleRequest() { //收到请求，响应
        if (this.dataStr) this.reply()
    }
    handleReply(str?: string) {  //收到响应，处理数据
        this.dataStr = str || ''
        this._ready = true
    }
    handleSync(str?: string) {  //收到同步命令，同步数据
        this.dataStr = str || ''
    }
    
    ready:() => Promise<void> = () => {
        return new Promise<void>((res) => {
            if (this._ready) {
                res()
            } else {
                setTimeout(() => res(), TIMEOUT)
            }
        })
    }

    get dataStr(): string {
        return sessionStorage.getItem(SHARED_SESSION_KEY) || '{}'
    }
    set dataStr(str: string) {
        sessionStorage.setItem(SHARED_SESSION_KEY, str || '{}')
        this.changeCallback(this.data)
    }
    get data(): {[key: string]: string} {
        try {
            const str =  this.dataStr
            if (str) return JSON.parse(str)
         } catch (e) { }
        return {}
    }
    set data(_data: { [key: string]: string}) {
        const str = JSON.stringify(_data)
        this.dataStr = str
        this.syncData()
    }
    getItem: (key: string) => Promise<string> = (key) => {
        return this.ready().then<string>(() => {
            return this.data[key]
        })
    }
    setItem:(key: string, value: string) => Promise<void> = (key, value) => {
        return this.ready().then(() => {
            const newData: any = Object.assign({}, this.data)
            newData[key] = value
            this.data = newData
        })
    }
    removeItem(key: string) {
        return this.ready().then(() => {
            const newData: any = Object.assign({}, this.data)
            delete newData[key]
            this.data = newData
        })
    }
    clear() {
        return this.ready().then(() => {
            sessionStorage.removeItem(SHARED_SESSION_KEY)
            this.syncData()
        })
    }
}

const session = new SharedSession()

const Session = {
    ready() {
        return session.ready()
    },
    getItemSync(key: string) {
        return session.data && session.data[key]
    },
    getItem(key: string) {
        return session.getItem(key)
    },
    setItem(key: string, value: string) {
        return session.setItem(key, value)
    },
    removeItem(key: string) {
        return session.removeItem(key)
    },
    clear() {
        return session.clear()
    },
    listen(callback: (data: any) => any) {
        session.onChange(callback)
    }
}

export default Session