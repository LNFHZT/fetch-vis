/**
 *  队列/栈 数据模型实现 FIFO/LIFO
 */
const [FIFO, LIFO] = ['FIFO', 'LIFO']
class DataStore {
    private _dataStore: Array<any> = [];
    private _pattern: String = '';
    constructor(str: String) {
        this._pattern = str ? str == FIFO ? FIFO : LIFO : FIFO;
    }
    //  入队/入栈
    enqueue(element: any) {
        this._dataStore.push(element);
    }
    // 出队/出栈
    dequeue() {
        if (this._pattern == FIFO) {
            return this._dataStore.shift();
        } else {
            return this._dataStore.pop();
        }
    }
    getDataStore() {
        return this._dataStore;
    }
}

export default DataStore;