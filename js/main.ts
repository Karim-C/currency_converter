var age: number; // age of user

var imgSelector : HTMLInputElement = <HTMLInputElement> $("#my-file-selector")[0]; 

// listener for the upload picture button
imgSelector.addEventListener("change", function () { 
    pageheader.innerHTML = "Analysing your face now";
    processImage(function (file) { // check that the image is a jpg or png

        sendEmotionRequest(file, function (faceAttributes) { 
            // extract age from recieved data
            age = getAge(faceAttributes); 
            changeUI(); 
        });
    });
});

var pageheader = $("#page-header")[0];
var pagecontainer = $("#page-container")[0]; 
var refreshbtn = $("#refreshbtn")[0]; 
function changeUI() : void {
    pageheader.innerHTML = "You are " + age + " years old";  
    refreshbtn.style.display = "inline";
}

refreshbtn.addEventListener("click", function () {
    alert("Thank you. Your feedback has been sent to /dev/null"); 
});

function processImage(callback) : void {
    var file = imgSelector.files[0];  
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file); 
    } else {
        console.log("Invalid file");
    }
    reader.onloadend = function () { 
        if (!file.name.match(/\.(jpg|jpeg|png)$/)){
            pageheader.innerHTML = "Please upload an image file (jpg or png).";
        } else {
            callback(file);
        }
    }
}

function sendEmotionRequest(file, callback) : void {
        var params = {
            // Request parameters
            "returnFaceId": "true",
            "returnFaceLandmarks": "true",
            "returnFaceAttributes": "age,gender",
        };
    $.ajax({
        url: "https://api.projectoxford.ai/face/v1.0/detect?" + $.param(params),
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "dd2587080bf44ca69a5c240f2f9169b4");
        },
        type: "POST",
        data: file,
        //data: "{\"url\": \"http://pngimg.com/upload/face_PNG5660.png\"}",
        processData: false
    })
        .done(function (data) {
            if (data.length != 0) { // empty meaans no face detected
                var faceAttributes = data[0].faceAttributes;
                callback(faceAttributes);
            } else {
                pageheader.innerHTML = "A human face was not detected. Please try uploading another photo. ";
            }
        })
        .fail(function (error) {
            pageheader.innerHTML = "An error occured, please try again later";
            console.log(error.getAllResponseHeaders());
        });
}

function getAge(faceAttributes : any) : number {
    var age: number = faceAttributes.age;
    return age;

}






