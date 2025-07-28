// Game object
var game;

var UNLOCK_EVERYTHING = false;

var currentZoom = 1;

var userNetID = "";
var firstName = "";

var netID = "";

// Stats
var stats = {
    modeWins: [0, 0, 0],
    challengeStates: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    unlocks: [false, false, false]
};

var modes = [
    {
        "title": "Mode 1",
        "unlockedDescription": "Mode 1 description",
        "lockedDescription": "Locked, do something to unlock Mode 1."
    },
    {
        "title": "Mode 2",
        "unlockedDescription": "Mode 2 description",
        "lockedDescription": "Locked, do something to unlock Mode 2."
    },
    {
        "title": "Mode 3",
        "unlockedDescription": "Mode 3 description",
        "lockedDescription": "Locked, do something to unlock Mode 3."
    }
];


// Set this to true to enable step skipping: click the active step object to complete it
var skipEnabled = false;

/* 
    newGame: this function is called to start a new game with the specified parameters
    you can specify whatever parameters you like in the "props" object (current game mode, etc)
    also specify code that should be run when a new game starts
*/
function newGame(props) {
    // Create a new game object
    game = new Game(props);
    loadSteps();
    enterStepObjects();
    game.start();
    updateSteps();
    hideMenu();
}

/* 
    endGame: the "result" parameter should take the value of "win" or "lose"
    when the player wins, call endGame("win"); when they lose, call endGame("lose")
*/
function endGame(result) {
    gameStarted = false;
    // Show scores
    $("#endScoreBox").css({
        opacity: 1
    });
    // If the player wins
    if (result == "win") {
        $("#endText").text("Great Success");
        $("#endSubText").css({
            opacity: 1
        });
        $("#endSubText").text("You won the game. Great job!");
        $(".endErrorText").css({
            opacity: 0
        });
        $("#endScoreBox").css({
            opacity: 0
        });
        // Check for high scores
        if (props.mode == 1) {
            studentData.unlocks[0] = true;
        } else if (props.mode == 2) {
            studentData.unlocks[1] = true;
        } else if (props.mode == 3) {
            studentData.unlocks[2] = true;
        }
    }
    // If the player loses
    else if (result == "lose") {
        $("#endText").text("Absolute Failure");
        $("#endSubText").css({
            opacity: 0
        });
        $(".endErrorText").css({
            opacity: 1
        });
    }
    exitStepObjects();
    checkChallenges();
    postData();
    refreshHighScores();
    // Show the menu
    showMenu();
}

function failGame(error, correct) {
    $("#endErrorText1").text("You " + error);
    if (correct == "") {
        if (game.getCurrentStep() != null) {
            $("#endErrorText3").text(game.getCurrentStep().getFeedbackText() + ".");
        }
    } else {
        $("#endErrorText3").text(correct + ".");
    }
    if (game.getCurrentStep() != null) {
        game.getCurrentStep().fail();
    }

}

/* 
    startStep: this function is called whenever a step starts
    this is the "set-up" phase for a particular step
    specify code that should be executed when a step starts (animations, etc)
*/
function startStep(step) {

}

/* 
    endStep: this function is called whenever a step ends
    this is the "clean-up" phase for a particular step
    specify code that should be executed when a step ends (animations, etc)
*/
function endStep(step) {

}

/*
    loadStartMenu: this function shows the menu at the start of the game
*/
function loadStartMenu() {
    // Set the header text
    $("#headerText").text("Blank Game");
    // Set end text to welcome message
    $("#endText").text(studentData.gameRecord.length > 0 ? "Welcome back!" : "Hello there!");
    // Set subtext to instructions
    $("#endSubText").text("Select a game mode to begin.");
    // Show subtext
    $("#endSubText").css({
        opacity: 1
    });
    // Hide error text
    $(".endErrorText").css({
        opacity: 0
    });
    // Show data report if user is admin
    if (isAdmin(userNetID)) {
        $("#dataReport").css({
            "opacity": 1
        });
    } else {
        $("#dataReport").css({
            "opacity": 0
        });
    }
    // High scores
    refreshHighScores();
    showMenu();
}

function refreshHighScores() {
    for (var i = 0; i < 3; i++) {
        if (studentData.unlocks[i]) {
            $("#scoreBox" + (i + 1)).text("Completed.");
        } else {
            $("#scoreBox" + (i + 1)).text("");
        }
    }
}

function showMenu() {
    lockModes();
    enableClicks(true);
    // Make overlay visible
    $("#overlay").css({
        'opacity': 1,
        'z-index': 100
    });
    // Show results screen
    $("#results").removeClass("anim_exitResults");
    $("#results").addClass("anim_enterResults");
    $("#overlayBG").removeClass("anim_fadeOutBG");
    $("#overlayBG").addClass("anim_fadeInBG");
    if (showingChallenges) {
        $("#challengeButton").removeClass("anim_exitChButton");
        $("#challengeButton").addClass("anim_enterChButton2");
    } else {
        $("#challengeButton").removeClass("anim_exitChButton");
        $("#challengeButton").addClass("anim_enterChButton");
    }
    $("#challengeScreen").removeClass("anim_exitChallenges");
    $("#challengeScreen").addClass("anim_enterChallenges");
}

function hideMenu() {
    // Make overlay invisible after it fades out
    setTimeout(function () {
        $("#overlay").css({
            'opacity': 0,
            'z-index': -100
        });
    }, 500);
    // Hide results screen
    $("#results").removeClass("anim_enterResults");
    $("#results").addClass("anim_exitResults");
    $("#overlayBG").removeClass("anim_fadeInBG");
    $("#overlayBG").addClass("anim_fadeOutBG");
    $("#challengeButton").removeClass("anim_enterChButton");
    $("#challengeButton").removeClass("anim_enterChButton2");
    $("#challengeButton").addClass("anim_exitChButton");
    $("#challengeScreen").removeClass("anim_enterChallenges");
    $("#challengeScreen").addClass("anim_exitChallenges");
}

function lockModes() {
    for (var i=0; i<3; i++) {
        $("#endOptionText" + (i+1)).text(modes[i].title);
    }
    unlockMode(0);
    for (var i = 1; i < 3; i++) {
        if (studentData.unlocks[i - 1] || UNLOCK_EVERYTHING) {
            unlockMode(i);
        } else {
            lockMode(i);
        }
    }
}

function unlockMode(i) {
    // Unlock
    $("#endOptionDescText" + (i + 1)).text(modes[i].unlockedDescription);
    $("#endOption" + (i + 1)).removeClass("endOptionLocked");
    $("#endOption" + (i + 1)).addClass("endOptionUnlocked");
}

function lockMode(i) {
    // Lock
    $("#endOptionDescText" + (i + 1)).text(modes[i].lockedDescription);
    $("#endOption" + (i + 1)).removeClass("endOptionUnlocked");
    $("#endOption" + (i + 1)).addClass("endOptionLocked");
}