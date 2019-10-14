// Se comprueba si el navegador soporta la API de ficheros..
if (window.File && window.FileReader && window.FileList && window.Blob) {
    // API soportada
} else {
    alert('La File APIs no está soportada en este navegador.');
}

/**
 * Crea un blob a partir de un objeto imagen.
 * @param image should be a Uint8Array of raw JPEG binary image data
 * @returns {string|null}
 */
function makeBlobUrl(image) {
    var blob;

    if (typeof (URL) !== 'undefined') {
        blob = new Blob([image], {type: "image/jpeg"});
        return URL.createObjectURL(blob);
    } else if (webkitURL) {
        blob = new Blob([image.buffer], {type: "image/jpeg"});
        return webkitURL.createObjectURL(blob);
    } else {
        return null;
    }
}

var fileAsArray = undefined;

/**
 * Manejador del evento cuando se selecciona una Imagen
 * @param evt
 */
function handleFileSelect(evt) {
    var files = evt.target.files; // Objeto FileList

    // files es un FileList de un objeto File.
    if (files[0]) {
        var f = files[0];
        var reader = new FileReader();
        // Se captura la información del archivo.
        reader.onload = (function () {
            return function (e) {
                //Se traduce la imagen a una url para poderla manipular en el HTML
                var blob = makeBlobUrl(e.target.result);
                //Se establece la imagen original
                document.getElementById('originalImg').src = blob;
                fileAsArray = e.target.result;
                compressImage(fileAsArray, '50');
            };
        })(f);

        document.getElementById("slider-container").style.display = "block";
        document.getElementById("cards-container").style.display = "block";
        document.getElementById("qual").innerHTML = '50';
        //document.getElementById("courtain").classList.add("closed");

        // Read in the image file as an array buffer.
        reader.readAsArrayBuffer(f);
    }
}

function handleQualityChange(evt) {
    //Se muestra el valor seleccionado en el HTML
    qual.innerHTML = evt.target.value;
    // evt.target.value - quality
    compressImage(fileAsArray, evt.target.value);
}

//Se atachan los eventos al Selector de Archivos (para la imagen jpg) y el Slider (para la selección de la calidad del archivo)
document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById('myRange').addEventListener('change', handleQualityChange, false);