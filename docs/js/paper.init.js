// paper.install(window);
//     window.onload = function () {
//         paper.setup('drawingCanvas');

//     let myPath;

//     view.onMouseDown = function(event) {
//         myPath = new Path();
//             myPath.strokeColor = 'black';
//             myPath.strokeWidth = 4;
//     }

//     view.onMouseDrag = function(event) {
//     myPath.add(event.point);
//     // console.log(event)
//     }

//     document.getElementById('clear-drawing').onclick = () => paper.project.activeLayer.removeChildren();
// }

$(function() {
    canvas = window._canvas = new fabric.Canvas('canvas');
    canvas.backgroundColor = '#ffffff';
    canvas.isDrawingMode = 0;
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 10;
    canvas.renderAll();
    //setup listeners 
    canvas.on('mouse:up', function(e) {
        getFrame();
        mousePressed = false
    });
    canvas.on('mouse:down', function(e) {
        mousePressed = true
    });
    canvas.on('mouse:move', function(e) {
        recordCoor(e)
    });
})