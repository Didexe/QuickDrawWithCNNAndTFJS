let model;

async function app() {
  console.log('Loading model..');

  // Load the model.
  model = await tf.loadLayersModel('./models/model.json');
  console.log('Successfully loaded model');

  // Make a prediction through the model on our image.
}

app();

function convertDrawingToImg() {
  let image = document.getElementById('predict-image');
  let canvas = document.getElementById('drawingCanvas');
  image.src = canvas.toDataURL();
  image.style.width = "128px";
  image.style.height = "128px";
  image.style.display = "block";
  return image;
}

async function classifyImage(image = convertDrawingToImg()) {
  const tensor = tf.browser.fromPixels(image)
  .toFloat()
  .expandDims();

  const result = await model.predict(tensor);
  console.log(result);
}