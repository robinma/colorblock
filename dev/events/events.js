/**
 * @file global Event
 */

export default class Events {
    constructor() {
        this.emits = {};
        this.maxId = 0;
    }
    /**
     * listen for a channle
     * @param  {String} channle
     * @param  {Function} fn
     * @returns the listener's id
     */
    on(channel, fn) {
        this.emits[channel] = this.emits[channel] || {};
        var id = ++this.maxId
        this.emits[channel][id] = fn;
        return id;
    }
    // same with on function
    listen() {
        this.on(...arguments);
    }
    
    /**
     * remove the listener  
     * @param  {Number} id the linstner's id
     */
    unbind(id) {
        for (var channel in this.emits) {
            var typeFn = this.emits[channel];
            for (var _id in typeFn) {
                if (id == id) {
                    delete this.emits[channel][id];
                    return true;
                }
            }
        }
        return false;
    }
    
    /**
     * emit data to a special channel
     * @param  {String} channel
     * @param  {Object} data
     */
    emit(channel, data) {
        let args = Array.prototype.slice.call(arguments, 1);
        for (var i in this.emits[channel]) {
            this.emits[channel][i](...args);
        }
    }
    
    trigger() {
        this.emit(...arguments);
    }


}