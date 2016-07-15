/**
 * @file store class
 * @author mazhongjie@baidu.com
 */

import Events from '../events/events';

class Store extends Events{
    constructor() {
       super();
    }
    bindEvent(event) {
        this.event = event;
    }
}


export default Store;
