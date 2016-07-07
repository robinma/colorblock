/**
 * @file 绘制工具面板，自定义控件
 */

import baidu from './modules/baidu_event';

/**
 * 绘制工具面板，自定义控件
 */
function DrawingTool(drawingManager, drawingToolOptions) {
    this.drawingManager = drawingManager;

    drawingToolOptions = this.drawingToolOptions = drawingToolOptions || {};
    // 默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
    this.defaultOffset = new BMap.Size(10, 10);

    //默认所有工具栏都显示
    this.defaultDrawingModes = [
        BMAP_DRAWING_MARKER,
        BMAP_DRAWING_CIRCLE,
        BMAP_DRAWING_POLYLINE,
        BMAP_DRAWING_POLYGON,
        BMAP_DRAWING_RECTANGLE
    ];
    //工具栏可显示的绘制模式
    if (drawingToolOptions.drawingModes) {
        this.drawingModes = drawingToolOptions.drawingModes;
    } else {
        this.drawingModes = this.defaultDrawingModes
    }

    //用户设置停靠位置和偏移量
    if (drawingToolOptions.anchor) {
        this.setAnchor(drawingToolOptions.anchor);
    }
    if (drawingToolOptions.offset) {
        this.setOffset(drawingToolOptions.offset);
    }
}

// 通过JavaScript的prototype属性继承于BMap.Control
DrawingTool.prototype = new BMap.Control();

// 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
// 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
DrawingTool.prototype.initialize = function (map) {
    // 创建一个DOM元素
    var container = this.container = document.createElement("div");
    container.className = "BMapLib_Drawing";
    //用来设置外层边框阴影
    var panel = this.panel = document.createElement("div");
    panel.className = "BMapLib_Drawing_panel";
    if (this.drawingToolOptions && this.drawingToolOptions.scale) {
        this._setScale(this.drawingToolOptions.scale);
    }
    container.appendChild(panel);
    // 添加内容
    panel.innerHTML = this._generalHtml();
    //绑定事件
    this._bind(panel);
    // 添加DOM元素到地图中
    map.getContainer().appendChild(container);
    // 将DOM元素返回
    return container;
}

//生成工具栏的html元素
DrawingTool.prototype._generalHtml = function (map) {

    //鼠标经过工具栏上的提示信息
    var tips = {};
    tips["hander"] = "拖动地图";
    tips[BMAP_DRAWING_MARKER] = "画点";
    tips[BMAP_DRAWING_CIRCLE] = "画圆";
    tips[BMAP_DRAWING_POLYLINE] = "画折线";
    tips[BMAP_DRAWING_POLYGON] = "画多边形";
    tips[BMAP_DRAWING_RECTANGLE] = "画矩形";

    var getItem = function (className, drawingType) {
        return '<a class="' + className + '" drawingType="' + drawingType + '" href="javascript:void(0)" title="' + tips[drawingType] + '" onfocus="this.blur()"></a>';
    }

    var html = [];
    html.push(getItem("BMapLib_box BMapLib_hander", "hander"));
    for (var i = 0, len = this.drawingModes.length; i < len; i++) {
        var classStr = 'BMapLib_box BMapLib_' + this.drawingModes[i];
        if (i == len - 1) {
            classStr += ' BMapLib_last';
        }
        html.push(getItem(classStr, this.drawingModes[i]));
    }
    return html.join('');
}

/**
 * 设置工具栏的缩放比例
 */
DrawingTool.prototype._setScale = function (scale) {
    var width = 390,
        height = 50,
        ml = -parseInt((width - width * scale) / 2, 10),
        mt = -parseInt((height - height * scale) / 2, 10);
    this.container.style.cssText = [
        "-moz-transform: scale(" + scale + ");",
        "-o-transform: scale(" + scale + ");",
        "-webkit-transform: scale(" + scale + ");",
        "transform: scale(" + scale + ");",
        "margin-left:" + ml + "px;",
        "margin-top:" + mt + "px;",
        "*margin-left:0px;", //ie6、7
        "*margin-top:0px;",  //ie6、7
        "margin-left:0px\\0;", //ie8
        "margin-top:0px\\0;",  //ie8
        //ie下使用滤镜
        "filter: progid:DXImageTransform.Microsoft.Matrix(",
        "M11=" + scale + ",",
        "M12=0,",
        "M21=0,",
        "M22=" + scale + ",",
        "SizingMethod='auto expand');"
    ].join('');
}

//绑定工具栏的事件
DrawingTool.prototype._bind = function (panel) {
    var me = this;
    baidu.on(this.panel, 'click', function (e) {
        var target = baidu.getTarget(e);
        var drawingType = target.getAttribute('drawingType');
        me.setStyleByDrawingMode(drawingType);
        me._bindEventByDraingMode(drawingType);
    });
}

//设置工具栏当前选中的项样式
DrawingTool.prototype.setStyleByDrawingMode = function (drawingType) {
    if (!drawingType) {
        return;
    }
    var boxs = this.panel.getElementsByTagName("a");
    for (var i = 0, len = boxs.length; i < len; i++) {
        var box = boxs[i];
        if (box.getAttribute('drawingType') == drawingType) {
            var classStr = "BMapLib_box BMapLib_" + drawingType + "_hover";
            if (i == len - 1) {
                classStr += " BMapLib_last";
            }
            box.className = classStr;
        } else {
            box.className = box.className.replace(/_hover/, "");
        }
    }
}

//设置工具栏当前选中的项样式
DrawingTool.prototype._bindEventByDraingMode = function (drawingType) {
    var me = this;
    var drawingManager = this.drawingManager;
    //点在拖拽地图的按钮上
    if (drawingType == "hander") {
        drawingManager.close();
        drawingManager._map.enableDoubleClickZoom();
    } else {
        drawingManager.setDrawingMode(drawingType);
        drawingManager.open();
        drawingManager._map.disableDoubleClickZoom();
    }
}

export default DrawingTool;