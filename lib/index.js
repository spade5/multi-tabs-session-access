"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CHANNEL_STORAGE_KEY = '__channel_storage_key__';
var SHARED_SESSION_KEY = '__shared_session_key__';
var MSG_TYPE_REQUEST = '__msg_type_request__';
var MSG_TYPE_REPLY = '__msg_type_reply__';
var MSG_TYPE_SYNC = '__msg_type_sync__';
var TIMEOUT = 200;
var SharedSession = /** @class */ (function () {
    function SharedSession() {
        var _this = this;
        this._ready = false;
        this.changeCallback = function () { return null; };
        this.ready = function () {
            return new Promise(function (res) {
                if (_this._ready) {
                    res();
                }
                else {
                    setTimeout(function () { return res(); }, TIMEOUT);
                }
            });
        };
        this.getItem = function (key) {
            return _this.ready().then(function () {
                return _this.data[key];
            });
        };
        this.setItem = function (key, value) {
            return _this.ready().then(function () {
                var newData = Object.assign({}, _this.data);
                newData[key] = value;
                _this.data = newData;
            });
        };
        window.addEventListener("storage", function (_a) {
            var key = _a.key, newValue = _a.newValue;
            if (key === CHANNEL_STORAGE_KEY) {
                _this.handleMsg(newValue || '{}');
            }
        });
        this.request(); // 请求连接
        setTimeout(function () {
            _this._ready = true;
        }, TIMEOUT); //200ms 后超时，设置 ready 状态
    }
    SharedSession.prototype.onChange = function (callback) {
        this.changeCallback = callback;
    };
    SharedSession.prototype.handleMsg = function (msg) {
        try {
            var msgObj = JSON.parse(msg);
            switch (msgObj.type) {
                case MSG_TYPE_REQUEST:
                    this.handleRequest();
                    break;
                case MSG_TYPE_REPLY:
                    this.handleReply(msgObj.payload);
                    break;
                case MSG_TYPE_SYNC:
                    this.handleSync(msgObj.payload);
                    break;
            }
        }
        catch (e) {
            throw 'error message format:' + msg;
        }
    };
    SharedSession.prototype.sendMsg = function (msg) {
        localStorage.setItem(CHANNEL_STORAGE_KEY, JSON.stringify(Object.assign({ timeStamp: Date.now() }, msg)));
    };
    SharedSession.prototype.request = function () {
        this.sendMsg({
            type: MSG_TYPE_REQUEST,
        });
    };
    SharedSession.prototype.reply = function () {
        this.sendMsg({
            type: MSG_TYPE_REPLY,
            payload: this.dataStr
        });
    };
    SharedSession.prototype.syncData = function () {
        this.sendMsg({
            type: MSG_TYPE_SYNC,
            payload: this.dataStr
        });
    };
    SharedSession.prototype.handleRequest = function () {
        if (this.dataStr)
            this.reply();
    };
    SharedSession.prototype.handleReply = function (str) {
        this.dataStr = str || '';
        this._ready = true;
    };
    SharedSession.prototype.handleSync = function (str) {
        this.dataStr = str || '';
    };
    Object.defineProperty(SharedSession.prototype, "dataStr", {
        get: function () {
            return sessionStorage.getItem(SHARED_SESSION_KEY) || '';
        },
        set: function (str) {
            sessionStorage.setItem(SHARED_SESSION_KEY, str);
            this.changeCallback(this.data);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SharedSession.prototype, "data", {
        get: function () {
            try {
                var str = this.dataStr;
                if (str)
                    return JSON.parse(str);
            }
            catch (e) { }
            return {};
        },
        set: function (_data) {
            var str = JSON.stringify(_data);
            this.dataStr = str;
            this.syncData();
        },
        enumerable: false,
        configurable: true
    });
    SharedSession.prototype.removeItem = function (key) {
        var newData = Object.assign({}, this.data);
        delete newData[key];
        this.data = newData;
    };
    SharedSession.prototype.clear = function () {
        sessionStorage.removeItem(SHARED_SESSION_KEY);
    };
    return SharedSession;
}());
exports.default = SharedSession;
