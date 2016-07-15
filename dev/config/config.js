/**
 * @file 工具参数配置
 */

import baidu from '../modules/baidu_event';

var styleOptions = {
    strokeColor: "red",    //边线颜色。
    fillColor: "rgba(255,0,0,0.5)",      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3       //边线的宽度，以像素为单位。
}

const BMAP_DRAWING_POLYLINE  = "polyline",   // 鼠标画线模式
    BMAP_DRAWING_RECTANGLE = "rectangle",  // 鼠标画矩形模式
    BMAP_DRAWING_POLYGON   = "polygon";    // 鼠标画多边形模式

class Config {
    constructor(param) {
        this.config = {
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            offset: new BMap.Size(5, 5),
            polygonOptions: styleOptions, //线的样式
            polylineOptions: styleOptions, //多边形的样式
            rectangleOptions: styleOptions, //矩形的样式
            enableDrawingTool: true,
            enableCalculate: false,
            controlButton: 'left',
            drawingModes: [
                BMAP_DRAWING_POLYGON,
                BMAP_DRAWING_RECTANGLE
            ]
        }
        this.mergeData(param);
    }

    getConfig() {
        return this.config;
    }

    mergeData(param) {
        let self = this;
        if (typeof param != 'object') {
            return this.config;
        }
        this.config =  baidu.extend(this.config, param);

        this.config['controlButton'] = param['controlButton'] == 'right' ? 'right' : 'left';
        // 更新样式
        var styles = ['polylineOptions', 'polygonOptions', 'rectangleOptions'];
        styles.map((item) => {
            if (item in param) {
                self._mergeStyle(item, param[item]);
            }
        });
        // 是否显示画区工具
        let enableDrawingTool = 'enableDrawingTool';
        if (enableDrawingTool in param) {
            this.config[enableDrawingTool] = param[enableDrawingTool];
        }
    }

    _mergeStyle(keyname, newConf) {
        let style = this.config[keyname];
        this.config[keyname] = baidu.extend(style, newConf)
    }


}

export default Config;