const { combineImages } = require("./modules/generate")
const { upload_IPFS } = require("./modules/ipfs")
const fs = require('fs');

const initDatas = {
    dirs: ["./emoji/body", "./emoji/eye1", "./emoji/eye2", "./emoji/mouth"],
    resImgPath: "./export-images",
    resDataPath: "./exports/hashes.json",
    combineDatas: ["./emoji/back/background.png"],
    index: 0
}

const generate_images = () => {
    var totalCount = 0;
    const generate = async ({ dirs, combineDatas, resImgPath, index }) => {
        if (dirs[index] == null) {
            await combineImages({ imageDatas: combineDatas, resPath: `${resImgPath}/res_${totalCount}.png` });
            totalCount++;
            return;
        }

        const length = fs.readdirSync(dirs[index]).length;
        for (var i = 1; i <= length; i++) {
            await generate({ dirs, combineDatas: combineDatas.concat([`${dirs[index]}/c (${i}).png`]), index: index + 1, resImgPath })
        }
    }
    generate(initDatas);
}

const uploadImages = async () => {
    const upload = async ({ resImgPath, resDataPath }) => {
        const length = fs.readdirSync(resImgPath).length;
        var imageDatas = [];
        for (var i = 0; i < length; i++) {
            imageDatas.push(`${resImgPath}/res_${i}.png`);
        }
        await upload_IPFS({ imageDatas, resPath: resDataPath });
    }

    await upload(initDatas);
}

generate_images();
