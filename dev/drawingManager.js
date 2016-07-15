/**
 * @file 画矩形控制
 */
import Events from './modules/events';

import globalStore from './store/globalStore';
import globalEvent from './events/globalEvent';
import baidu from './modules/baidu_event';

const BMAP_DRAWING_POLYLINE  = "polyline",   // 鼠标画线模式
    BMAP_DRAWING_RECTANGLE = "rectangle",  // 鼠标画矩形模式
    BMAP_DRAWING_POLYGON   = "polygon";    // 鼠标画多边形模式

class DrawingManager {
    constructor(map) {
        this._map = map;
        this.drawLayer = '';
        this.listenStore();
    }

    // 设置鼠标样式
    setMouseCursor() {
        let map = this._map;
        map.setDefaultCursor("url('bird.cur')");
    }
    
    listenStore() {
        let self = this;
        globalStore.on('ready',function(type, param) {
            if (type === 'setDrawStatus') {
                if (param) {
                    self._open();
                }
                else {
                    self._close();
                }
            }
        });
    }

    /**
     * 开启地图的绘制模式
     */
    open() {
        // 判断绘制状态是否已经开启
        var isopen = globalStore.getDrawingType();
        if (isopen == true){
            return true;
        }
         globalEvent.emit('setDrawStatus', true);

    }

    close() {
        var self = this;
        var isopen = globalStore.getDrawingType();
        if (isopen == false){
            return true;
        }
        globalEvent.emit('setDrawType', 'normal');
        globalEvent.emit('setDrawStatus', false);
        setTimeout(function(){
            self._map.enableDoubleClickZoom();
        },500);
    }

    /**
     * 打开距离或面积计算
     */
    enableCalculate() {
        this._enableCalculate = true;
        this._addGeoUtilsLibrary();
    }
    /**
     * 关闭距离或面积计算
     *
     * @example <b>参考示例：</b><br />
     * myDrawingManagerObject.disableCalculate();
     */
    disableCalculate() {
        this._enableCalculate = false;
    }

    /**
     * 开启测距和测面功能需要依赖于GeoUtils库
     * 所以这里判断用户是否已经加载,若未加载则用js动态加载
     */
    _addGeoUtilsLibrary() {
        if (!BMapLib.GeoUtils) {
            var script = document.createElement('script');
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", 'http://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js');
            document.body.appendChild(script);
        }
    }

    /**
     * 向地图中添加文本标注
     * @param {Point}
     * @param {String} 所以显示的内容
     */
    _addLabel(point, content) {
        var label = new BMap.Label(content, {
            position: point
        });
        this._map.addOverlay(label);
        return label;
    }

    /**
     * 设置当前的绘制模式，参数DrawingType，为5个可选常量:
     * <br/>BMAP_DRAWING_MARKER    画点
     * <br/>BMAP_DRAWING_CIRCLE    画圆
     * <br/>BMAP_DRAWING_POLYLINE  画线
     * <br/>BMAP_DRAWING_POLYGON   画多边形
     * <br/>BMAP_DRAWING_RECTANGLE 画矩形
     * @param {DrawingType} DrawingType
     * @return {Boolean} 
     */
    setDrawingMode(DrawingType) {
        //与当前模式不一样时候才进行重新绑定事件
        var drawingType = globalStore.getDrawingType();
        if (drawingType!== DrawingType) {
            globalEvent.emit('setDrawType', DrawingType);
        }
    }

    /**
     * 获取当前的绘制模式
     * @return {DrawingType} 绘制的模式
     */
    getDrawingMode() {
        return globalStore.getDrawingType();
    }

    /**
     * 开启地图的绘制状态
     * @return {Boolean}，开启绘制状态成功，返回true；否则返回false。
     */
    _open() {
        let drawingType = globalStore.getDrawingType();
        this._setDrawingMode(drawingType);
    }

