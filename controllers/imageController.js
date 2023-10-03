exports.imageDecode = (image, imageName) => {
    const fs = require('fs');
    const base64String = image;
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    try {
        fs.writeFileSync('/container/path/images/' + imageName + '.jpg', imageBuffer);
        console.log('Image saved successfully.');
    } catch (error) {
        console.error('Error saving the image:', error);
    }
}