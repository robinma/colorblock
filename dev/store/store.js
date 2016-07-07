/**
 * @file store class
 * @author mazhongjie@baidu.com
 */

import Events from '../modules/events';

class Store{
    constructor() {
       Events.mixTo(this);
    }
    bindEvent(event) {
        this.event = event;
    }
}

Store.prototype.listen = Store.prototype.on;


export default Store;
