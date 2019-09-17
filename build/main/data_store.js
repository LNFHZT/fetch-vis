"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  队列/栈 数据模型实现 FIFO/LIFO
 */
var _a = ['FIFO', 'LIFO'], FIFO = _a[0], LIFO = _a[1];
var DataStore = /** @class */ (function () {
    function DataStore(str) {
        this._dataStore = [];
        this._pattern = '';
        this._pattern = str ? str == FIFO ? FIFO : LIFO : FIFO;
    }
    //  入队/入栈
    DataStore.prototype.enqueue = function (element) {
        this._dataStore.push(element);
    };
    // 出队/出栈
    DataStore.prototype.dequeue = function () {
        if (this._pattern == FIFO) {
            return this._dataStore.shift();
        }
        else {
            return this._dataStore.pop();
        }
    };
    DataStore.prototype.getDataStore = function () {
        return this._dataStore;
    };
    return DataStore;
}());
exports.default = DataStore;