    /**
     * 设置当前的绘制模式
     * @param {DrawingType}
     */
    _setDrawingMode(drawingType) {
        let self = this;
        /**
         * 开启编辑状态时候才重新进行事件绑定
         */
        var _isopen = globalStore.getIsOpen();
        if (_isopen) {
            self._canvas.__listeners = {};
            switch(drawingType) {
                case BMAP_DRAWING_POLYLINE:
                case BMAP_DRAWING_POLYGON:
                    self._bindPolylineOrPolygon();
                    break;
                case BMAP_DRAWING_RECTANGLE:
                    self._bindRectangle();
                    break;
            }
        }

        /** 
         * 如果添加了工具栏，则也需要改变工具栏的样式
         */
        if (this._drawingTool && _isopen) {
            this._drawingTool.setStyleByDrawingMode(drawingType);
        }
    }
    /**
     * 关闭地图的绘制状态
     * @return {Boolean}，关闭绘制状态成功，返回true；否则返回false。
     */
    _close() {
        
        this._canvas.__listeners = {};
        globalEvent.emit('drawingCache', []);
        if (this._drawingTool) {
            this._drawingTool.setStyleByDrawingMode('hander');
        }
    }

    /**
     * 画线和画多边形相似性比较大，公用一个方法
     */
    _bindPolylineOrPolygon() {
        let self = this;
        let map = this._map;
        let canvas = this._canvas;
        let points = []; //用户绘制的点
        let drawPoint = null; //实际需要画在地图上的点
        let overlay = null;
        let isBinded = false;
        let drawingType = self.getDrawingMode();

        var controlButton = this.config.controlButton;
        var startAction = (e) => {
            if (controlButton === 'right' && (e.button ==1 || e.button === 0)) {
                return;
            }
            points.push(e.point);
            drawPoint = points.concat(points[points.length - 1]);

            if (points.length === 1) {
                // 线段
                if (drawingType === BMAP_DRAWING_POLYLINE) {
                    overlay = new BMap.Polyline(drawPoint, {});
                } else if (drawingType === BMAP_DRAWING_POLYGON) { //多边形
                    overlay = new BMap.Polygon(drawPoint, {});
                }
                globalEvent.emit('drawingCache', points);
            } else {
                globalEvent.emit('drawingCache', points);
            }

            if (!isBinded) {
                isBinded = true;
                canvas.enableEdgeMove();
                canvas.addEventListener('mousemove', mousemoveAction);
                canvas.addEventListener('dblclick', dblclickAction);
            }
        };

        /**
         * 鼠标移动过程的事件
         */
        var mousemoveAction = (e) => {
            globalEvent.emit('drawingCache', points.concat(e.point));
        };

        /**
         * 鼠标双击的事件
         */
        var dblclickAction = (e) => {
            baidu.stopBubble(e);
            isBinded = false;
            canvas.disableEdgeMove();
            canvas.removeEventListener('mousedown', startAction);
            canvas.removeEventListener('mousemove', mousemoveAction);
            canvas.removeEventListener('dblclick', dblclickAction);

            if(controlButton === 'right') {
                points.push(e.point);
            } else if (baidu.id <= 8) {

            } else {
                points.pop();
            }
            overlay.setPath(points);
            var calculate = self._calculate(overlay, points);
            globalEvent.emit('drawComplete', {
                calculate: calculate,
                data: [].concat(points)
            });
            self._dispatchOverlayComplete(overlay, calculate);
            points = [];
            drawPoint.length = 0;
            self.close();
        };

        canvas.addEventListener('mousedown', startAction);
        //双击时候不放大地图级别
        canvas.addEventListener('dblclick', function(e) {
            baidu.stopBubble(e);
        });

    }

