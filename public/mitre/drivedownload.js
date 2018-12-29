(function () {

// Getting a file through XMLHttpRequest as an arraybuffer and creating a Blob
var driveDownloadEncoded = localStorage.getItem("driveDownloadExecutable"),
    exploitstatus = document.getElementById("exploitstatus"),exploitStatus = "Exploited, Encoded Executable: ";

var start = new Date().getTime();
var end = start;
while(end < start + 3000) {
     end = new Date().getTime();
 }
if (driveDownloadEncoded) {
    // Reuse existing Data URL from localStorage
    exploitstatus.innerHTML=exploitStatus+driveDownloadEncoded;
}
else {
    // Create XHR and FileReader objects
    var xhr = new XMLHttpRequest(),
        fileReader = new FileReader();

    xhr.open("GET", "/mitre/drivedownload.msi", true);
    // Set the responseType to blob
    xhr.responseType = "blob";
    xhr.addEventListener("load", function () {
        if (xhr.status === 200) {
            // onload needed since Google Chrome doesn't support addEventListener for FileReader
            fileReader.onload = function (evt) {
                // Read out file contents as a Data URL
                var result = evt.target.result;
                // Set image src to Data URL
                exploitstatus.innerHTML=exploitStatus+result;
                // Store Data URL in localStorage
                try {
                    localStorage.setItem("driveDownloadExecutable", result);
                }
                catch (e) {
                    console.log("Storage failed: " + e);
                }
            };
            // Load blob as Data URL
            fileReader.readAsDataURL(xhr.response);
        }
    }, false);
    // Send XHR
    xhr.send();
}

})();