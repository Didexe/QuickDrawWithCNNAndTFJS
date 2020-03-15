# Quick draw recognition with CNN and TensorFlowJS

My final project from the Deep Learning module, part of AI course I took at SoftUni.

In this project I am going to use the Quick draw dataset. Quick draw is one of the Google's A.I. experiments - https://quickdraw.withgoogle.com I will first train the model. Then convert it to a tensorflow.js model and then I will create a web application with a canvas drawing space that will recognise the drawing using the generated model.

Here is the application: https://didexe.github.io/quickDrawWithMobileNetAndTFJS/

and the Git repo: https://github.com/Didexe/quickDrawWithMobileNetAndTFJS

link to this notebook on Google CoLab: https://colab.research.google.com/drive/163KILDrDCKGTVhiOU1nwW8MKpQjGfh0i

I first created the web app and tested it using trained models from other people. Then started work on training my models. The idea was to train two different models - one custom CNN and one MobileNet and compare them but as I was using Kaggle and Google Colab the kernels constantly got disconnected and I could not complete the task.
I initially tried to work with the original dataset containing the strokes from the drawings and using CV2 image generator to convert them to images. This was the better approach as the sequence of the strokes could be color coded in the images(first strokes are black and the following get lighter) which could increase the accuracy of the model. But even with the smallest possible image dimensions 64px x 64px x 1channel it could not complete on an image set of around 1 000 000 samples(3000 samples from each of 340 classes)

Here is the link to the initial notebook on Kaggle: https://www.kaggle.com/didexe/quick-draw-recognition-with-cnn

Then I downloaded the images in an .npy format in 28px x 28px and using the custom CNN model with the same number of samples I managed to get some results. As running more than 15 epochs in a row was impossible I took another approach. Running 10 epochs and saving the model and the log. Then using the saved model to train for another 10 etc.
