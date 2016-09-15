// Get jquery objects from DOM
var imgSelector = $("#my-file-selector");
var refreshbtn = $("#refreshbtn");
var pageheader = $("#page-header")[0];
var pagecontainer = $("#page-container")[0];

refreshbtn.on("click", function () {
    // Load random song based on mood
    alert("You clicked the button"); //can demo with sweetAlert plugin
});

// Manipulate the DOM
function changeUI() {
    //Show detected mood
    pageheader.html("Your mood is: ...");

    //Display song refresh button
    refreshbtn.css("display", "inline");

    //Remove offset at the top
    pagecontainer.css("marginTop", "20px");
};

function processImage(callback) {
    var file = imgSelector.get(0).files[0]; //get(0) is required as imgSelector is a jQuery object so to get the DOM object, its the first item in the object. files[0] refers to the location of the photo we just chose.
     var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file); //used to read the contents of the file
    }
    else {
        console.log("Invalid file");
    }
    reader.onloadend = function () {
        //After loading the file it checks if extension is jpg or png and if it isnt it lets the user know.
        if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
            pageheader.innerHTML = "Only jpg and png images are accepted";
        }
        else {
            //if file is photo it sends the file reference back up
            callback(file);
        }
    };
}


function changeUI() {
    //Show detected mood
    pageheader.innerHTML = "Your age is: " + age;  //Remember currentMood is a Mood object, which has a name and emoji linked to it. 
    //Show mood emoji
 //   var img = document.getElementById("selected-img"); //getting a predefined area on our webpage to show the emoji
  //  img.src = currentMood.emoji; //link that area to the emoji of our currentMood.
  //  img.style.display = "inline"; //just some formating of the emoji's location

}

function sendEmotionRequest(file, callback) {
    var params = {
            // Request parameters
            "returnFaceId": "true",
            "returnFaceLandmarks": "true",
            "returnFaceAttributes": "age,gender",
        };
    $.ajax({
         url: "https://api.projectoxford.ai/face/v1.0/detect?" + $.param(params),
            beforeSend: function(xhrObj) {
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
            if (data.length != 0) { // if a face is detected
                // Get the face attributes
                var faceAttributes = data[0].faceAttributes;
                callback(faceAttributes);
            } else {
                pageheader.innerHTML = "Hmm, we can't detect a human face in that photo. Try another?";
            }
        })
        .fail(function (error) {
            pageheader.innerHTML = "Sorry, something went wrong. :( Try again in a bit?";
            console.log(error.getAllResponseHeaders());
        });
}

function getAge(faceAttributes) {
    var age;
    age = faceAttributes.age;
    return age;
}


        // Register event listeners
imgSelector.on("change", function () {
    pageheader.innerHTML = "Analysing your face now."; //good to let your user know something is happening!
    processImage(function (file) { //this checks the extension and file
        // Get emotions based on image
        sendEmotionRequest(file, function (faceAttributes) { //here we send the API request and get the response
            // Find out most dominant emotion
            age = getAge(faceAttributes);  //this is where we send out scores to find out the predominant emotion
            changeUI(); //time to update the web app, with their emotion!

            //Done!!
        });
    });
});