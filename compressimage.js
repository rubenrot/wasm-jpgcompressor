var urlfile;

var gQuality = 5;

function set_blob(blob) {
    urlfile = blob;
}

function set_right_array(imgAsArray, name) {
    if (wasm_loaded == false)
        return;
    var len = imgAsArray.byteLength;
    var buf = Module._malloc(len);

    Module.HEAPU8.set(new Uint8Array(imgAsArray), buf);

    var size = Module._jpg_transcode(buf, len, gQuality);
    console.log('size', size);

    //Se reduce la calidad pero no se comprime
    //var result = new Uint8Array(Module.HEAPU8.buffer, buf, len);
    //console.log('result', result);

    //urlfile = makeBlobUrl(result);
    //console.log('urlfile', urlfile);

    sizekb.innerHTML = "" + (size / 1024.0).toFixed(2);

    //Se reduce la calidad y se comprime
    const compressed = new Uint8Array(size);
    compressed.set(Module.HEAPU8.subarray(buf, buf + size));

    console.log('compressed', compressed);


    var blob = new Blob([compressed], {type: "image/jpeg"}),
        url = window.URL.createObjectURL(blob);


    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = 'prueba.jpg';
    //a.click();
    //window.URL.revokeObjectURL(url);

    console.log('url', url);
    document.getElementById('imgCompressed').src = url;

    Module._free(buf);
}

function set_jpeg_quality(quality) {
    gQuality = quality;
    set_right_array(fileAsArray, "&rarr;&nbsp;Q:&nbsp;" + quality);
}

