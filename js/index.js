// Configuration
madlibCategories = ['noun1', 'animal', 'mineral', 'noun2', 'noun3', 'noun4']
story = "Welcome to <%noun1>! We hope you enjoy riding on our pristine <%animal>. We have many <%mineral>'s too!";

// Ignore these pls
socket = null;
madlibResults = {}

function setup() {
    // Stuff to do when page loads

    socket = io('http://localhost:5005');
    socket.on('connect', function(){ console.log("connected" )});
    socket.on('disconnect', function(){ console.log("disconnected") });

    // When we receive dice updates, update the text
    socket.on('receive_dice', function(data){ document.getElementById('diceFromResults').innerHTML = data });
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function continueFirst(event) {
    event.preventDefault();

    var allDone = true;
    madlibCategories.forEach(cat => {
        var catValue = document.getElementById(cat).value;
        if (isEmpty(catValue) || catValue.includes("%")) {
            allDone = false;
        } else {
            madlibResults[cat] = catValue;
        }
    });

    // If all entries are filled
    if (allDone) {
        $("#madlib").fadeOut(300, function() {
            $(this).remove();
            document.getElementById("dicepage").style.visibility="visible";
        });
    }
}

function completeStory() {
    madlibCategories.forEach(cat => {
        story = story.replace("<%" + cat + ">", madlibResults[cat])
    });

    document.getElementById("storyParagraph").innerHTML = story;
}

function continueSecond() {
    // When they continue past the second page
    $("#dicepage").fadeOut(300, function() {
        completeStory();
        $(this).remove();
        document.getElementById("resultspage").style.visibility="visible" 
    });
}

function captureDice() {
    // Request the dice from the dice server
    socket.emit('get_dice');
}