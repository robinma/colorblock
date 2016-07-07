    /**
     * 创建遮罩对象
     */
    function Mask(){
        /**
         * 鼠标到地图边缘的时候是否自动平移地图
         */
        this._enableEdgeMove = false;
    }

    Mask.prototype = new BMap.Overlay();

    /**
     * 这里不使用api中的自定义事件，是为了更灵活使用
     */
    Mask.prototype.dispatchEvent = baidu.lang.Class.prototype.dispatchEvent;
    Mask.prototype.addEventListener = baidu.lang.Class.prototype.addEventListener;
    Mask.prototype.removeEventListener = baidu.lang.Class.prototype.removeEventListener;

    Mask.prototype.initialize = function(map){
        var me = this;
        this._map = map;
        var div = this.container = document.createElement("div");
        var size = this._map.getSize();
        div.style.cssText = "position:absolute;background:url(about:blank);cursor:crosshair;width:" + size.width + "px;height:" + size.height + "px";
        this._map.addEventListener('resize', function(e) {
            me._adjustSize(e.size);
        });
        this._map.getPanes().floatPane.appendChild(div);
        this._bind();
        return div; 
    };

    Mask.prototype.draw = function() {
        var map   = this._map,
            point = map.pixelToPoint(new BMap.Pixel(0, 0)),
            pixel = map.pointToOverlayPixel(point);
        this.container.style.left = pixel.x + "px";
        this.container.style.top  = pixel.y + "px"; 
    };

    /**
     * 开启鼠标到地图边缘，自动平移地图
     */
    Mask.prototype.enableEdgeMove = function() {
        this._enableEdgeMove = true;
    }

    /**
     * 关闭鼠标到地图边缘，自动平移地图
     */
    Mask.prototype.disableEdgeMove = function() {
        clearInterval(this._edgeMoveTimer);
        this._enableEdgeMove = false;
    }

    /**
     * 绑定事件,派发自定义事件
     */
    Mask.prototype._bind = function() {

        var me = this,
            map = this._map,
            container = this.container,
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
                point = me.getDrawPoint(e); //当前鼠标所在点的地理坐标

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
    Mask.prototype.mousemoveAction = function(e) {
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
    }

    /*
     * 调整大小
     * @param {Size}
     */
    Mask.prototype._adjustSize = function(size) {
        this.container.style.width  = size.width + 'px';
        this.container.style.height = size.height + 'px';
    };

    /**
     * 获取当前绘制点的地理坐标
     *
     * @param {Event} e e对象
     * @return Point对象的位置信息
     */
    Mask.prototype.getDrawPoint = function(e) {
        
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