// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}

// image should be a Uint8Array of raw JPEG binary image data
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

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. grab the name.
    if (files[0]) {
        var f = files[0];
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                var blob = makeBlobUrl(e.target.result);
                document.getElementById('originalImg').src = blob;
                set_blob(blob);
                fileAsArray = e.target.result;
                set_right_array(fileAsArray, "&rarr;&nbsp;Q: " + gQuality);
            };
        })(f);

        // Read in the image file as an array buffer.
        reader.readAsArrayBuffer(f);
    }
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
var qual_text = document.getElementById('qual');

function handleQualityChange(evt) {
    qual.innerHTML = evt.target.value;
    set_jpeg_quality(evt.target.value);
}

document.getElementById('myRange').addEventListener('change', handleQualityChange, false);