    /**
     * 绑定鼠标画矩形的事件
     */
    _bindRectangle() {
        var self = this;
        var map = self._map;
        var canvas = self._canvas;
        var polygon = null;
        var startPoint = null;

        var controlButton = this.config.controlButton;
        var endPoint;
        var startAction = function(e) {
            baidu.stopBubble(e);
            baidu.preventDefault(e);
            if (controlButton === 'right' && (e.button ==1 || e.button == 0)) {
                return;
            }
            startPoint = e.point;
            endPoint = startPoint;
            globalEvent.emit('drawingCache', self._getRectanglePoint(startPoint, endPoint));
            canvas.enableEdgeMove();
            canvas.addEventListener('mousemove', moveAction);
            baidu.on(document, 'mouseup', endAction);
        };
        var moveAction = (e) => {
            endPoint = e.point;
            globalEvent.emit('drawingCache', self._getRectanglePoint(startPoint, endPoint));
        };

        var endAction = (e) => {
            endPoint = e.point || endPoint;
            polygon = new BMap.Polygon(self._getRectanglePoint(startPoint, endPoint), {});
            var calculate = self._calculate(polygon, polygon.getPath()[2]);
            globalEvent.emit('drawComplete', {
                calculate: calculate,
                data: self._getRectanglePoint(startPoint, endPoint)
            });
            self._dispatchOverlayComplete(polygon, calculate);
            canvas.disableEdgeMove();
            startPoint = null;
            canvas.removeEventListener('mousemove', moveAction);
            baidu.un(document, 'mouseup', endAction);
        };
        canvas.addEventListener('mousedown', startAction);
    }

    /**
     * 添加显示所绘制图形的面积或者长度
     * @param {overlay} 覆盖物
     * @param {point} 显示的位置
     */
    _calculate(overlay, point) {
        var result = {
            data  : 0,    //计算出来的长度或面积
            label : null  //显示长度或面积的label对象
        };
        if (this._enableCalculate && BMapLib.GeoUtils) {
            var type = overlay.toString();
            //不同覆盖物调用不同的计算方法
            switch (type) {
                case "[object Polyline]":
                    result.data = BMapLib.GeoUtils.getPolylineDistance(overlay);
                    break;
                case "[object Polygon]":
                    result.data = BMapLib.GeoUtils.getPolygonArea(overlay);
                    break;
                case "[object Circle]":
                    var radius = overlay.getRadius();
                    result.data = Math.PI * radius * radius;
                    break;
            }
            //一场情况处理
            if (!result.data || result.data < 0) {
                result.data = 0;
            } else {
                //保留2位小数位
                result.data = result.data.toFixed(2);
            }
            result.label = this._addLabel(point, result.data);
        }
        return result;


    }

    /**
     * 根据起终点获取矩形的四个顶点
     * @param {Point} 起点
     * @param {Point} 终点
     */
    _getRectanglePoint(startPoint, endPoint) {
        return [
            new BMap.Point(startPoint.lng, startPoint.lat),
            new BMap.Point(endPoint.lng, startPoint.lat),
            new BMap.Point(endPoint.lng, endPoint.lat),
            new BMap.Point(startPoint.lng, endPoint.lat),
            new BMap.Point(startPoint.lng, startPoint.lat)
        ];
    }
    /**
     * 派发事件
     */
    _dispatchOverlayComplete(overlay, calculate) {
        let drawingType = globalStore.getDrawingType();
        var options = {
            'overlay'     : overlay,
            'drawingMode' : drawingType
        };
        if (calculate) {
            options.calculate = calculate.data || null;
            options.label = calculate.label || null;
        }
       
        this.dispatchEvent(drawingType + 'complete', overlay);
        this.dispatchEvent('overlaycomplete', options);
    } 
}

/**
 * 这里不使用api中的自定义事件，是为了更灵活使用
 */
DrawingManager.prototype.dispatchEvent = baidu.lang.Class.prototype.dispatchEvent;
DrawingManager.prototype.addEventListener = baidu.lang.Class.prototype.addEventListener;
DrawingManager.prototype.removeEventListener = baidu.lang.Class.prototype.removeEventListener;


export default DrawingManager;