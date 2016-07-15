// init map

var map = new BMap.Map('mapWarp');

var pt = new BMap.Point(116.404, 39.915);

map.centerAndZoom(pt, 16);

map.enableScrollWheelZoom();//开启滚动缩放
map.enableContinuousZoom();//开启缩放平滑

// 百度地图API功能
// var map = new BMap.Map('map');
// var poi = new BMap.Point(116.307852, 40.057031);
// map.centerAndZoom(poi, 16);
map.enableScrollWheelZoom();


var styleOptions = {
    strokeColor: ['#fd3e73', '#ff6626', '#545d7c', '#b7db61', '#b775af', '#e2443f', '#ffe56e', '#79cce6'],
    fillColor: ["rgba(255,94,94,0.5)", 'rgba(255,101,37,0.5)', 'rgba(84,93,124,0.5)', 'rgba(183,219,97,0.5)', 'rgba(183,117,175,0.5)', 'rgba(226,68,63,0.5)', 'rgba(255,229,110,0.5)', 'rgba(121,204,230,0.5)'],
    strokeWeight: 3,  //边线的宽度，以像素为单位。
}
var colorBlock = new BMapLib.ColorBlock(map, {
    enableDrawingTool: true,
    polygonOptions: styleOptions
});



