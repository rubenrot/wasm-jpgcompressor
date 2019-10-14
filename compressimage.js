/**
 * Comprime la imagen usando el WASM, en función de la calidad elegida.
 * @param imgAsArray
 * @param quality
 */
function compressImage(imgAsArray, quality) {
    if (wasm_loaded == false)
        return;

    //Reserva de memoria para operar con el módulo WASM
    var len = imgAsArray.byteLength;
    var buf = Module._malloc(len);
    Module.HEAPU8.set(new Uint8Array(imgAsArray), buf);

    //Se utiliza la función pública del WASM para proceder a su compresión
    var size = Module._jpg_transcode(buf, len, quality);
    //Se reduce la calidad y se comprime
    const compressed = new Uint8Array(size);
    compressed.set(Module.HEAPU8.subarray(buf, buf + size));


    //Tamaño de la imagen. Se setea en su componente del HTML
    sizekb.innerHTML = '' + (size / 1024.0).toFixed(2);

    //Se genera el blob de la nueva imagen comprimida
    var blob = new Blob([compressed], {type: "image/jpeg"});
    var url = window.URL.createObjectURL(blob);
    
    /**
     * //Si queremos hacer que la imagen se descargue automáticamente y luego revocar la url del blob generada
     var a = document.createElement("a");
     document.body.appendChild(a);
     a.style = "display: none";
     a.href = url;
     a.download = 'prueba.jpg';
     a.click();
     window.URL.revokeObjectURL(url);
     *
     */

    //Se establece la nueva imagen comprimida en el tag preparado para ellf
    document.getElementById('imgCompressed').src = url;

    //Liberación del la memoria del módulo.
    Module._free(buf);
}