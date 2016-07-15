/**
 * @file colorblock,编写划区块工具
 * @author mazhongjie@baidu.com
 */
import Baidu from './modules/baidu_event';
import DrawLayer from './drawLayer';
import Events from './modules/events';
import Config from './config/config';
import drawingManager from './drawingManager';
import DrawingTool from './DrawingTool';
import globalEvent from './events/globalEvent';
import DispatchEvn from './events/dispatchEvent';
import globalStore from './store/globalStore';

const baidu = Baidu;
/** 
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib = window.BMapLib = BMapLib || {};

const BMAP_DRAWING_POLYLINE  = "polyline",   // 鼠标画线模式
    BMAP_DRAWING_RECTANGLE = "rectangle",  // 鼠标画矩形模式
    BMAP_DRAWING_POLYGON   = "polygon";    // 鼠标画多边形模式
    
class ColorBlock extends drawingManager{
    constructor(mapObj, param) {
        super(mapObj);
        Events.mixTo(this);
        this._map = mapObj;
        this._configObj = new Config(param);
        this.config = this._configObj.getConfig();
        this.dispatchEvn = new DispatchEvn(this);
        this._init();
    }

    _init() {
        let self = this;
        let opts = this.config;

        self.initDrawingTool();
        self.initDrawLayer();

        //是否计算绘制出的面积 
        if (opts.enableCalculate === true) {
            this.enableCalculate();
        } else {
            this.disableCalculate();
        }
    }

    /**
     * 是否显示工具条
     */
    initDrawingTool() {
        let opt = this.config;
        if (opt.enableDrawingTool) {
            var drawingTool  = new DrawingTool(this, opt);
            this._drawingTool = drawingTool;
            this._map.addControl(drawingTool);
        }
    }

    /**
     * @method 初始化drawlayer
     */
    initDrawLayer() {
        this.drawLayer = new DrawLayer(this._map, this.config);
        this._canvas = this.drawLayer.canvasLayer;

    }
    
    /**
     * 删除指定ID的面数据
     * @param  {} id
     */
    deletePolygonById(id) {
        if (!id) {
            return;
        }
        globalEvent.emit('delete_polygon_byid', id);

    }
    /**
     * 获取所有矩形数据
     * @return array
     */
    getPolygon() {
        let blockdatas =  globalStore.getBlockData();
        return blockdatas.map(item => {
            return {
                id: item.id,
                polygons: item.polygons
            }
        });
    }
    /**
     * 通过多个id合并多边形数据
     */
    unionPolygonById() {
        let ids = arguments;
        
    }

};

BMapLib.ColorBlock = ColorBlock;

