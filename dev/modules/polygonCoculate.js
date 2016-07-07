/**
 * @获取面信息
 */

export default class PolygonCoculate {
    constructor(polygon1, polygon2) {
        this.polygon1 = polygon1;
        this.polygon2 = polygon2;

        this.interPoints = [];
        // 相减后的数据
        this.defPolygon = [];
        this._initDefPolygon(polygon1, polygon2);
    }

    /**
     * 获取生成
     */
    getPolygon() {
        return this.defPolygon;
    }

    /**
     * 获取所有交点
     */
    getInterPoints() {
        return this.interPoints;
    }
    
    /**
     * 初始化数据
     */
    _initDefPolygon(p1, p2) {
        if (!p1.length || !p2.length) {
            if (p1.length) {
                this.defPolygon.push(p1);
                return;
            } else if (p2.length) {
                this.defPolygon.push(p2);
            }
            return;
        }

        this._getAllInterPoint();
    }

    /**
     * step1 获取所有交点
     * 循环获取p2的每个线与p1每条线是否有焦点，如果有，插入并缓存
     */
    _getAllInterPoint() {
        let self = this;
        let p1 = self._getTempPolygon(this.polygon1);
        let p2 = self._getTempPolygon(this.polygon2);

        // 产生新交点后的polygon数据
        // 新的数据对象
        let tp1 = [].concat(p1);
        let tp2 = [].concat(p2);

        let newP1 = [];
        let newP2 = [];
        let tempCont = 0;
        for (let i = 0, l = p2.length - 1; i < l; i++) {
            let pi1 = p2[i];
            let pi2 = p2[i + 1];
            let tempPoint = [];
            for (let x = 0, xl = p1.length - 1; x < xl; x++) {
                let spi1 = p1[x];
                let spi2 = p1[x + 1];
                let interPoint = self._isCross([pi1, pi2], [spi1, spi2]);
                if (interPoint) {
                    Object.assign(interPoint, { type: 'intersection', id: self._getUniqId(), index: tempCont++ });
                    newP1.push({ point: interPoint, position: x + 1 });

                    tempPoint.push(interPoint);
                }
            }
            if (tempPoint.length > 0) {
                newP2.push({ point: tempPoint, position: i + 1 });
            }
        }
        // 倒序插入新增加的交点
        tp1 = self._invertInsertPoint(tp1, newP1);
        tp2 = self._invertInsertPoint(tp2, newP2);

        // 获取面数据
        self._getPolygonData(tp1, tp2);
    }
    /**
     * 倒序插入新增加的交点
     * @param  {} srcPoints
     * @param  {} newPoint
     */
    _invertInsertPoint(srcPoints, newPoint) {
        let self = this;
        newPoint.reverse();
        newPoint.map((item, index) => {
            if (item.point.splice) {
                srcPoints.splice(item.position, 0, ...item.point);
            } else {
                srcPoints.splice(item.position, 0, item.point);
            }
        });
        let newPoints = self._sortPoints(srcPoints);
        return newPoints;
    }

    
    /**
     * 连续的点进行排序
     * @param  {} points
     * ---O---OO---O--O--OO--
     */
    _sortPoints(points) {
        let self = this;
        let _sortPoints = (spoint, points) => {
            let tmpArr = [];
            points.map((item, index) => {
                let poitem = item.pdata;
                tmpArr.push({
                    idata: poitem,
                    dist: Math.abs(Math.sqrt(Math.pow((poitem.x - spoint.x), 2) + Math.pow((poitem.y - spoint.y), 2)))
                });
            });
            tmpArr.sort((a,b) => {
                return a.dist > b.dist
            });
            let reArr = tmpArr.map(item => {
                return item.idata;
            });
            return reArr;
        }

        let tempPoint = [];
        for(let i = 0, l = points.length; i < l; i ++) {
            if (points[i].type) {
                tempPoint.push({
                    index: i,
                    pdata: points[i]
                });
            } else {
                if (tempPoint.length > 1) {
                    console.log('++++++++++++ tempPoint:', [].concat(tempPoint));
                    let newPoints = _sortPoints(points[tempPoint[0].index - 1], tempPoint);
                    console.log('-------------::', newPoints);
                    // tempPoint.map((item, index) => {
                    //     points.splice(item.index, 1, newPoints[index]);
                    // })
                    points.splice(tempPoint[0].index, tempPoint.length, ...newPoints);

                }
                tempPoint = [];
            }
        }
        
        return points;
    }

    /**
     * 重置lat,lng数据，扩大倍数，提高计算精度
     */
    _getTempPolygon(polygon) {
        let newPolygon = [];
        polygon.map((item, index) => {
            newPolygon.push(Object.assign(item, {
                x: item.lat * 1000000,
                y: item.lng * 1000000
            }))
        });
        return newPolygon;
    }

