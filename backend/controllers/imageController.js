exports.imageDecode= (image,imageName) => {
    const fs = require('fs');
    const base64String = image;
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    // Save the buffer as an image file
    fs.writeFileSync('./images/'+imageName+'.jpg', imageBuffer);
}