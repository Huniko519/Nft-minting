const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const fs = require("fs");

const combineImages = async ({imageDatas, resPath}) => {
    var bs64 = await mergeImages(imageDatas, {
        Canvas: Canvas,
        Image: Image
    });
    var bs64 = bs64.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(resPath, bs64, 'base64', (err) => {
        console.log("save error", err);
    })
}

module.exports = {combineImages};