    /**
     * 是否相交
     * 根据http://www.cnblogs.com/xpvincent/p/5208994.html 算法2
     */
    _isCross(line1, line2) {

        let l1_a = line1[0];
        let l1_b = line1[1];
        let l2_a = line2[0];
        let l2_b = line2[1];

        //线段line1的法线N1
        let nx1 = l1_b.y - l1_a.y;
        let ny1 = l1_a.x - l1_b.x;

        // 线段line2的法线N2
        let nx2 = l2_b.y - l2_a.y;
        let ny2 = l2_a.x - l2_b.x;

        // 两条法线做叉乘，如果为0，说明线段共线或平行，不相交
        let denominator = nx1 * ny2 - ny1 * nx2;
        if (denominator === 0) {
            return false;
        }

        // 法线N2上的投景
        let dist_L2a_n2 = nx2 * l2_a.x + ny2 * l2_a.y;
        let dist_l1a_n2 = nx2 * l1_a.x + ny2 * l1_a.y - dist_L2a_n2;
        let dist_l1b_n2 = nx2 * l1_b.x + ny2 * l1_b.y - dist_L2a_n2;

        // line1投影在line2.x投影同侧(对点在线段上的情况,本例当作不相交处理)
        if (dist_l1a_n2 * dist_l1b_n2 >= 0) {
            return false;
        }

        // 判断line2和line1的关系，原理同上
        // 在法线N1上的投影
        let dist_l1a_n1 = nx1 * l1_a.x + ny1 * l1_a.y;
        let dist_l2a_n1 = nx1 * l2_a.x + ny1 * l2_a.y - dist_l1a_n1;
        let dist_l2b_n1 = nx1 * l2_b.x + ny1 * l2_b.y - dist_l1a_n1;
        if (dist_l2a_n1 * dist_l2b_n1 >= 0) {
            return false;
        }

        // 计算交叉点坐标
        let fraction = dist_l1a_n2 / denominator;
        let dx = fraction * ny1;
        let dy = - fraction * nx1;

        let interpoint = { x: l1_a.x + dx, y: l1_a.y + dy };

        this.interPoints.push(Object.assign(interpoint, {
            lat: interpoint.x / 1000000,
            lng: interpoint.y / 1000000,
            hasLoaded: false
        }));
        return interpoint;
    }

    _getUniqId(prefix) {
        return (prefix || '') + (([new Date().getTime(), ((Math.random() * 1000)|0)].join(''))|0).toString(36);
    }


    /**
     * 获取交叉后的面，结果数据为 p2 - p1 的面
     * @param  {} p1 polygon 数据1 为底层数据
     * @param  {} p2 polygon 数据2 为新添加数据
     * 
     */
    _getPolygonData(p1, p2) {
        let self = this;

        // 寻找第一个在p1外面的点
        let startIndex;
        p2.some((item, index) => {
            // 非交点
            if (!item.type || !item.id) {
                let inPolygon = self._pointInPolygon(item, p1);
                if (!inPolygon) {
                    startIndex = index;
                    return true;
                }
            }
        });


        let tempPolygon = [];
        let points = [];
        let p2Len = p2.length;
        let currIndex = startIndex;
        let curPoint;
        let interIndex = 0;
        for (var i = 0, l = p2Len - 1; i < l; i++) {
            curPoint = p2[currIndex];
            if (curPoint.type && curPoint.type === 'intersection' && interIndex%2 === 0) {
                self._getSiglePolygon(curPoint, p1, p2, (polygonData) => {
                    tempPolygon.push(polygonData);
                });
                interIndex++;
            }
            currIndex = currIndex % l + 1;
        }
        self.defPolygon = tempPolygon;

    }
    
    /**
     * 获取一个交点相关的面
     * @param  {} srcPoint
     * @param  {} p1
     * @param  {} p2
     * @param  {} fn
     */
    _getSiglePolygon(srcPoint, p1, p2, fn) {
        let self = this;

        console.log('p1:', [].concat(p1));
        console.log('p2:', [].concat(p2))

        let tempPolygonData = [];
        let reverse = (curpoint) => {
            self._getPolygonReverse(curpoint, p1, (chosedPoints, tmpPoint) => {
                tempPolygonData.push(chosedPoints);
                // console.log('---------------', tmpPoint,tmpPoint.id , srcPoint.id, tmpPoint.id !== srcPoint.id)
                if (tmpPoint.id !== srcPoint.id) {
                    direct(tmpPoint);
                }
            });
        }
        let direct = (currpoint) => {
            self._getPolygonDirect(currpoint, p2, (chosedPoints, tmpPoint) => {
                tempPolygonData.push(chosedPoints);
                // console.log('--++++++---', chosedPoints)
                if (tmpPoint.id !== srcPoint.id) {
                    reverse(tmpPoint);
                } else {
                    reNewPolygon();
                }
            });
        };

        let reNewPolygon = () => {
            let tempPolyon = [];
            tempPolygonData.map(item => {
                tempPolyon = tempPolyon.concat(item);
            })
            // console.log('tempPolygonData:',tempPolygonData, tempPolyon);
            if (typeof fn === 'function') {
                fn(tempPolyon);
            }
            
        }

        reverse(srcPoint);

    }

