(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 声明baidu包
 */
var baidu$1 = baidu$1 || { guid: "$BAIDU$" };

(function () {
    // 一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
    window[baidu$1.guid] = {};

    /**
     * 将源对象的所有属性拷贝到目标对象中
     * @name baidu.extend
     * @function
     * @grammar baidu.extend(target, source)
     * @param {Object} target 目标对象
     * @param {Object} source 源对象
     * @returns {Object} 目标对象
     */
    baidu$1.extend = function (target, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }
        return target;
    };

    /**
     * @ignore
     * @namespace
     * @baidu.lang 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
     * @property guid 对象的唯一标识
     */
    baidu$1.lang = baidu$1.lang || {};

    /**
     * 返回一个当前页面的唯一标识字符串。
     * @function
     * @grammar baidu.lang.guid()
     * @returns {String} 当前页面的唯一标识字符串
     */
    baidu$1.lang.guid = function () {
        return "TANGRAM__" + (window[baidu$1.guid]._counter++).toString(36);
    };

    window[baidu$1.guid]._counter = window[baidu$1.guid]._counter || 1;

    /**
     * 所有类的实例的容器
     * key为每个实例的guid
     */
    window[baidu$1.guid]._instances = window[baidu$1.guid]._instances || {};

    /**
     * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
     * @function
     * @name baidu.lang.Class
     * @grammar baidu.lang.Class(guid)
     * @param {string} guid 对象的唯一标识
     * @meta standard
     * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。
     * guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>
     * baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
     */
    baidu$1.lang.Class = function (guid) {
        this.guid = guid || baidu$1.lang.guid();
        window[baidu$1.guid]._instances[this.guid] = this;
    };

    window[baidu$1.guid]._instances = window[baidu$1.guid]._instances || {};

    /**
     * 判断目标参数是否string类型或String对象
     * @name baidu.lang.isString
     * @function
     * @grammar baidu.lang.isString(source)
     * @param {Any} source 目标参数
     * @shortcut isString
     * @meta standard
     *             
     * @returns {boolean} 类型判断结果
     */
    baidu$1.lang.isString = function (source) {
        return '[object String]' == Object.prototype.toString.call(source);
    };

    /**
     * 判断目标参数是否为function或Function实例
     * @name baidu.lang.isFunction
     * @function
     * @grammar baidu.lang.isFunction(source)
     * @param {Any} source 目标参数
     * @returns {boolean} 类型判断结果
     */
    baidu$1.lang.isFunction = function (source) {
        return '[object Function]' == Object.prototype.toString.call(source);
    };

    /**
     * 重载了默认的toString方法，使得返回信息更加准确一些。
     * @return {string} 对象的String表示形式
     */
    baidu$1.lang.Class.prototype.toString = function () {
        return "[object " + (this._className || "Object") + "]";
    };

    /**
     * 释放对象所持有的资源，主要是自定义事件。
     * @name dispose
     * @grammar obj.dispose()
     */
    baidu$1.lang.Class.prototype.dispose = function () {
        delete window[baidu$1.guid]._instances[this.guid];
        for (var property in this) {
            if (!baidu$1.lang.isFunction(this[property])) {
                delete this[property];
            }
        }
        this.disposed = true;
    };

    /**
     * 自定义的事件对象。
     * @function
     * @name baidu.lang.Event
     * @grammar baidu.lang.Event(type[, target])
     * @param {string} type  事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
     * @param {Object} [target]触发事件的对象
     * @meta standard
     * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
     * @see baidu.lang.Class
     */
    baidu$1.lang.Event = function (type, target) {
        this.type = type;
        this.returnValue = true;
        this.target = target || null;
        this.currentTarget = null;
    };

    /**
     * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
     * @grammar obj.addEventListener(type, handler[, key])
     * @param   {string}   type         自定义事件的名称
     * @param   {Function} handler      自定义事件被触发时应该调用的回调函数
     * @param   {string}   [key]        为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
     * @remark  事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
     */
    baidu$1.lang.Class.prototype.addEventListener = function (type, handler, key) {
        if (!baidu$1.lang.isFunction(handler)) {
            return;
        }
        !this.__listeners && (this.__listeners = {});
        var t = this.__listeners,
            id;
        if (typeof key == "string" && key) {
            if (/[^\w\-]/.test(key)) {
                throw "nonstandard key:" + key;
            } else {
                handler.hashCode = key;
                id = key;
            }
        }
        type.indexOf("on") != 0 && (type = "on" + type);
        _typeof(t[type]) != "object" && (t[type] = {});
        id = id || baidu$1.lang.guid();
        handler.hashCode = id;
        t[type][id] = handler;
    };

    /**
     * 移除对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
     * @grammar obj.removeEventListener(type, handler)
     * @param {string}   type     事件类型
     * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
     * @remark  如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
     */
    baidu$1.lang.Class.prototype.removeEventListener = function (type, handler) {
        if (baidu$1.lang.isFunction(handler)) {
            handler = handler.hashCode;
        } else if (!baidu$1.lang.isString(handler)) {
            return;
        }
        !this.__listeners && (this.__listeners = {});
        type.indexOf("on") != 0 && (type = "on" + type);
        var t = this.__listeners;
        if (!t[type]) {
            return;
        }
        t[type][handler] && delete t[type][handler];
    };

    /**
     * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
     * @grammar obj.dispatchEvent(event, options)
     * @param {baidu.lang.Event|String} event   Event对象，或事件名称(1.1.1起支持)
     * @param {Object} options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
     * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。
     * 例如：<br>
     * myobj.onMyEvent = function(){}<br>
     * myobj.addEventListener("onMyEvent", function(){});
     */
    baidu$1.lang.Class.prototype.dispatchEvent = function (event, options) {
        if (baidu$1.lang.isString(event)) {
            event = new baidu$1.lang.Event(event);
        }
        !this.__listeners && (this.__listeners = {});
        options = options || {};
        for (var i in options) {
            event[i] = options[i];
        }
        var i,
            t = this.__listeners,
            p = event.type;
        event.target = event.target || this;
        event.currentTarget = this;
        p.indexOf("on") != 0 && (p = "on" + p);
        baidu$1.lang.isFunction(this[p]) && this[p].apply(this, arguments);
        if (_typeof(t[p]) == "object") {
            for (i in t[p]) {
                t[p][i].apply(this, arguments);
            }
        }
        return event.returnValue;
    };

    /**
     * 为类型构造器建立继承关系
     * @name baidu.lang.inherits
     * @function
     * @grammar baidu.lang.inherits(subClass, superClass[, className])
     * @param {Function} subClass 子类构造器
     * @param {Function} superClass 父类构造器
     * @param {string} className 类名标识
     * @remark 使subClass继承superClass的prototype，
     * 因此subClass的实例能够使用superClass的prototype中定义的所有属性和方法。<br>
     * 这个函数实际上是建立了subClass和superClass的原型链集成，并对subClass进行了constructor修正。<br>
     * <strong>注意：如果要继承构造函数，需要在subClass里面call一下，具体见下面的demo例子</strong>
     * @shortcut inherits
     * @meta standard
     * @see baidu.lang.Class
     */
    baidu$1.lang.inherits = function (subClass, superClass, className) {
        var key,
            proto,
            selfProps = subClass.prototype,
            clazz = new Function();
        clazz.prototype = superClass.prototype;
        proto = subClass.prototype = new clazz();
        for (key in selfProps) {
            proto[key] = selfProps[key];
        }
        subClass.prototype.constructor = subClass;
        subClass.superClass = superClass.prototype;

        if ("string" == typeof className) {
            proto._className = className;
        }
    };

    /**
     * @ignore
     * @namespace baidu.dom 操作dom的方法。
     */
    baidu$1.dom = baidu$1.dom || {};

    /**
     * 从文档中获取指定的DOM元素
     * 
     * @param {string|HTMLElement} id 元素的id或DOM元素
     * @meta standard
     * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
     */
    baidu$1._g = baidu$1.dom._g = function (id) {
        if (baidu$1.lang.isString(id)) {
            return document.getElementById(id);
        }
        return id;
    };

    /**
     * 从文档中获取指定的DOM元素
     * @name baidu.dom.g
     * @function
     * @grammar baidu.dom.g(id)
     * @param {string|HTMLElement} id 元素的id或DOM元素
     * @meta standard
     *             
     * @returns {HTMLElement|null} 获取的元素，查找不到时返回null,如果参数不合法，直接返回参数
     */
    baidu$1.g = baidu$1.dom.g = function (id) {
        if ('string' == typeof id || id instanceof String) {
            return document.getElementById(id);
        } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
            return id;
        }
        return null;
    };

    /**
     * 在目标元素的指定位置插入HTML代码
     * @name baidu.dom.insertHTML
     * @function
     * @grammar baidu.dom.insertHTML(element, position, html)
     * @param {HTMLElement|string} element 目标元素或目标元素的id
     * @param {string} position 插入html的位置信息，取值为beforeBegin,afterBegin,beforeEnd,afterEnd
     * @param {string} html 要插入的html
     * @remark
     * 
     * 对于position参数，大小写不敏感<br>
     * 参数的意思：beforeBegin&lt;span&gt;afterBegin   this is span! beforeEnd&lt;/span&gt; afterEnd <br />
     * 此外，如果使用本函数插入带有script标签的HTML字符串，script标签对应的脚本将不会被执行。
     * 
     * @shortcut insertHTML
     * @meta standard
     *             
     * @returns {HTMLElement} 目标元素
     */
    baidu$1.insertHTML = baidu$1.dom.insertHTML = function (element, position, html) {
        element = baidu$1.dom.g(element);
        var range, begin;

        if (element.insertAdjacentHTML) {
            element.insertAdjacentHTML(position, html);
        } else {
            // 这里不做"undefined" != typeof(HTMLElement) && !window.opera判断，其它浏览器将出错？！
            // 但是其实做了判断，其它浏览器下等于这个函数就不能执行了
            range = element.ownerDocument.createRange();
            // FF下range的位置设置错误可能导致创建出来的fragment在插入dom树之后html结构乱掉
            // 改用range.insertNode来插入html, by wenyuxiang @ 2010-12-14.
            position = position.toUpperCase();
            if (position == 'AFTERBEGIN' || position == 'BEFOREEND') {
                range.selectNodeContents(element);
                range.collapse(position == 'AFTERBEGIN');
            } else {
                begin = position == 'BEFOREBEGIN';
                range[begin ? 'setStartBefore' : 'setEndAfter'](element);
                range.collapse(begin);
            }
            range.insertNode(range.createContextualFragment(html));
        }
        return element;
    };

    /**
     * 为目标元素添加className
     * @name baidu.dom.addClass
     * @function
     * @grammar baidu.dom.addClass(element, className)
     * @param {HTMLElement|string} element 目标元素或目标元素的id
     * @param {string} className 要添加的className，允许同时添加多个class，中间使用空白符分隔
     * @remark
     * 使用者应保证提供的className合法性，不应包含不合法字符，className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html。
     * @shortcut addClass
     * @meta standard
     *              
     * @returns {HTMLElement} 目标元素
     */
    baidu$1.ac = baidu$1.dom.addClass = function (element, className) {
        element = baidu$1.dom.g(element);
        var classArray = className.split(/\s+/),
            result = element.className,
            classMatch = " " + result + " ",
            i = 0,
            l = classArray.length;

        for (; i < l; i++) {
            if (classMatch.indexOf(" " + classArray[i] + " ") < 0) {
                result += (result ? ' ' : '') + classArray[i];
            }
        }

        element.className = result;
        return element;
    };

    /**
     * @ignore
     * @namespace baidu.event 屏蔽浏览器差异性的事件封装。
     * @property target     事件的触发元素
     * @property pageX      鼠标事件的鼠标x坐标
     * @property pageY      鼠标事件的鼠标y坐标
     * @property keyCode    键盘事件的键值
     */
    baidu$1.event = baidu$1.event || {};

    /**
     * 事件监听器的存储表
     * @private
     * @meta standard
     */
    baidu$1.event._listeners = baidu$1.event._listeners || [];

    /**
     * 为目标元素添加事件监听器
     * @name baidu.event.on
     * @function
     * @grammar baidu.event.on(element, type, listener)
     * @param {HTMLElement|string|window} element 目标元素或目标元素id
     * @param {string} type 事件类型
     * @param {Function} listener 需要添加的监听器
     * @remark
     *  1. 不支持跨浏览器的鼠标滚轮事件监听器添加<br>
     *  2. 改方法不为监听器灌入事件对象，以防止跨iframe事件挂载的事件对象获取失败            
     * @shortcut on
     * @meta standard
     * @see baidu.event.un
     *             
     * @returns {HTMLElement|window} 目标元素
     */
    baidu$1.on = baidu$1.event.on = function (element, type, listener) {
        type = type.replace(/^on/i, '');
        element = baidu$1._g(element);
        var realListener = function realListener(ev) {
            // 1. 这里不支持EventArgument,  原因是跨frame的事件挂载
            // 2. element是为了修正this
            listener.call(element, ev);
        },
            lis = baidu$1.event._listeners,
            filter = baidu$1.event._eventFilter,
            afterFilter,
            realType = type;
        type = type.toLowerCase();
        // filter过滤
        if (filter && filter[type]) {
            afterFilter = filter[type](element, type, realListener);
            realType = afterFilter.type;
            realListener = afterFilter.listener;
        }
        // 事件监听器挂载
        if (element.addEventListener) {
            element.addEventListener(realType, realListener, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + realType, realListener);
        }

        // 将监听器存储到数组中
        lis[lis.length] = [element, type, listener, realListener, realType];
        return element;
    };

    /**
     * 为目标元素移除事件监听器
     * @name baidu.event.un
     * @function
     * @grammar baidu.event.un(element, type, listener)
     * @param {HTMLElement|string|window} element 目标元素或目标元素id
     * @param {string} type 事件类型
     * @param {Function} listener 需要移除的监听器
     * @shortcut un
     * @meta standard
     *             
     * @returns {HTMLElement|window} 目标元素
     */
    baidu$1.un = baidu$1.event.un = function (element, type, listener) {
        element = baidu$1._g(element);
        type = type.replace(/^on/i, '').toLowerCase();

        var lis = baidu$1.event._listeners,
            len = lis.length,
            isRemoveAll = !listener,
            item,
            realType,
            realListener;

        //如果将listener的结构改成json
        //可以节省掉这个循环，优化性能
        //但是由于un的使用频率并不高，同时在listener不多的时候
        //遍历数组的性能消耗不会对代码产生影响
        //暂不考虑此优化
        while (len--) {
            item = lis[len];

            // listener存在时，移除element的所有以listener监听的type类型事件
            // listener不存在时，移除element的所有type类型事件
            if (item[1] === type && item[0] === element && (isRemoveAll || item[2] === listener)) {
                realType = item[4];
                realListener = item[3];
                if (element.removeEventListener) {
                    element.removeEventListener(realType, realListener, false);
                } else if (element.detachEvent) {
                    element.detachEvent('on' + realType, realListener);
                }
                lis.splice(len, 1);
            }
        }
        return element;
    };

    /**
     * 获取event事件,解决不同浏览器兼容问题
     * @param {Event}
     * @return {Event}
     */
    baidu$1.getEvent = baidu$1.event.getEvent = function (event) {
        return window.event || event;
    };

    /**
     * 获取event.target,解决不同浏览器兼容问题
     * @param {Event}
     * @return {Target}
     */
    baidu$1.getTarget = baidu$1.event.getTarget = function (event) {
        var event = baidu$1.getEvent(event);
        return event.target || event.srcElement;
    };

    /**
     * 阻止事件的默认行为
     * @name baidu.event.preventDefault
     * @function
     * @grammar baidu.event.preventDefault(event)
     * @param {Event} event 事件对象
     * @meta standard
     */
    baidu$1.preventDefault = baidu$1.event.preventDefault = function (event) {
        var event = baidu$1.getEvent(event);
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };

    /**
     * 停止事件冒泡传播
     * @param {Event}
     */
    baidu$1.stopBubble = baidu$1.event.stopBubble = function (event) {
        event = baidu$1.getEvent(event);
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    };

    baidu$1.browser = baidu$1.browser || {};

    if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
        //IE 8下，以documentMode为准
        //在百度模板中，可能会有$，防止冲突，将$1 写成 \x241
        /**
         * 判断是否为ie浏览器
         * @property ie ie版本号
         * @grammar baidu.browser.ie
         * @meta standard
         * @shortcut ie
         * @see baidu.browser.firefox,baidu.browser.safari,baidu.browser.opera,baidu.browser.chrome,baidu.browser.maxthon 
         */
        baidu$1.browser.ie = baidu$1.ie = document.documentMode || +RegExp['\x241'];
    }
})();

