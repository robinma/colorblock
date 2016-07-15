/**
 * @file 全局数据store
 */
import Store from './store';
import GlobalEvent from '../events/globalEvent';
import baidu from '../modules/baidu_event';
import PolygonDiff from '../modules/polygonDiff';

const BMAP_DRAWING_POLYLINE  = "polyline",   // 鼠标画线模式
    BMAP_DRAWING_RECTANGLE = "rectangle",  // 鼠标画矩形模式
    BMAP_DRAWING_POLYGON   = "polygon";    // 鼠标画多边形模式

class GlobalStore extends Store {
    constructor() {
        super();
        this.data = {
            drawingType: 'normal',
            _isopen: false,
            cacheData: [],
            blockData: [],
            unionPolygon: [],
            // 所有交点
            interPoints: []
        }
        this.bindEvent(GlobalEvent);
        this.onReady();
    }

    setDrawingType(dtype) {
        this.data.drawingType = dtype;
    }
    getDrawingType() {
        return this.data.drawingType;
    }

    setIsOpen(isOpen) {
        this.data._isopen = isOpen;
    }

    getIsOpen() {
        return this.data._isopen;
    }
    setCacheData(data) {
        this.data.cacheData = this._formateData(data);
    }
    getCacheData() {
        return this.data.cacheData;
    }
    getUniqId(prefix) {
        return (prefix || '') + new Date().getTime().toString(36);
    }
    
    /**
     * 通过id删除polygon数据
     * @param  {} id
     */
    deletePolygonById(id) {
        let blockData = this.getBlockData();
        let hasremove = false;
        let newData = blockData.filter(item => {
            if (item.id === id) {
                hadremove = true;
                return false;
            }
            return true;
        }, this);
        this.data.blockData = newData;
        return hasremove;
    }
    /**
     * 装入新的block块
     */
    setBlockData(data) {
        data.data = this._formateData(data.data);
        let newPolygon = this._getPolygonData(data);
        var tempData = {};
        tempData['drawingType'] = this.getDrawingType();
        tempData['id'] = this.getUniqId('block');
        tempData['polygons'] = newPolygon;
        baidu.extend(tempData, data);
        this.data.blockData.push(tempData);
    }

    getBlockData() {
        return this.data.blockData;
    }

    /**
     * 当时多边形时，添加第一条数据至尾部，完成闭合
*/
    _formateData(data) {

        let drawType = this.getDrawingType();
        if (drawType === BMAP_DRAWING_POLYGON && data.length > 0) {
            data = data.concat(data[0]);
        }
        return data;
    }
    /**
     * 存储外多边形
     */
    setLastPolygon(polygon) {
        this.data.lastPolygon = polygon;
    }
    getLastPolygon() {
        return this.data.lastPolygon;
    }
    /**
     * 存储所有焦点
     */
    setInterPoints(data) {
        this.data.interPoints = this.data.interPoints.concat(data);
    }
    getInterPoints() {
        return this.data.interPoints;
    }
    /**
     * 获取交叉后的多边形数据
     */
    _getPolygonData(srcData) {
        let self = this;
        let blockDatas = this.getBlockData();
        let polygonDiff = new PolygonDiff(blockDatas, srcData.data);
        let diffPolyon = polygonDiff.getPolygon();
        return diffPolyon;
    }


    onReady() {
        let self = this;
        let trigEvname = 'ready';
        this.event.on('setDrawType', function (type) {
            self.setDrawingType(type);
            self.trigger(trigEvname, 'setDrawType', self.getDrawingType());
        });
        this.event.on('setDrawStatus', (value) => {
            self.setIsOpen(value);
            self.trigger(trigEvname, 'setDrawStatus', self.getIsOpen());
        });
        this.event.on('drawingCache', (data) => {
            self.setCacheData(data);
            self.trigger(trigEvname, 'drawingCache', self.getCacheData());
        });
        this.event.on('drawComplete', (data) => {
            self.setBlockData(data);
            self.setCacheData([]);
            self.trigger(trigEvname, 'drawComplete', self.getBlockData());
        });
        this.event.on('delete_polygon_byid', (id) => {
            let hasRemove = self.deletePolygonById(id);
            self.trigger(trigEvname, 'deletePolygonById', hasRemove, self.getBlockData());
        });
    }

}

export default new GlobalStore();