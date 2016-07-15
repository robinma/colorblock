/**
 * @file 地图画布
 * @author mazhongjie
 */

import Canvaslayer from './modules/canvaslayer.js';
import Events from './modules/events';
import globalStore from './store/globalStore';

class DrawLayer {
    constructor (map, config) {
        let self = this;
        self.map = map;
        self.config = config;

        self.canvasLayer = new Canvaslayer({
            map: map,
            update: function () {
                self._updateMap.apply(self);
            }
        });
        let ctx = self.ctx = self.canvasLayer.canvas.getContext("2d");
        if (!ctx) {
            return;
        }
        Events.mixTo(self);
        self._listenStore();
    }

    _listenStore() {
        let self = this;
        globalStore.listen('ready',function(type, param) {
            if (type === 'drawingCache') {
                self._updateMap();
            } else if (type === 'drawComplete') {
                self._updateMap();
            }
        });
    }

    // 更更绘图
    _updateMap() {
        if (this.canvasLayer) {
            this._drawCtx();
        }
    }
    /**
     * 开始绘画整个ctx 
     */
    _drawCtx() {
        this._clearRect();
        this._drawCacheData();
        this._drawPolygonData();
        this._drawInterPoints();
    }

    _clearRect() {
        let ctx = this.ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // 组织临时数据
    _drawCacheData() {
        let self = this;
        let cacheData = globalStore.getCacheData();
        let blockData = globalStore.getBlockData();
        let drawingType = globalStore.getDrawingType();
        let dataPix;
        if (cacheData.length == 0 || !cacheData) {
            return;
        }

        dataPix = cacheData.map((item, index) => {
                return self._lnglatToPix(item);
            });
        this._drawDispatcher(drawingType, dataPix, blockData.length);
    }
    // 组织存储数据
    _drawBlockData() {
        let self = this;
        let blockData = globalStore.getBlockData();
        if (blockData.length === 0 || !blockData) {
            return;
        }
        blockData.map((item, index) => {
            let pixels = item.data.map((pitem, pindex) => {
                return self._lnglatToPix(pitem);
            });
            self._drawDispatcher(item.drawingType, pixels);
        });
    }

    _drawPolygonData() {
        let self = this;
        let blockData = globalStore.getBlockData();
        if (blockData.length === 0 || !blockData) {
            return;
        }
        blockData.map((item, index) => {
            item.polygons.map(pitem => {
                let pixels = pitem.map(spitem => {
                    return self._lnglatToPix(spitem);
                });
                self._drawDispatcher(item.drawingType, pixels, index);
            });
        });
        // blockData.map((item, index) => {
        //     let pixels = item.data.map((pitem, pindex) => {
        //         return self._lnglatToPix(pitem);
        //     });
        //     self._drawDispatcher(item.drawingType, pixels);
        // });


    }
    /**
     * 画交叉点
     */
    _drawInterPoints() {
        let self = this;
        let interPoints = globalStore.getInterPoints();
        
        if (interPoints.length === 0) {
            return;
        }

        let pixels = interPoints.map(item => {
            return self._lnglatToPix(item);
        });

        self._drawArcPoints(pixels);
    }

    // 经纬度转换为像素
    _lnglatToPix(point) {
        let map = this.map;
        let pixel = map.pointToPixel(point);
        return pixel;
    }
    /**
     * 分发器
     */
    _drawDispatcher(type, data, index) {
        let self = this;
        switch(type) {
            case 'rectangle':
                // self.drawRectangle(data, self.config.rectangleOptions);
                self.drawPolygon(data, self._drawStyle(index));
                break;
            case 'polygon':
                self.drawPolygon(data, self._drawStyle(index));
                break;
        }
    }

    _drawStyle(index) {
        let self = this;
        let config = self.config.polygonOptions;
        let fillColor = config.fillColor;
        let strokeColor = config.strokeColor;
        let strokeWeight = config.strokeWeight;
        return {
            fillColor: typeof fillColor === 'string' ? fillColor : fillColor[index%fillColor.length],
            strokeColor: typeof strokeColor === 'string' ? strokeColor : strokeColor[index%strokeColor.length],
            strokeWeight: strokeWeight
        }
    }

    // 画矩形
    drawRectangle(data, styleOpts) {
        let self = this;
        let map = self.map;
        let ctx = self.ctx;
        let startPoint = data[0];
        let endPoint = data[2];
        let width = endPoint.x - startPoint.x;
        let height = endPoint.y - startPoint.y;
        ctx.beginPath();
        self.setPixelRatio(() => {
            ctx.rect(startPoint.x, startPoint.y, width, height);
            ctx.fillStyle = styleOpts.fillColor;
            ctx.fill();
            ctx.strokeStyle = styleOpts.strokeColor;
            ctx.lineWidth = styleOpts.strokeWeight;
            ctx.stroke();
            ctx.closePath();
        });
    }

    // 画多边形
    drawPolygon(data, styleOpts, isPolygon=true) {
        let self = this;
        let map = this.map;
        let ctx = self.ctx;
        ctx.beginPath();
        self.setPixelRatio(() => {
            data.map((item, index) => {
                if (index === 0) {
                    ctx.moveTo(item.x, item.y);
                } else {
                    ctx.lineTo(item.x, item.y);
                }
            });

            ctx.fillStyle = styleOpts.fillColor;
            ctx.fill();
            ctx.strokeStyle = styleOpts.strokeColor;
            ctx.lineWidth = styleOpts.strokeWeight;
            ctx.stroke();
            ctx.closePath();
        });
    }


    // 画线
    drawPolyline(data, styleOpts, isPolygon=false) {
        this.drawPolygon(data, styleOpts, isPolygon);
    }

    getPixelRatio () {
        let context = this.ctx;
        let backingStore = context.backingStorePixelRatio ||
                            context.webkitBackingStorePixelRatio ||
                            context.mozBackingStorePixelRatio ||
                            context.msBackingStorePixelRatio ||
                            context.oBackingStorePixelRatio ||
                            context.backingStorePixelRatio || 1;

        return (window.devicePixelRatio || 1) / backingStore;
    }

    setPixelRatio (fn) {
        // fn && fn();
        // return false;
        let ctx = this.ctx;
        let pixelRatio = this.getPixelRatio();
        ctx.save();
        ctx.scale(pixelRatio, pixelRatio);
        fn && fn();
        ctx.restore();
    }

    _drawArcPoints(pixels) {
        this._storkArc(pixels);
        this._fillArc(pixels);
    }

    /**
     * 画圆边框
     */
    _storkArc(pixels, radius = 3, color = '#ffff00', lineWidth=1) {
        let ctx = this.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        this.setPixelRatio(() => {
            pixels.map((pixel) => {
                ctx.beginPath();
                ctx.arc(pixel.x, pixel.y, radius, 0, Math.PI * 2);
                ctx.closePath();
                ctx.stroke();
            });
        });
    }

    /**
     * 画圆
     */
    _fillArc(pixels, radis = 3, color = '#ffffff') {
        let ctx = this.ctx;
        ctx.fillStyle = color;
        this.setPixelRatio(function () {
            pixels.map(function (item) {
                ctx.beginPath();
                ctx.arc(item.x, item.y, radis, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            });
        });
    }



};

export default DrawLayer;