// global variables
let model;
let canvas;
let coords = [];
let mousePressed = false;

// setup the drawing canvas 
$(function() {
    canvas = window._canvas = new fabric.Canvas('canvas');
    canvas.backgroundColor = '#ffffff';
    canvas.isDrawingMode = 0;
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 10;
    canvas.renderAll();
    // setup listeners 
    canvas.on('mouse:up', function(e) {
        // get predictions on each stroke
        // getPredictions();
        mousePressed = false
    });
    canvas.on('mouse:down', function(e) {
        mousePressed = true
    });
    canvas.on('mouse:move', function(e) {
        recordCoords(e)
    });
})

//record the current drawing coordinates
function recordCoords(event) {
    var pointer = canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;

    if (posX >= 0 && posY >= 0 && mousePressed) {
        coords.push(pointer)
    }
}

//get the best bounding box by trimming around the drawing
function getMinBox() {
    //get coordinates 
    var coorX = coords.map(function(p) {
        return p.x
    });
    var coorY = coords.map(function(p) {
        return p.y
    });

    //find top left and bottom right corners 
    var min_coords = {
        x: Math.min.apply(null, coorX),
        y: Math.min.apply(null, coorY)
    }
    var max_coords = {
        x: Math.max.apply(null, coorX),
        y: Math.max.apply(null, coorY)
    }

    //return as square  
    return {
        min: min_coords,
        max: max_coords
    }
}


// get the current image data from canvas
function getImageData() {
        
        const mbb = getMinBox()

        // get image data according to device dpi 
        const dpi = window.devicePixelRatio
        const imgData = canvas.contextContainer.getImageData(mbb.min.x * dpi, mbb.min.y * dpi,
                                                      (mbb.max.x - mbb.min.x) * dpi, (mbb.max.y - mbb.min.y) * dpi);
        return imgData
    }

// get the prediction 
function getPredictions() {
    // make sure we have at least two recorded coordinates 
    if (coords.length >= 2) {
        // get the image data from the canvas 
        const imgData = getImageData()
        // get the prediction 
        const pred = model.predict(preprocessImage(imgData)).dataSync()
        // find the top 5 predictions 
        const indices = findIndicesOfMax(pred, 5)
        const probs = findTopValues(pred, 5)
        const names = getClassNames(indices)
        highlightWords(names, probs)
    }

}

// get the the class names 
function getClassNames(indices) {
    var outp = []
    for (var i = 0; i < indices.length; i++)
        outp[i] = CATEGORIES[indices[i]]
    return outp
}


// get indices of the top probs
function findIndicesOfMax(inp, count) {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
        outp.push(i); // add index to output array
        if (outp.length > count) {
            outp.sort(function(a, b) {
                return inp[b] - inp[a];
            }); // descending sort the output array
            outp.pop(); // remove the last index (index of smallest element in output array)
        }
    }
    return outp;
}

// find the top 5 predictions
function findTopValues(inp, count) {
    var outp = [];
    let indices = findIndicesOfMax(inp, count)
    // show 5 highest scores
    for (var i = 0; i < indices.length; i++)
        outp[i] = inp[indices[i]]
    return outp
}

// preprocess the data
function preprocessImage(imgData) {
    return tf.tidy(() => {
        // convert to a tensor 
        let tensor = tf.browser.fromPixels(imgData)
        // resize 
        const resized = tf.image.resizeBilinear(tensor, [128, 128]).toFloat()
        // normalize 
        const offset = tf.scalar(255.0);
        const normalized = tf.scalar(1.0).sub(resized.div(offset));
        // add a dimension to get a batch shape 
        const batched = normalized.expandDims(0)
        return batched
    })
}

async function start() {
    // display loader
    $('.loader').css('display', 'block');
    // load the model 
    model = await tf.loadLayersModel('models/myModel/model.json')
    //s how available words to draw
    populateWords();
    // allow drawing on the canvas 
    canvas.isDrawingMode = 1;
    // warm up the model
    setTimeout (function () {
      model.predict(tf.zeros([1, 128, 128, 3])).data()
    }, 0);
}

// clear canvas 
function erase() {
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    coords = [];
    $('span').css('font-size', 14)
}

function populateWords() {
  $('.words').css('display', 'block');
  $('.loader').css('display', 'none');
  $.each(CATEGORIES, (_, word) => {
    $('.words').append($("<span class='word'></span>").text(word + ', '))
  })
}

// increase the font size of the 5 predicted words corresponding to their probability
function highlightWords(top5, probs) {
  let fontSize = 16;
  $.each(top5, (i, word) => {
    let e = 16 + (fontSize - 3*i)
    $('.words').children().filter(
      function () { 
        // if($(this).text() === word + ', ') {
        //   debugger;
        //   let el = $(this);
        //   let tooltipEl = $('<div class="tooltip" id="tooltip' + i + '" role="tooltip">' + probs[i] + '%</div>');
        //   el.append(tooltipEl);
        //   let tooltip = $('#tooltip' + i)
        //   Popper.createPopper(el, tooltip,{
        //     placement: 'top',
        //   });
        // }
        return $(this).text() === word + ', '; }).css('font-size', e )
  })
}

// start after window is loaded
window.onload = function () { 
  this.start();
}