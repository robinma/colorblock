/**
 * @获取面信息 a - b 操作
 */

// import Gpc from './gpc';

let PolyDefault = gpcas.geometry.PolyDefault;

export default class PolygonDiff {
    constructor(blockDatas, currPolygon) {
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
    getPolygon() {
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

    _initDefPolygon(p1, p2) {
        let self = this;
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
    _diffAllPolygon(blockPolygons, curPoly) {
        let self = this;
        let diffPoly = [curPoly];
        let poly1;
        let poly2;
       
        blockPolygons.map((polygons, index) => {
            polygons.polygons.map((pitem, pindex) => {
                let diffPolySem = [];
                diffPoly.map((ditem, dindex) => {
                    poly1 = self._createPoly(self._getTempPolygon(pitem));
                    poly2 = self._createPoly(self._getTempPolygon(ditem));
                    let diffPoly = self._diffPolygon(poly1, poly2);
                    diffPolySem = diffPolySem.concat(diffPoly);
                });

                diffPoly = diffPolySem;

            })
        });

        self.defPolygon = self.defPolygon.concat(diffPoly);
    }


    _diffPolygon(poly1, poly2) {
        let self = this;
        let diffPolygon = poly2.difference(poly1);
        let points = this._getPolygons(diffPolygon);
        return points;
    }

    
    /**
     * 返回操作后的面数据，有n个
     * @param  {} polygon
     */
    _getPolygons(polygon) {
        let self = this;
        var count = polygon.getNumInnerPoly();
        let tempPolygon = [];
        for(var i = 0; i < count; i++) {
            var poly = polygon.getInnerPoly(i);
		    var vertices  = self._getPolygonVertices(poly);
            let points = vertices.map((item, index) => {
                return {
                    lat: item[0] / 1000000,
                    lng: item[1] / 1000000
                }
            });
            points.push(points[0]);
            tempPolygon.push(points);
        }
        return tempPolygon;
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
     * 创数点数组信息
     * @param  {} points
     */
    _createPoly(points) {
        let res = new PolyDefault();
        points.map((item, index) => {
            res.addPoint(new Point(item.x, item.y))
            // res.addPoint(new Point(points[i][0],points[i][1]));
        });
        return res;
    }

    
    /**
     * 获取所有点
     * @param  {} poly
     */
    _getPolygonVertices(poly) {
        var vertices=[];
        var numPoints = poly.getNumPoints();
        var i;
        
        for(i=0;i<numPoints;i++) {
            vertices.push([poly.getX(i) , poly.getY(i)]);
        }
        return vertices;
    }

}

// point
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}