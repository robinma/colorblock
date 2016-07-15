/**
 * @file 派发对外接口
 */

import globalStore from '../store/globalStore';

export default class DispatchEvent {
    constructor(root) {
        this.root = root;
        this._listenStore();
    }

    _listenStore() {
        let self = this;
        globalStore.listen('ready',function(type, param) {
            let args = arguments;
            switch(type) {
                case 'deletePolygonById':
                case 'setDrawType':
                    self.root.dispatchEvent(...args);
                    break;
            }
        });
    }
};