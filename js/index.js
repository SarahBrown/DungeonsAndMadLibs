// Configuration
madlibCategories = ['noun1', 'animal', 'adj', 'noun2plural', 'place', 'noun3']
story1 = "I'm an NPC! \n Welcome to <%noun1>land! You will find that every citizen has their very own pet <%animal>, and the one assigned to you is especially <%adj>. Every person will find some sentient <%noun2plural> to join them in their quest to <%place>, as decreed by the oracle of <%noun3>. It seems like it's your lucky day, and your quest will begin shortly.";
story2 = "I'm a Narrator! \n Weary traveler! It seems you have lost your way in the forest of <%noun2plural>. If it weren't for your <%adj> <%animal> who roped you into this trip, you wouldn't be in <%place> in the first place! That's alright! You have your wits, your broken <%noun3>, and your trusty <%noun1>, so this should turn out fine."
story3 = "I'm an NPC! \n Howdy stranger! We don't take kindly to <%noun2plural> 'round here... This ain't no <%place> like you're used to. I suggest you mosey on over to the <%adj> shack and meet with the town leader. He's half <%animal>, so you best watch yourself. Once you have his <%noun1>, you'll have access to the wilds beyond the city, where you can continue your quest for the <%noun3>."
stories = [story1, story2, story3]


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
    // TODO select one of the stories based on dice results (random for now)
    story = stories[Math.floor(Math.random() * 3)]

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