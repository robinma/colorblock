/**
 * 一直覆盖在当前地图视野的Canvas对象
 *
 * @author nikai (@胖嘟嘟的骨头, nikai@baidu.com)
 *
 * @param 
 * {
 *     map 地图实例对象
 * }
 */ 
import baidu from './baidu_event';

function CanvasLayer(options){
    this.options = options || {};
    this.paneName = this.options.paneName || 'labelPane';
    this.zIndex = this.options.zIndex || 0;
    this._map = options.map;
    this._lastDrawTime = null;
    /**
     * 鼠标到地图边缘的时候是否自动平移地图
     */
    this._enableEdgeMove = false;
    this.show();
}

/**
 * 这里不使用api中的自定义事件，是为了更灵活使用
 */
CanvasLayer.prototype.dispatchEvent = baidu.lang.Class.prototype.dispatchEvent;
CanvasLayer.prototype.addEventListener = baidu.lang.Class.prototype.addEventListener;
CanvasLayer.prototype.removeEventListener = baidu.lang.Class.prototype.removeEventListener;

if (window.BMap) {
    CanvasLayer.prototype = new BMap.Overlay();
    CanvasLayer.prototype.initialize = function(map){
        this._map = map;
        var canvas = this.canvas = document.createElement("canvas");
        canvas.style.cssText = "position:absolute;"
                                + "left:0;" 
                                + "top:0;"
                                + "z-index:" + this.zIndex + ";";
        this.adjustSize();
        map.getPanes()[this.paneName].appendChild(canvas);
        var that = this;
        map.addEventListener('resize', function () {
            that.adjustSize();
            that._draw();
        });
        this._bind();
        return this.canvas;
    }

    CanvasLayer.prototype.adjustSize = function(){
        // var size = this._map.getSize();
        // var canvas = this.canvas;

        // var devicePixelRatio = window.devicePixelRatio;

        // canvas.width = size.width * devicePixelRatio;
        // canvas.height = size.height * devicePixelRatio;
        // canvas.getContext('2d').scale(devicePixelRatio, devicePixelRatio);

        // canvas.style.width = size.width + "px";
        // canvas.style.height = size.height + "px";



        let size = this._map.getSize();
        let canvas = this.canvas;
        let pixelRatio = 1;

        if (this.context == 'webgl') {
            pixelRatio = 1;
        } else {
            pixelRatio = (function(context) {
                    let backingStore = context.backingStorePixelRatio ||
                                context.webkitBackingStorePixelRatio ||
                                context.mozBackingStorePixelRatio ||
                                context.msBackingStorePixelRatio ||
                                context.oBackingStorePixelRatio ||
                                context.backingStorePixelRatio || 1;

                    return (window.devicePixelRatio || 1) / backingStore;
                })(canvas.getContext('2d'));
        }

        canvas.width = size.width * pixelRatio;
        canvas.height = size.height * pixelRatio;
        canvas.style.width = size.width + "px";
        canvas.style.height = size.height + "px";
    }

    CanvasLayer.prototype.draw = function(){
        if (!this._lastDrawTime || new Date() - this._lastDrawTime > 10) {
            this._draw();
        }
        this._lastDrawTime = new Date();
    }

    CanvasLayer.prototype._draw = function(){
        var map = this._map;
        var size = map.getSize();
        var center = map.getCenter();
        if (center) {
            var pixel = map.pointToOverlayPixel(center);
            this.canvas.style.left = pixel.x - size.width / 2 + 'px';
            this.canvas.style.top = pixel.y - size.height / 2 + 'px';
            this.dispatchEvent('draw');
            this.options.update && this.options.update.call(this);
        }
    }

    CanvasLayer.prototype.getContainer = function(){
        return this.canvas;
    }

    CanvasLayer.prototype.show = function(){
        if (!this.canvas) {
            this._map.addOverlay(this);
        }
        this.canvas.style.display = "block";
    }

    CanvasLayer.prototype.hide = function(){
        this.canvas.style.display = "none";
        //this._map.removeOverlay(this);
    }

    CanvasLayer.prototype.setZIndex = function(zIndex){
        this.canvas.style.zIndex = zIndex;
    }

    CanvasLayer.prototype.getZIndex = function(){
        return this.zIndex;
    }

    /**
     * 开启鼠标到地图边缘，自动平移地图
     */
    CanvasLayer.prototype.enableEdgeMove = function() {
        this._enableEdgeMove = true;
    }

    /**
     * 关闭鼠标到地图边缘，自动平移地图
     */
    CanvasLayer.prototype.disableEdgeMove = function() {
        clearInterval(this._edgeMoveTimer);
        this._enableEdgeMove = false;
    }


    /**
     * 绑定事件,派发自定义事件
     */
    CanvasLayer.prototype._bind = function() {

        var me = this,
            map = this._map,
            container = this.getContainer(),
            lastMousedownXY = null,
            lastClickXY = null;

        /**
         * 根据event对象获取鼠标的xy坐标对象
         * @param {Event}
         * @return {Object} {x:e.x, y:e.y}
         */
        var getXYbyEvent = function(e){
            return {
                x : e.clientX,
                y : e.clientY
            }
        };

        var domEvent = function(e) {
            var type = e.type;
                e = baidu.getEvent(e);
                var point = me.getDrawPoint(e); //当前鼠标所在点的地理坐标

            var dispatchEvent = function(type) {
                e.point = point;
                me.dispatchEvent(e);
            }

            if (type == "mousedown") {
                lastMousedownXY = getXYbyEvent(e);
            }

            var nowXY = getXYbyEvent(e);
            //click经过一些特殊处理派发，其他同事件按正常的dom事件派发
            if (type == "click") {
                //鼠标点击过程不进行移动才派发click和dblclick
                if (Math.abs(nowXY.x - lastMousedownXY.x) < 5 && Math.abs(nowXY.y - lastMousedownXY.y) < 5 ) {
                    if (!lastClickXY || !(Math.abs(nowXY.x - lastClickXY.x) < 5 && Math.abs(nowXY.y - lastClickXY.y) < 5)) {
                        dispatchEvent('click');
                        lastClickXY = getXYbyEvent(e);
                    } else {
                        lastClickXY = null;
                    }
                }
            } else {
                dispatchEvent(type);
            }
        }

        /**
         * 将事件都遮罩层的事件都绑定到domEvent来处理
         */
        var events = ['click', 'mousedown', 'mousemove', 'mouseup', 'dblclick'],
            index = events.length;
        while (index--) {
            baidu.on(container, events[index], domEvent);
        }

        //鼠标移动过程中，到地图边缘后自动平移地图
        baidu.on(container, 'mousemove', function(e) {
            if (me._enableEdgeMove) {
                me.mousemoveAction(e);
            }
        });
    };

    //鼠标移动过程中，到地图边缘后自动平移地图
    CanvasLayer.prototype.mousemoveAction = function(e) {
        function getClientPosition(e) {
            var clientX = e.clientX,
                clientY = e.clientY;
            if (e.changedTouches) {
                clientX = e.changedTouches[0].clientX;
                clientY = e.changedTouches[0].clientY;
            }
            return new BMap.Pixel(clientX, clientY);
        }

        var map       = this._map,
            me        = this,
            pixel     = map.pointToPixel(this.getDrawPoint(e)),
            clientPos = getClientPosition(e),
            offsetX   = clientPos.x - pixel.x,
            offsetY   = clientPos.y - pixel.y;
        pixel = new BMap.Pixel((clientPos.x - offsetX), (clientPos.y - offsetY));
        this._draggingMovePixel = pixel;
        var point = map.pixelToPoint(pixel),
            eventObj = {
                pixel: pixel,
                point: point
            };
        // 拖拽到地图边缘移动地图
        this._panByX = this._panByY = 0;
        if (pixel.x <= 20 || pixel.x >= map.width - 20
            || pixel.y <= 50 || pixel.y >= map.height - 10) {
            if (pixel.x <= 20) {
                this._panByX = 8;
            } else if (pixel.x >= map.width - 20) {
                this._panByX = -8;
            }
            if (pixel.y <= 50) {
                this._panByY = 8;
            } else if (pixel.y >= map.height - 10) {
                this._panByY = -8;
            }
            if (!this._edgeMoveTimer) {
                this._edgeMoveTimer = setInterval(function(){
                    map.panBy(me._panByX, me._panByY, {"noAnimation": true});
                }, 30);
            }
        } else {
            if (this._edgeMoveTimer) {
                clearInterval(this._edgeMoveTimer);
                this._edgeMoveTimer = null;
            }
        }
    };
    /**
     * 获取当前绘制点的地理坐标
     *
     * @param {Event} e e对象
     * @return Point对象的位置信息
     */
    CanvasLayer.prototype.getDrawPoint = function(e) {
        
        var map = this._map,
        trigger = baidu.getTarget(e),
        x = e.offsetX || e.layerX || 0,
        y = e.offsetY || e.layerY || 0;
        if (trigger.nodeType != 1) trigger = trigger.parentNode;
        while (trigger && trigger != map.getContainer()) {
            if (!(trigger.clientWidth == 0 &&
                trigger.clientHeight == 0 &&
                trigger.offsetParent && trigger.offsetParent.nodeName == 'TD')) {
                x += trigger.offsetLeft || 0;
                y += trigger.offsetTop || 0;
            }
            trigger = trigger.offsetParent;
        }
        var pixel = new BMap.Pixel(x, y);
        var point = map.pixelToPoint(pixel);
        return point;

    }


}

export default CanvasLayer;