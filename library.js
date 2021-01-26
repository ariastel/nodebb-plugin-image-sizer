function appendPx(size) {
    return size.endsWith("px") || size.endsWith("%")
        ? size
        : `${size}px`;
}

function staticSizeReplacer(match, src, width, height) {

    if (!width && !height) {
        return match;
    }

    const additional = [];
    if (width) {
        additional.push(`width="${appendPx(width)}"`);
    }
    if (height) {
        additional.push(`height="${appendPx(height)}"`);
    }

    return `<img src="${src}" ${additional.join(" ")}`;
}

function sizeImages(content) {
    const staticSizeRegex = /<img src="([^@]*)@([0-9]*(?:px|%)?)x?([0-9]*(?:px|%)?)"/g;
    return content.replace(staticSizeRegex, staticSizeReplacer);
}

const ImageSizerPlugin = {};

ImageSizerPlugin.parsePost = function (data, callback) {
    const newData = { ...data };
    newData.postData.content = sizeImages(data.postData.content);
    callback(null, newData);
}

ImageSizerPlugin.parseRaw = function (data, callback) {
    callback(null, sizeImages(data));
};

module.exports = ImageSizerPlugin;