function CanvasLayer(options) {
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
CanvasLayer.prototype.dispatchEvent = baidu$1.lang.Class.prototype.dispatchEvent;
CanvasLayer.prototype.addEventListener = baidu$1.lang.Class.prototype.addEventListener;
CanvasLayer.prototype.removeEventListener = baidu$1.lang.Class.prototype.removeEventListener;

if (window.BMap) {
    CanvasLayer.prototype = new BMap.Overlay();
    CanvasLayer.prototype.initialize = function (map) {
        this._map = map;
        var canvas = this.canvas = document.createElement("canvas");
        canvas.style.cssText = "position:absolute;" + "left:0;" + "top:0;" + "z-index:" + this.zIndex + ";";
        this.adjustSize();
        map.getPanes()[this.paneName].appendChild(canvas);
        var that = this;
        map.addEventListener('resize', function () {
            that.adjustSize();
            that._draw();
        });
        this._bind();
        return this.canvas;
    };

    CanvasLayer.prototype.adjustSize = function () {
        // var size = this._map.getSize();
        // var canvas = this.canvas;

        // var devicePixelRatio = window.devicePixelRatio;

        // canvas.width = size.width * devicePixelRatio;
        // canvas.height = size.height * devicePixelRatio;
        // canvas.getContext('2d').scale(devicePixelRatio, devicePixelRatio);

        // canvas.style.width = size.width + "px";
        // canvas.style.height = size.height + "px";

        var size = this._map.getSize();
        var canvas = this.canvas;
        var pixelRatio = 1;

        if (this.context == 'webgl') {
            pixelRatio = 1;
        } else {
            pixelRatio = function (context) {
                var backingStore = context.backingStorePixelRatio || context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;

                return (window.devicePixelRatio || 1) / backingStore;
            }(canvas.getContext('2d'));
        }

        canvas.width = size.width * pixelRatio;
        canvas.height = size.height * pixelRatio;
        canvas.style.width = size.width + "px";
        canvas.style.height = size.height + "px";
    };

    CanvasLayer.prototype.draw = function () {
        if (!this._lastDrawTime || new Date() - this._lastDrawTime > 10) {
            this._draw();
        }
        this._lastDrawTime = new Date();
    };

    CanvasLayer.prototype._draw = function () {
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
    };

    CanvasLayer.prototype.getContainer = function () {
        return this.canvas;
    };

    CanvasLayer.prototype.show = function () {
        if (!this.canvas) {
            this._map.addOverlay(this);
        }
        this.canvas.style.display = "block";
    };

    CanvasLayer.prototype.hide = function () {
        this.canvas.style.display = "none";
        //this._map.removeOverlay(this);
    };

    CanvasLayer.prototype.setZIndex = function (zIndex) {
        this.canvas.style.zIndex = zIndex;
    };

    CanvasLayer.prototype.getZIndex = function () {
        return this.zIndex;
    };

    /**
     * 开启鼠标到地图边缘，自动平移地图
     */
    CanvasLayer.prototype.enableEdgeMove = function () {
        this._enableEdgeMove = true;
    };

    /**
     * 关闭鼠标到地图边缘，自动平移地图
     */
    CanvasLayer.prototype.disableEdgeMove = function () {
        clearInterval(this._edgeMoveTimer);
        this._enableEdgeMove = false;
    };

    /**
     * 绑定事件,派发自定义事件
     */
    CanvasLayer.prototype._bind = function () {

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
        var getXYbyEvent = function getXYbyEvent(e) {
            return {
                x: e.clientX,
                y: e.clientY
            };
        };

        var domEvent = function domEvent(e) {
            var type = e.type;
            e = baidu$1.getEvent(e);
            var point = me.getDrawPoint(e); //当前鼠标所在点的地理坐标

            var dispatchEvent = function dispatchEvent(type) {
                e.point = point;
                me.dispatchEvent(e);
            };

            if (type == "mousedown") {
                lastMousedownXY = getXYbyEvent(e);
            }

            var nowXY = getXYbyEvent(e);
            //click经过一些特殊处理派发，其他同事件按正常的dom事件派发
            if (type == "click") {
                //鼠标点击过程不进行移动才派发click和dblclick
                if (Math.abs(nowXY.x - lastMousedownXY.x) < 5 && Math.abs(nowXY.y - lastMousedownXY.y) < 5) {
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
        };

        /**
         * 将事件都遮罩层的事件都绑定到domEvent来处理
         */
        var events = ['click', 'mousedown', 'mousemove', 'mouseup', 'dblclick'],
            index = events.length;
        while (index--) {
            baidu$1.on(container, events[index], domEvent);
        }

        //鼠标移动过程中，到地图边缘后自动平移地图
        baidu$1.on(container, 'mousemove', function (e) {
            if (me._enableEdgeMove) {
                me.mousemoveAction(e);
            }
        });
    };

    //鼠标移动过程中，到地图边缘后自动平移地图
    CanvasLayer.prototype.mousemoveAction = function (e) {
        function getClientPosition(e) {
            var clientX = e.clientX,
                clientY = e.clientY;
            if (e.changedTouches) {
                clientX = e.changedTouches[0].clientX;
                clientY = e.changedTouches[0].clientY;
            }
            return new BMap.Pixel(clientX, clientY);
        }

        var map = this._map,
            me = this,
            pixel = map.pointToPixel(this.getDrawPoint(e)),
            clientPos = getClientPosition(e),
            offsetX = clientPos.x - pixel.x,
            offsetY = clientPos.y - pixel.y;
        pixel = new BMap.Pixel(clientPos.x - offsetX, clientPos.y - offsetY);
        this._draggingMovePixel = pixel;
        var point = map.pixelToPoint(pixel),
            eventObj = {
            pixel: pixel,
            point: point
        };
        // 拖拽到地图边缘移动地图
        this._panByX = this._panByY = 0;
        if (pixel.x <= 20 || pixel.x >= map.width - 20 || pixel.y <= 50 || pixel.y >= map.height - 10) {
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
                this._edgeMoveTimer = setInterval(function () {
                    map.panBy(me._panByX, me._panByY, { "noAnimation": true });
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
    CanvasLayer.prototype.getDrawPoint = function (e) {

        var map = this._map,
            trigger = baidu$1.getTarget(e),
            x = e.offsetX || e.layerX || 0,
            y = e.offsetY || e.layerY || 0;
        if (trigger.nodeType != 1) trigger = trigger.parentNode;
        while (trigger && trigger != map.getContainer()) {
            if (!(trigger.clientWidth == 0 && trigger.clientHeight == 0 && trigger.offsetParent && trigger.offsetParent.nodeName == 'TD')) {
                x += trigger.offsetLeft || 0;
                y += trigger.offsetTop || 0;
            }
            trigger = trigger.offsetParent;
        }
        var pixel = new BMap.Pixel(x, y);
        var point = map.pixelToPoint(pixel);
        return point;
    };
}

// Events
// -----------------
// Thanks to:
//  - https://github.com/documentcloud/backbone/blob/master/backbone.js
//  - https://github.com/joyent/node/blob/master/lib/events.js

// Regular expression used to split event strings
var eventSplitter = /\s+/;

// A module that can be mixed in to *any object* in order to provide it
// with custom events. You may bind with `on` or remove with `off` callback
// functions to an event; `trigger`-ing an event fires all callbacks in
// succession.
//
//     var object = new Events();
//     object.on('expand', function(){ alert('expanded'); });
//     object.trigger('expand');
//
function Events() {}

// Bind one or more space separated events, `events`, to a `callback`
// function. Passing `"all"` will bind the callback to all events fired.
Events.prototype.on = function (events, callback, context) {
    var cache, event, list;
    if (!callback) return this;

    cache = this.__events || (this.__events = {});
    events = events.split(eventSplitter);

    while (event = events.shift()) {
        list = cache[event] || (cache[event] = []);
        list.push(callback, context);
    }

    return this;
};

Events.prototype.once = function (events, callback, context) {
    var that = this;
    var cb = function cb() {
        that.off(events, cb);
        callback.apply(context || that, arguments);
    };
    return this.on(events, cb, context);
};

// Remove one or many callbacks. If `context` is null, removes all callbacks
// with that function. If `callback` is null, removes all callbacks for the
// event. If `events` is null, removes all bound callbacks for all events.
Events.prototype.off = function (events, callback, context) {
    var cache, event, list, i;

    // No events, or removing *all* events.
    if (!(cache = this.__events)) return this;
    if (!(events || callback || context)) {
        delete this.__events;
        return this;
    }

    events = events ? events.split(eventSplitter) : keys(cache);

    // Loop through the callback list, splicing where appropriate.
    while (event = events.shift()) {
        list = cache[event];
        if (!list) continue;

        if (!(callback || context)) {
            delete cache[event];
            continue;
        }

        for (i = list.length - 2; i >= 0; i -= 2) {
            if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                list.splice(i, 2);
            }
        }
    }

    return this;
};

// Trigger one or many events, firing all bound callbacks. Callbacks are
// passed the same arguments as `trigger` is, apart from the event name
// (unless you're listening on `"all"`, which will cause your callback to
// receive the true name of the event as the first argument).
Events.prototype.trigger = function (events) {
    var cache,
        event,
        all,
        list,
        i,
        len,
        rest = [],
        args,
        returned = true;
    if (!(cache = this.__events)) return this;

    events = events.split(eventSplitter);

    // Fill up `rest` with the callback arguments.  Since we're only copying
    // the tail of `arguments`, a loop is much faster than Array#slice.
    for (i = 1, len = arguments.length; i < len; i++) {
        rest[i - 1] = arguments[i];
    }

    // For each event, walk through the list of callbacks twice, first to
    // trigger the event, then to trigger any `"all"` callbacks.
    while (event = events.shift()) {
        // Copy callback lists to prevent modification.
        if (all = cache.all) all = all.slice();
        if (list = cache[event]) list = list.slice();

        // Execute event callbacks except one named "all"
        if (event !== 'all') {
            returned = triggerEvents(list, rest, this) && returned;
        }

        // Execute "all" callbacks.
        returned = triggerEvents(all, [event].concat(rest), this) && returned;
    }

    return returned;
};

Events.prototype.emit = Events.prototype.trigger;

// Helpers
// -------

var keys = Object.keys;

if (!keys) {
    keys = function keys(o) {
        var result = [];

        for (var name in o) {
            if (o.hasOwnProperty(name)) {
                result.push(name);
            }
        }
        return result;
    };
}

// Mix `Events` to object instance or Class function.
Events.mixTo = function (receiver) {
    var proto = Events.prototype;

    if (isFunction(receiver)) {
        for (var key in proto) {
            if (proto.hasOwnProperty(key)) {
                receiver.prototype[key] = proto[key];
            }
        }
        Object.keys(proto).forEach(function (key) {
            receiver.prototype[key] = proto[key];
        });
    } else {
        var event = new Events();
        for (var key in proto) {
            if (proto.hasOwnProperty(key)) {
                copyProto(key);
            }
        }
    }

    function copyProto(key) {
        receiver[key] = function () {
            proto[key].apply(event, Array.prototype.slice.call(arguments));
            return this;
        };
    }
};

// Execute callbacks
function triggerEvents(list, args, context) {
    var pass = true;

    if (list) {
        var i = 0,
            l = list.length,
            a1 = args[0],
            a2 = args[1],
            a3 = args[2];
        // call is faster than apply, optimize less than 3 argu
        // http://blog.csdn.net/zhengyinhui100/article/details/7837127
        switch (args.length) {
            case 0:
                for (; i < l; i += 2) {
                    pass = list[i].call(list[i + 1] || context) !== false && pass;
                }break;
            case 1:
                for (; i < l; i += 2) {
                    pass = list[i].call(list[i + 1] || context, a1) !== false && pass;
                }break;
            case 2:
                for (; i < l; i += 2) {
                    pass = list[i].call(list[i + 1] || context, a1, a2) !== false && pass;
                }break;
            case 3:
                for (; i < l; i += 2) {
                    pass = list[i].call(list[i + 1] || context, a1, a2, a3) !== false && pass;
                }break;
            default:
                for (; i < l; i += 2) {
                    pass = list[i].apply(list[i + 1] || context, args) !== false && pass;
                }break;
        }
    }
    // trigger will return false if one of the callbacks return false
    return pass;
}

function isFunction(func) {
    return Object.prototype.toString.call(func) === '[object Function]';
}

/**
 * @file global Event
 */

var Events$1 = function () {
    function Events$1() {
        _classCallCheck(this, Events$1);

        this.emits = {};
        this.maxId = 0;
    }
    /**
     * listen for a channle
     * @param  {String} channle
     * @param  {Function} fn
     * @returns the listener's id
     */


    _createClass(Events$1, [{
        key: "on",
        value: function on(channel, fn) {
            this.emits[channel] = this.emits[channel] || {};
            var id = ++this.maxId;
            this.emits[channel][id] = fn;
            return id;
        }
        // same with on function

    }, {
        key: "listen",
        value: function listen() {
            this.on.apply(this, arguments);
        }

        /**
         * remove the listener  
         * @param  {Number} id the linstner's id
         */

    }, {
        key: "unbind",
        value: function unbind(id) {
            for (var channel in this.emits) {
                var typeFn = this.emits[channel];
                for (var _id in typeFn) {
                    if (id == id) {
                        delete this.emits[channel][id];
                        return true;
                    }
                }
            }
            return false;
        }

        /**
         * emit data to a special channel
         * @param  {String} channel
         * @param  {Object} data
         */

    }, {
        key: "emit",
        value: function emit(channel, data) {
            var args = Array.prototype.slice.call(arguments, 1);
            for (var i in this.emits[channel]) {
                var _emits$channel;

                (_emits$channel = this.emits[channel])[i].apply(_emits$channel, _toConsumableArray(args));
            }
        }
    }, {
        key: "trigger",
        value: function trigger() {
            this.emit.apply(this, arguments);
        }
    }]);

    return Events$1;
}();

var Store = function (_Events$) {
    _inherits(Store, _Events$);

    function Store() {
        _classCallCheck(this, Store);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Store).call(this));
    }

    _createClass(Store, [{
        key: "bindEvent",
        value: function bindEvent(event) {
            this.event = event;
        }
    }]);

    return Store;
}(Events$1);

var event = new Events$1();

/**
 * @获取面信息 a - b 操作
 */

// import Gpc from './gpc';

var PolyDefault = gpcas.geometry.PolyDefault;

var PolygonDiff = function () {
    function PolygonDiff(blockDatas, currPolygon) {
        _classCallCheck(this, PolygonDiff);

        this.blockDatas = [].concat(blockDatas);
        this.currPolygon = [].concat(currPolygon);

        this.interPoints = [];
        // 相减后的数据
        this.defPolygon = [];
        // this.unionPolygon = [];
        this._initDefPolygon(blockDatas, currPolygon);
    }

    /**
     * 获取生成
     */


    _createClass(PolygonDiff, [{
        key: "getPolygon",
        value: function getPolygon() {
            return this.defPolygon;
        }

        /**
         * 返回union polygon数据
         */
        // getUnionPolygon() {
        //     if (this.unionPolygon.length) {
        //         return this.unionPolygon;
        //     }
        //     if (this.defPolygon.length) {
        //         return this.defPolygon;
        //     }
        // }

    }, {
        key: "_initDefPolygon",
        value: function _initDefPolygon(p1, p2) {
            var self = this;
            if (!p1.length || !p2.length) {
                if (p1.length) {
                    this.defPolygon.push(p1);
                    return;
                } else if (p2.length) {
                    this.defPolygon.push(p2);
                }
                return;
            }

            this._diffAllPolygon(p1, p2);
            // this._unionAllPolygon(p1, p2);
        }
        /**
         * 使用新的多边形分边与所有已画的多边相减
         * @param  {} blockPolygons
         * @param  {} curPoly
         */

    }, {
        key: "_diffAllPolygon",
        value: function _diffAllPolygon(blockPolygons, curPoly) {
            var self = this;
            var diffPoly = [curPoly];
            var poly1 = void 0;
            var poly2 = void 0;

            blockPolygons.map(function (polygons, index) {
                polygons.polygons.map(function (pitem, pindex) {
                    var diffPolySem = [];
                    diffPoly.map(function (ditem, dindex) {
                        poly1 = self._createPoly(self._getTempPolygon(pitem));
                        poly2 = self._createPoly(self._getTempPolygon(ditem));
                        var diffPoly = self._diffPolygon(poly1, poly2);
                        diffPolySem = diffPolySem.concat(diffPoly);
                    });

                    diffPoly = diffPolySem;
                });
            });

            self.defPolygon = self.defPolygon.concat(diffPoly);
        }
    }, {
        key: "_diffPolygon",
        value: function _diffPolygon(poly1, poly2) {
            var self = this;
            var diffPolygon = poly2.difference(poly1);
            var points = this._getPolygons(diffPolygon);
            return points;
        }

        /**
         * 返回操作后的面数据，有n个
         * @param  {} polygon
         */

    }, {
        key: "_getPolygons",
        value: function _getPolygons(polygon) {
            var self = this;
            var count = polygon.getNumInnerPoly();
            var tempPolygon = [];
            for (var i = 0; i < count; i++) {
                var poly = polygon.getInnerPoly(i);
                var vertices = self._getPolygonVertices(poly);
                var points = vertices.map(function (item, index) {
                    return {
                        lat: item[0] / 1000000,
                        lng: item[1] / 1000000
                    };
                });
                points.push(points[0]);
                tempPolygon.push(points);
            }
            return tempPolygon;
        }

        /**
         * 重置lat,lng数据，扩大倍数，提高计算精度
         */

    }, {
        key: "_getTempPolygon",
        value: function _getTempPolygon(polygon) {
            var newPolygon = [];
            polygon.map(function (item, index) {
                newPolygon.push(Object.assign(item, {
                    x: item.lat * 1000000,
                    y: item.lng * 1000000
                }));
            });
            return newPolygon;
        }

        /**
         * 创数点数组信息
         * @param  {} points
         */

    }, {
        key: "_createPoly",
        value: function _createPoly(points) {
            var res = new PolyDefault();
            points.map(function (item, index) {
                res.addPoint(new Point(item.x, item.y));
                // res.addPoint(new Point(points[i][0],points[i][1]));
            });
            return res;
        }

        /**
         * 获取所有点
         * @param  {} poly
         */

    }, {
        key: "_getPolygonVertices",
        value: function _getPolygonVertices(poly) {
            var vertices = [];
            var numPoints = poly.getNumPoints();
            var i;

            for (i = 0; i < numPoints; i++) {
                vertices.push([poly.getX(i), poly.getY(i)]);
            }
            return vertices;
        }
    }]);

    return PolygonDiff;
}();

// point


var Point = function Point(x, y) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
};

var BMAP_DRAWING_POLYGON$1 = "polygon";
// 鼠标画多边形模式

var GlobalStore = function (_Store) {
    _inherits(GlobalStore, _Store);

    function GlobalStore() {
        _classCallCheck(this, GlobalStore);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(GlobalStore).call(this));

        _this2.data = {
            drawingType: 'normal',
            _isopen: false,
            cacheData: [],
            blockData: [],
            unionPolygon: [],
            // 所有交点
            interPoints: []
        };
        _this2.bindEvent(event);
        _this2.onReady();
        return _this2;
    }

    _createClass(GlobalStore, [{
        key: "setDrawingType",
        value: function setDrawingType(dtype) {
            this.data.drawingType = dtype;
        }
    }, {
        key: "getDrawingType",
        value: function getDrawingType() {
            return this.data.drawingType;
        }
    }, {
        key: "setIsOpen",
        value: function setIsOpen(isOpen) {
            this.data._isopen = isOpen;
        }
    }, {
        key: "getIsOpen",
        value: function getIsOpen() {
            return this.data._isopen;
        }
    }, {
        key: "setCacheData",
        value: function setCacheData(data) {
            this.data.cacheData = this._formateData(data);
        }
    }, {
        key: "getCacheData",
        value: function getCacheData() {
            return this.data.cacheData;
        }
    }, {
        key: "getUniqId",
        value: function getUniqId(prefix) {
            return (prefix || '') + new Date().getTime().toString(36);
        }

        /**
         * 通过id删除polygon数据
         * @param  {} id
         */

    }, {
        key: "deletePolygonById",
        value: function deletePolygonById(id) {
            var blockData = this.getBlockData();
            var hasremove = false;
            var newData = blockData.filter(function (item) {
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

    }, {
        key: "setBlockData",
        value: function setBlockData(data) {
            data.data = this._formateData(data.data);
            var newPolygon = this._getPolygonData(data);
            var tempData = {};
            tempData['drawingType'] = this.getDrawingType();
            tempData['id'] = this.getUniqId('block');
            tempData['polygons'] = newPolygon;
            baidu$1.extend(tempData, data);
            this.data.blockData.push(tempData);
        }
    }, {
        key: "getBlockData",
        value: function getBlockData() {
            return this.data.blockData;
        }

        /**
         * 当时多边形时，添加第一条数据至尾部，完成闭合
        */

    }, {
        key: "_formateData",
        value: function _formateData(data) {

            var drawType = this.getDrawingType();
            if (drawType === BMAP_DRAWING_POLYGON$1 && data.length > 0) {
                data = data.concat(data[0]);
            }
            return data;
        }
        /**
         * 存储外多边形
         */

    }, {
        key: "setLastPolygon",
        value: function setLastPolygon(polygon) {
            this.data.lastPolygon = polygon;
        }
    }, {
        key: "getLastPolygon",
        value: function getLastPolygon() {
            return this.data.lastPolygon;
        }
        /**
         * 存储所有焦点
         */

    }, {
        key: "setInterPoints",
        value: function setInterPoints(data) {
            this.data.interPoints = this.data.interPoints.concat(data);
        }
    }, {
        key: "getInterPoints",
        value: function getInterPoints() {
            return this.data.interPoints;
        }
        /**
         * 获取交叉后的多边形数据
         */

    }, {
        key: "_getPolygonData",
        value: function _getPolygonData(srcData) {
            var self = this;
            var blockDatas = this.getBlockData();
            var polygonDiff = new PolygonDiff(blockDatas, srcData.data);
            var diffPolyon = polygonDiff.getPolygon();
            return diffPolyon;
        }
    }, {
        key: "onReady",
        value: function onReady() {
            var self = this;
            var trigEvname = 'ready';
            this.event.on('setDrawType', function (type) {
                self.setDrawingType(type);
                self.trigger(trigEvname, 'setDrawType', self.getDrawingType());
            });
            this.event.on('setDrawStatus', function (value) {
                self.setIsOpen(value);
                self.trigger(trigEvname, 'setDrawStatus', self.getIsOpen());
            });
            this.event.on('drawingCache', function (data) {
                self.setCacheData(data);
                self.trigger(trigEvname, 'drawingCache', self.getCacheData());
            });
            this.event.on('drawComplete', function (data) {
                self.setBlockData(data);
                self.setCacheData([]);
                self.trigger(trigEvname, 'drawComplete', self.getBlockData());
            });
            this.event.on('delete_polygon_byid', function (id) {
                var hasRemove = self.deletePolygonById(id);
                self.trigger(trigEvname, 'deletePolygonById', hasRemove, self.getBlockData());
            });
        }
    }]);

    return GlobalStore;
}(Store);

var globalStore = new GlobalStore();

var DrawLayer = function () {
    function DrawLayer(map, config) {
        _classCallCheck(this, DrawLayer);

        var self = this;
        self.map = map;
        self.config = config;

        self.canvasLayer = new CanvasLayer({
            map: map,
            update: function update() {
                self._updateMap.apply(self);
            }
        });
        var ctx = self.ctx = self.canvasLayer.canvas.getContext("2d");
        if (!ctx) {
            return;
        }
        Events.mixTo(self);
        self._listenStore();
    }

    _createClass(DrawLayer, [{
        key: "_listenStore",
        value: function _listenStore() {
            var self = this;
            globalStore.listen('ready', function (type, param) {
                if (type === 'drawingCache') {
                    self._updateMap();
                } else if (type === 'drawComplete') {
                    self._updateMap();
                }
            });
        }

        // 更更绘图

    }, {
        key: "_updateMap",
        value: function _updateMap() {
            if (this.canvasLayer) {
                this._drawCtx();
            }
        }
        /**
         * 开始绘画整个ctx 
         */

    }, {
        key: "_drawCtx",
        value: function _drawCtx() {
            this._clearRect();
            this._drawCacheData();
            this._drawPolygonData();
            this._drawInterPoints();
        }
    }, {
        key: "_clearRect",
        value: function _clearRect() {
            var ctx = this.ctx;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }

        // 组织临时数据

    }, {
        key: "_drawCacheData",
        value: function _drawCacheData() {
            var self = this;
            var cacheData = globalStore.getCacheData();
            var blockData = globalStore.getBlockData();
            var drawingType = globalStore.getDrawingType();
            var dataPix = void 0;
            if (cacheData.length == 0 || !cacheData) {
                return;
            }

            dataPix = cacheData.map(function (item, index) {
                return self._lnglatToPix(item);
            });
            this._drawDispatcher(drawingType, dataPix, blockData.length);
        }
        // 组织存储数据

    }, {
        key: "_drawBlockData",
        value: function _drawBlockData() {
            var self = this;
            var blockData = globalStore.getBlockData();
            if (blockData.length === 0 || !blockData) {
                return;
            }
            blockData.map(function (item, index) {
                var pixels = item.data.map(function (pitem, pindex) {
                    return self._lnglatToPix(pitem);
                });
                self._drawDispatcher(item.drawingType, pixels);
            });
        }
    }, {
        key: "_drawPolygonData",
        value: function _drawPolygonData() {
            var self = this;
            var blockData = globalStore.getBlockData();
            if (blockData.length === 0 || !blockData) {
                return;
            }
            blockData.map(function (item, index) {
                item.polygons.map(function (pitem) {
                    var pixels = pitem.map(function (spitem) {
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

    }, {
        key: "_drawInterPoints",
        value: function _drawInterPoints() {
            var self = this;
            var interPoints = globalStore.getInterPoints();

            if (interPoints.length === 0) {
                return;
            }

            var pixels = interPoints.map(function (item) {
                return self._lnglatToPix(item);
            });

            self._drawArcPoints(pixels);
        }

        // 经纬度转换为像素

    }, {
        key: "_lnglatToPix",
        value: function _lnglatToPix(point) {
            var map = this.map;
            var pixel = map.pointToPixel(point);
            return pixel;
        }
        /**
         * 分发器
         */

    }, {
        key: "_drawDispatcher",
        value: function _drawDispatcher(type, data, index) {
            var self = this;
            switch (type) {
                case 'rectangle':
                    // self.drawRectangle(data, self.config.rectangleOptions);
                    self.drawPolygon(data, self._drawStyle(index));
                    break;
                case 'polygon':
                    self.drawPolygon(data, self._drawStyle(index));
                    break;
            }
        }
    }, {
        key: "_drawStyle",
        value: function _drawStyle(index) {
            var self = this;
            var config = self.config.polygonOptions;
            var fillColor = config.fillColor;
            var strokeColor = config.strokeColor;
            var strokeWeight = config.strokeWeight;
            return {
                fillColor: typeof fillColor === 'string' ? fillColor : fillColor[index % fillColor.length],
                strokeColor: typeof strokeColor === 'string' ? strokeColor : strokeColor[index % strokeColor.length],
                strokeWeight: strokeWeight
            };
        }

        // 画矩形

    }, {
        key: "drawRectangle",
        value: function drawRectangle(data, styleOpts) {
            var self = this;
            var map = self.map;
            var ctx = self.ctx;
            var startPoint = data[0];
            var endPoint = data[2];
            var width = endPoint.x - startPoint.x;
            var height = endPoint.y - startPoint.y;
            ctx.beginPath();
            self.setPixelRatio(function () {
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

    }, {
        key: "drawPolygon",
        value: function drawPolygon(data, styleOpts) {
            var isPolygon = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            var self = this;
            var map = this.map;
            var ctx = self.ctx;
            ctx.beginPath();
            self.setPixelRatio(function () {
                data.map(function (item, index) {
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

    }, {
        key: "drawPolyline",
        value: function drawPolyline(data, styleOpts) {
            var isPolygon = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            this.drawPolygon(data, styleOpts, isPolygon);
        }
    }, {
        key: "getPixelRatio",
        value: function getPixelRatio() {
            var context = this.ctx;
            var backingStore = context.backingStorePixelRatio || context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;

            return (window.devicePixelRatio || 1) / backingStore;
        }
    }, {
        key: "setPixelRatio",
        value: function setPixelRatio(fn) {
            // fn && fn();
            // return false;
            var ctx = this.ctx;
            var pixelRatio = this.getPixelRatio();
            ctx.save();
            ctx.scale(pixelRatio, pixelRatio);
            fn && fn();
            ctx.restore();
        }
    }, {
        key: "_drawArcPoints",
        value: function _drawArcPoints(pixels) {
            this._storkArc(pixels);
            this._fillArc(pixels);
        }

        /**
         * 画圆边框
         */

    }, {
        key: "_storkArc",
        value: function _storkArc(pixels) {
            var radius = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];
            var color = arguments.length <= 2 || arguments[2] === undefined ? '#ffff00' : arguments[2];
            var lineWidth = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

            var ctx = this.ctx;
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            this.setPixelRatio(function () {
                pixels.map(function (pixel) {
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

    }, {
        key: "_fillArc",
        value: function _fillArc(pixels) {
            var radis = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];
            var color = arguments.length <= 2 || arguments[2] === undefined ? '#ffffff' : arguments[2];

            var ctx = this.ctx;
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
    }]);

    return DrawLayer;
}();

;

var styleOptions = {
    strokeColor: "red", //边线颜色。
    fillColor: "rgba(255,0,0,0.5)", //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3 //边线的宽度，以像素为单位。
};

var BMAP_DRAWING_RECTANGLE$2 = "rectangle";
var BMAP_DRAWING_POLYGON$2 = "polygon";
// 鼠标画多边形模式

var Config = function () {
    function Config(param) {
        _classCallCheck(this, Config);

        this.config = {
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            offset: new BMap.Size(5, 5),
            polygonOptions: styleOptions, //线的样式
            polylineOptions: styleOptions, //多边形的样式
            rectangleOptions: styleOptions, //矩形的样式
            enableDrawingTool: true,
            enableCalculate: false,
            controlButton: 'left',
            drawingModes: [BMAP_DRAWING_POLYGON$2, BMAP_DRAWING_RECTANGLE$2]
        };
        this.mergeData(param);
    }

    _createClass(Config, [{
        key: "getConfig",
        value: function getConfig() {
            return this.config;
        }
    }, {
        key: "mergeData",
        value: function mergeData(param) {
            var self = this;
            if ((typeof param === "undefined" ? "undefined" : _typeof(param)) != 'object') {
                return this.config;
            }
            this.config = baidu$1.extend(this.config, param);

            this.config['controlButton'] = param['controlButton'] == 'right' ? 'right' : 'left';
            // 更新样式
            var styles = ['polylineOptions', 'polygonOptions', 'rectangleOptions'];
            styles.map(function (item) {
                if (item in param) {
                    self._mergeStyle(item, param[item]);
                }
            });
            // 是否显示画区工具
            var enableDrawingTool = 'enableDrawingTool';
            if (enableDrawingTool in param) {
                this.config[enableDrawingTool] = param[enableDrawingTool];
            }
        }
    }, {
        key: "_mergeStyle",
        value: function _mergeStyle(keyname, newConf) {
            var style = this.config[keyname];
            this.config[keyname] = baidu$1.extend(style, newConf);
        }
    }]);

    return Config;
}();

var BMAP_DRAWING_POLYLINE$3 = "polyline";
var BMAP_DRAWING_RECTANGLE$3 = "rectangle";
var BMAP_DRAWING_POLYGON$3 = "polygon";
// 鼠标画多边形模式

var DrawingManager = function () {
    function DrawingManager(map) {
        _classCallCheck(this, DrawingManager);

        this._map = map;
        this.drawLayer = '';
        this.listenStore();
    }

    // 设置鼠标样式


    _createClass(DrawingManager, [{
        key: "setMouseCursor",
        value: function setMouseCursor() {
            var map = this._map;
            map.setDefaultCursor("url('bird.cur')");
        }
    }, {
        key: "listenStore",
        value: function listenStore() {
            var self = this;
            globalStore.on('ready', function (type, param) {
                if (type === 'setDrawStatus') {
                    if (param) {
                        self._open();
                    } else {
                        self._close();
                    }
                }
            });
        }

        /**
         * 开启地图的绘制模式
         */

    }, {
        key: "open",
        value: function open() {
            // 判断绘制状态是否已经开启
            var isopen = globalStore.getDrawingType();
            if (isopen == true) {
                return true;
            }
            event.emit('setDrawStatus', true);
        }
    }, {
        key: "close",
        value: function close() {
            var self = this;
            var isopen = globalStore.getDrawingType();
            if (isopen == false) {
                return true;
            }
            event.emit('setDrawType', 'normal');
            event.emit('setDrawStatus', false);
            setTimeout(function () {
                self._map.enableDoubleClickZoom();
            }, 500);
        }

        /**
         * 打开距离或面积计算
         */

    }, {
        key: "enableCalculate",
        value: function enableCalculate() {
            this._enableCalculate = true;
            this._addGeoUtilsLibrary();
        }
        /**
         * 关闭距离或面积计算
         *
         * @example <b>参考示例：</b><br />
         * myDrawingManagerObject.disableCalculate();
         */

    }, {
        key: "disableCalculate",
        value: function disableCalculate() {
            this._enableCalculate = false;
        }

        /**
         * 开启测距和测面功能需要依赖于GeoUtils库
         * 所以这里判断用户是否已经加载,若未加载则用js动态加载
         */

    }, {
        key: "_addGeoUtilsLibrary",
        value: function _addGeoUtilsLibrary() {
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

    }, {
        key: "_addLabel",
        value: function _addLabel(point, content) {
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

    }, {
        key: "setDrawingMode",
        value: function setDrawingMode(DrawingType) {
            //与当前模式不一样时候才进行重新绑定事件
            var drawingType = globalStore.getDrawingType();
            if (drawingType !== DrawingType) {
                event.emit('setDrawType', DrawingType);
            }
        }

        /**
         * 获取当前的绘制模式
         * @return {DrawingType} 绘制的模式
         */

    }, {
        key: "getDrawingMode",
        value: function getDrawingMode() {
            return globalStore.getDrawingType();
        }

        /**
         * 开启地图的绘制状态
         * @return {Boolean}，开启绘制状态成功，返回true；否则返回false。
         */

    }, {
        key: "_open",
        value: function _open() {
            var drawingType = globalStore.getDrawingType();
            this._setDrawingMode(drawingType);
        }

        /**
         * 设置当前的绘制模式
         * @param {DrawingType}
         */

    }, {
        key: "_setDrawingMode",
        value: function _setDrawingMode(drawingType) {
            var self = this;
            /**
             * 开启编辑状态时候才重新进行事件绑定
             */
            var _isopen = globalStore.getIsOpen();
            if (_isopen) {
                self._canvas.__listeners = {};
                switch (drawingType) {
                    case BMAP_DRAWING_POLYLINE$3:
                    case BMAP_DRAWING_POLYGON$3:
                        self._bindPolylineOrPolygon();
                        break;
                    case BMAP_DRAWING_RECTANGLE$3:
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

    }, {
        key: "_close",
        value: function _close() {

            this._canvas.__listeners = {};
            event.emit('drawingCache', []);
            if (this._drawingTool) {
                this._drawingTool.setStyleByDrawingMode('hander');
            }
        }

        /**
         * 画线和画多边形相似性比较大，公用一个方法
         */

    }, {
        key: "_bindPolylineOrPolygon",
        value: function _bindPolylineOrPolygon() {
            var self = this;
            var map = this._map;
            var canvas = this._canvas;
            var points = []; //用户绘制的点
            var drawPoint = null; //实际需要画在地图上的点
            var overlay = null;
            var isBinded = false;
            var drawingType = self.getDrawingMode();

            var controlButton = this.config.controlButton;
            var startAction = function startAction(e) {
                if (controlButton === 'right' && (e.button == 1 || e.button === 0)) {
                    return;
                }
                points.push(e.point);
                drawPoint = points.concat(points[points.length - 1]);

                if (points.length === 1) {
                    // 线段
                    if (drawingType === BMAP_DRAWING_POLYLINE$3) {
                        overlay = new BMap.Polyline(drawPoint, {});
                    } else if (drawingType === BMAP_DRAWING_POLYGON$3) {
                        //多边形
                        overlay = new BMap.Polygon(drawPoint, {});
                    }
                    event.emit('drawingCache', points);
                } else {
                    event.emit('drawingCache', points);
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
            var mousemoveAction = function mousemoveAction(e) {
                event.emit('drawingCache', points.concat(e.point));
            };

            /**
             * 鼠标双击的事件
             */
            var dblclickAction = function dblclickAction(e) {
                baidu$1.stopBubble(e);
                isBinded = false;
                canvas.disableEdgeMove();
                canvas.removeEventListener('mousedown', startAction);
                canvas.removeEventListener('mousemove', mousemoveAction);
                canvas.removeEventListener('dblclick', dblclickAction);

                if (controlButton === 'right') {
                    points.push(e.point);
                } else if (baidu$1.id <= 8) {} else {
                    points.pop();
                }
                overlay.setPath(points);
                var calculate = self._calculate(overlay, points);
                event.emit('drawComplete', {
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
            canvas.addEventListener('dblclick', function (e) {
                baidu$1.stopBubble(e);
            });
        }

        /**
         * 绑定鼠标画矩形的事件
         */

    }, {
        key: "_bindRectangle",
        value: function _bindRectangle() {
            var self = this;
            var map = self._map;
            var canvas = self._canvas;
            var polygon = null;
            var startPoint = null;

            var controlButton = this.config.controlButton;
            var endPoint;
            var startAction = function startAction(e) {
                baidu$1.stopBubble(e);
                baidu$1.preventDefault(e);
                if (controlButton === 'right' && (e.button == 1 || e.button == 0)) {
                    return;
                }
                startPoint = e.point;
                endPoint = startPoint;
                event.emit('drawingCache', self._getRectanglePoint(startPoint, endPoint));
                canvas.enableEdgeMove();
                canvas.addEventListener('mousemove', moveAction);
                baidu$1.on(document, 'mouseup', endAction);
            };
            var moveAction = function moveAction(e) {
                endPoint = e.point;
                event.emit('drawingCache', self._getRectanglePoint(startPoint, endPoint));
            };

            var endAction = function endAction(e) {
                endPoint = e.point || endPoint;
                polygon = new BMap.Polygon(self._getRectanglePoint(startPoint, endPoint), {});
                var calculate = self._calculate(polygon, polygon.getPath()[2]);
                event.emit('drawComplete', {
                    calculate: calculate,
                    data: self._getRectanglePoint(startPoint, endPoint)
                });
                self._dispatchOverlayComplete(polygon, calculate);
                canvas.disableEdgeMove();
                startPoint = null;
                canvas.removeEventListener('mousemove', moveAction);
                baidu$1.un(document, 'mouseup', endAction);
            };
            canvas.addEventListener('mousedown', startAction);
        }

        /**
         * 添加显示所绘制图形的面积或者长度
         * @param {overlay} 覆盖物
         * @param {point} 显示的位置
         */

    }, {
        key: "_calculate",
        value: function _calculate(overlay, point) {
            var result = {
                data: 0, //计算出来的长度或面积
                label: null //显示长度或面积的label对象
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

    }, {
        key: "_getRectanglePoint",
        value: function _getRectanglePoint(startPoint, endPoint) {
            return [new BMap.Point(startPoint.lng, startPoint.lat), new BMap.Point(endPoint.lng, startPoint.lat), new BMap.Point(endPoint.lng, endPoint.lat), new BMap.Point(startPoint.lng, endPoint.lat), new BMap.Point(startPoint.lng, startPoint.lat)];
        }
        /**
         * 派发事件
         */

    }, {
        key: "_dispatchOverlayComplete",
        value: function _dispatchOverlayComplete(overlay, calculate) {
            var drawingType = globalStore.getDrawingType();
            var options = {
                'overlay': overlay,
                'drawingMode': drawingType
            };
            if (calculate) {
                options.calculate = calculate.data || null;
                options.label = calculate.label || null;
            }

            this.dispatchEvent(drawingType + 'complete', overlay);
            this.dispatchEvent('overlaycomplete', options);
        }
    }]);

    return DrawingManager;
}();

/**
 * 这里不使用api中的自定义事件，是为了更灵活使用
 */


DrawingManager.prototype.dispatchEvent = baidu$1.lang.Class.prototype.dispatchEvent;
DrawingManager.prototype.addEventListener = baidu$1.lang.Class.prototype.addEventListener;
DrawingManager.prototype.removeEventListener = baidu$1.lang.Class.prototype.removeEventListener;

var BMAP_DRAWING_POLYLINE$4 = "polyline";
var BMAP_DRAWING_RECTANGLE$4 = "rectangle";
var BMAP_DRAWING_POLYGON$4 = "polygon";
// 鼠标画多边形模式
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
    this.defaultDrawingModes = [BMAP_DRAWING_POLYLINE$4, BMAP_DRAWING_POLYGON$4, BMAP_DRAWING_RECTANGLE$4];
    //工具栏可显示的绘制模式
    if (drawingToolOptions.drawingModes) {
        this.drawingModes = drawingToolOptions.drawingModes;
    } else {
        this.drawingModes = this.defaultDrawingModes;
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
};

//生成工具栏的html元素
DrawingTool.prototype._generalHtml = function (map) {

    //鼠标经过工具栏上的提示信息
    var tips = {};
    tips["hander"] = "拖动地图";
    tips[BMAP_DRAWING_POLYLINE$4] = "画折线";
    tips[BMAP_DRAWING_POLYGON$4] = "画多边形";
    tips[BMAP_DRAWING_RECTANGLE$4] = "画矩形";

    var getItem = function getItem(className, drawingType) {
        return '<a class="' + className + '" drawingType="' + drawingType + '" href="javascript:void(0)" title="' + tips[drawingType] + '" onfocus="this.blur()"></a>';
    };

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
};

/**
 * 设置工具栏的缩放比例
 */
DrawingTool.prototype._setScale = function (scale) {
    var width = 390,
        height = 50,
        ml = -parseInt((width - width * scale) / 2, 10),
        mt = -parseInt((height - height * scale) / 2, 10);
    this.container.style.cssText = ["-moz-transform: scale(" + scale + ");", "-o-transform: scale(" + scale + ");", "-webkit-transform: scale(" + scale + ");", "transform: scale(" + scale + ");", "margin-left:" + ml + "px;", "margin-top:" + mt + "px;", "*margin-left:0px;", //ie6、7
    "*margin-top:0px;", //ie6、7
    "margin-left:0px\\0;", //ie8
    "margin-top:0px\\0;", //ie8
    //ie下使用滤镜
    "filter: progid:DXImageTransform.Microsoft.Matrix(", "M11=" + scale + ",", "M12=0,", "M21=0,", "M22=" + scale + ",", "SizingMethod='auto expand');"].join('');
};

//绑定工具栏的事件
DrawingTool.prototype._bind = function (panel) {
    var me = this;
    baidu$1.on(this.panel, 'click', function (e) {
        var target = baidu$1.getTarget(e);
        var drawingType = target.getAttribute('drawingType');
        me.setStyleByDrawingMode(drawingType);
        me._bindEventByDraingMode(drawingType);
    });
};

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
};

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
};

var DispatchEvent = function () {
    function DispatchEvent(root) {
        _classCallCheck(this, DispatchEvent);

        this.root = root;
        this._listenStore();
    }

    _createClass(DispatchEvent, [{
        key: "_listenStore",
        value: function _listenStore() {
            var self = this;
            globalStore.listen('ready', function (type, param) {
                var _self$root;

                var args = arguments;
                switch (type) {
                    case 'deletePolygonById':
                    case 'setDrawType':
                        (_self$root = self.root).dispatchEvent.apply(_self$root, _toConsumableArray(args));
                        break;
                }
            });
        }
    }]);

    return DispatchEvent;
}();

;

var baidu = baidu$1;
/** 
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib$1 = window.BMapLib = BMapLib$1 || {};

// 鼠标画多边形模式

var ColorBlock = function (_DrawingManager) {
    _inherits(ColorBlock, _DrawingManager);

    function ColorBlock(mapObj, param) {
        _classCallCheck(this, ColorBlock);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(ColorBlock).call(this, mapObj));

        Events.mixTo(_this3);
        _this3._map = mapObj;
        _this3._configObj = new Config(param);
        _this3.config = _this3._configObj.getConfig();
        _this3.dispatchEvn = new DispatchEvent(_this3);
        _this3._init();
        return _this3;
    }

    _createClass(ColorBlock, [{
        key: "_init",
        value: function _init() {
            var self = this;
            var opts = this.config;

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

    }, {
        key: "initDrawingTool",
        value: function initDrawingTool() {
            var opt = this.config;
            if (opt.enableDrawingTool) {
                var drawingTool = new DrawingTool(this, opt);
                this._drawingTool = drawingTool;
                this._map.addControl(drawingTool);
            }
        }

        /**
         * @method 初始化drawlayer
         */

    }, {
        key: "initDrawLayer",
        value: function initDrawLayer() {
            this.drawLayer = new DrawLayer(this._map, this.config);
            this._canvas = this.drawLayer.canvasLayer;
        }

        /**
         * 删除指定ID的面数据
         * @param  {} id
         */

    }, {
        key: "deletePolygonById",
        value: function deletePolygonById(id) {
            if (!id) {
                return;
            }
            event.emit('delete_polygon_byid', id);
        }
        /**
         * 获取所有矩形数据
         * @return array
         */

    }, {
        key: "getPolygon",
        value: function getPolygon() {
            var blockdatas = globalStore.getBlockData();
            return blockdatas.map(function (item) {
                return {
                    id: item.id,
                    polygons: item.polygons
                };
            });
        }
        /**
         * 通过多个id合并多边形数据
         */

    }, {
        key: "unionPolygonById",
        value: function unionPolygonById() {
            var ids = arguments;
        }
    }]);

    return ColorBlock;
}(DrawingManager);

;

BMapLib$1.ColorBlock = ColorBlock;

},{}]},{},[1]);
