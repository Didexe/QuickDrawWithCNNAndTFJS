paper.install(window);
    window.onload = function () {
        paper.setup('drawingCanvas');

    let myPath;

    view.onMouseDown = function(event) {
        myPath = new Path();
            myPath.strokeColor = 'black';
            myPath.strokeWidth = 4;
    }

    view.onMouseDrag = function(event) {
    myPath.add(event.point);
    }
    
    document.getElementById('clear-drawing').onclick = () => paper.project.activeLayer.removeChildren();
}