    /**
     * @method 逆向寻找下一交点
     * @param  {} item
     * @param  {} points
     */
    _getPolygonReverse(item, points, fn) {
        let index = this._findCurrPoint(item.id, points);
        // console.log('index::', index);
        let pointLen = points.length;
        let tempIndex = index;
        let tempPoints = [];
        for (let i = 0, l = pointLen; i < l; i++) {
            tempIndex = tempIndex === 0 ? tempIndex = pointLen-1: tempIndex % pointLen - 1;
            let tmpPoint = points[tempIndex];
            tempPoints.push(tmpPoint);
            // console.log('tempPoints::', tempIndex, pointLen, tmpPoint)
            if (tmpPoint.type && tmpPoint.type === 'intersection') {
                tmpPoint.hasLoaded = true;
                break;
            }
        }

        if (typeof fn === 'function') {
            fn(tempPoints, tempPoints[tempPoints.length - 1]);
        }
    }

    /**
     * @method 正向寻找闭合点
     * @param  {} currItem 当前起始点
     * @param  {} targetItem 录找终点
     * @param  {} points 当前数组
     */
    _getPolygonDirect(currItem, points, fn) {
        var index = this._findCurrPoint(currItem.id, points);
        // console.log('index::', index);
        var pointLen = points.length;
        let tempIndex = index;
        let tempPoints = [];
        for (var i = 0, l = pointLen; i < l; i++) {
            tempIndex = tempIndex === pointLen - 1 ? 0 : tempIndex % pointLen + 1;
            let tmpPoint = points[tempIndex];
            tempPoints.push(tmpPoint);
            // console.log('tempPoints::', tempIndex, pointLen, tmpPoint)
            if (tmpPoint.type && tmpPoint.type === 'intersection') {
                tmpPoint.hasLoaded = true;
                break;
            }
        }
        if (typeof fn === 'function') {
            fn(tempPoints, tempPoints[tempPoints.length - 1]);
        }

    }

    /**
     * @method 获取当前id所在的index
     * @return index
     */
    _findCurrPoint(id, points) {
        console.log('id, points::',id, points)
        let arrIndex;
        points.filter((item, index) => {
            if (item.id && item.id == id) {
                arrIndex = index;
                return;
            }
        });
        return arrIndex;
    }


    /**
     * @method 判断点在多边形内
     * @param  {} point
     * @param  {} points
     * http://blog.csdn.net/hjh2005/article/details/9246967
     * http://www.cnblogs.com/armyfai/p/3529243.html
     */
    _pointInPolygon(point, points) {
        let self = this;
        let px = point.px;
        let py = point.py;
        let pointLen = points.length;
        let minX = self._getMinValue(points, 'x');
        let minY = self._getMinValue(points, 'y');
        let maxX = self._getMaxValue(points, 'x');
        let maxY = self._getMaxValue(points, 'y');

        // 首先我们需要取得该数组在横坐标和纵坐标的最大值和最小值，根据这四个点算出一个四边型，首先判断目标坐标点是否在这个四边型之内，如果在这个四边型之外，那可以跳过后面较为复杂的计算，直接返回false。
        if (px <= minX || px >= maxX || py <= minY || py >= maxY) {
            return false;
        }

        let curPoint;
        let nextPoint;
        let c = false;
        for (let i = 0, j = pointLen - 1; i < pointLen; j = i++) {
            curPoint = points[i];
            nextPoint = points[j];
            if ((curPoint.y > point.y) != (nextPoint.y > point.y) && (point.x < (nextPoint.x - curPoint.x) * (point.y - curPoint.y) / (nextPoint.y - curPoint.y) + curPoint.x)) {
                c = !c;
            }
        }
        return c;
    }

    /**
     * 获取最大值
     * @param  {} points
     * @param  {} key
     */
    _getMaxValue(points, key) {
        let newArr = points.map(item => {
            return item[key];
        });
        return Math.max.apply(null, newArr);
    }
    /**
     * 获取最小值
     * @param  {} points
     * @param  {} key
     */
    _getMinValue(points, key) {
        let newArr = points.map(item => {
            return item[key];
        });
        return Math.min.apply(null, newArr);
    }


}
