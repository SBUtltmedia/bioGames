// Game object
var game;
var hash;
var delayFactor = 1;
var criteriaPassed = false;
var userNetID = "";
var firstName = "";
var netID = "";
var logic = {};
// Stats
var stats = {
    modeWins: [0, 0, 0]
    , challengeStates: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
    , unlocks: [false, false, false]
};

function message(text) {

    showOverlay()
    $('#results div,p').css({
        visibility: "hidden"
    });
    var messageBox = $("<div></div>");
    messageBox.attr("id", "messageBox");
    var message = $("<div></div>");
    message.attr("id", "message");
    message.html(text);
    messageBox.append(message);
    var button = $("<div>ok</div>");
    button.attr("id", "button");
    button.attr("class", "rounded stripes endOptionUnlocked");
    messageBox.append(button)
    $('#results').append(messageBox)
    $('#button').on("click", function () {
        $('#messageBox').remove();
        hideMenu();
    });
}
var modes = [
     {
        "title": "Start"
        , "unlockedDescription": "Read the lab manual, then complete the game based on the guided steps."
        , "lockedDescription": "Locked, do something to unlock Mode 1."
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
    stateInit()
    loadSteps();
    loadTubes();
    enterStepObjects();
    game.start();
    updateSteps();
    hideMenu();

    //
}

function stepFunction() {
    var currentStep = game.getCurrentStep();
    currentStep.logic.eventFunction();
}

function jumpToStep(stepName) {
    var whileCount = 0
    var stepList=[];
    var currentStep = ""
    while (game.getCurrentStep().id != stepName && whileCount < 100) {


        criteriaPassed = true;
        currentStep = game.getCurrentStep();


        startStep(currentStep)
        endStep(currentStep)
        whileCount++;
        $('#messageBox').remove();
        stepList.push(game.getCurrentStep().id)
    }
      testMode = false;

   startStep(game.getCurrentStep())
}
/*
    endGame: the "result" parameter should take the value of "win" or "lose"
    when the player wins, call endGame("win"); when they lose, call endGame("lose")
*/
function endGame(result) {
    gameStarted = false;
    postData();
    refreshHighScores();
    // Show the menu
    loadStartMenu(result);
}

function failGame(error, correct) {
    $("#endErrorText1").text("You " + error);
    if (correct == "") {
        if (game.getCurrentStep() != null) {
            $("#endErrorText3").text(game.getCurrentStep().getFeedbackText() + ".");
        }
    }
    else {
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
function highlightObject(highlight,selector) {
  if (highlight){
    animate(selector, 0, "addClass", "highLighted")
  }
  else {
    animate(selector, 0, "removeClass", "highLighted")
  }

}


function startStep(step) {
    window.location.hash= step.id;
    highlightObject(true,step.logic.eventSelector);
    var s = jQuery.extend(true, {}, step);
    var clicked = false;
    $("#headerText").text(s.longText);
    $("#footerText").text(s.bottomText);
    $("#view").off()
    $("#view").on("click", function() {
    updateScore(-1);
    console.log("Score: "+score)
    console.log("Test")});
    var composite = function (evt) {
        evt.preventDefault();
        //console.log(s)
        s.logic.eventFunction(evt)
        if (testMode && s.logic && s.logic.criteria) {
            state[s.logic.criteria.variable] = JSON.parse(JSON.stringify(s.logic.criteria.value)) //returns reference to value, don't touch
        }

        if ((s.logic.criteria && isEqual(state[s.logic.criteria.variable], s.logic.criteria.value)) || !s.logic.criteria) {
          highlightObject(false,step.logic.eventSelector);

            $(s.logic.eventSelector).off()
            if (s.logic.postEventFunction) {
//                console.log(s.logic.postEventFunction)
                s.logic.postEventFunction()
            }
            updateScore(11);
            console.log("Score: "+score)
            game.nextStep()

                //$("#headerText").fadeTo(300, 0.25);
        }
        else if (s.logic.criteria.messageWrong) {
            state[s.logic.criteria.variable] = undefined;
            message(s.logic.criteria.messageWrong);
            //updateScore(-5);
            console.log("Score: "+score)
        }
    }
//    console.log(s)
      $(s.logic.eventSelector).on(s.logic.eventType, composite);

    if (testMode) {
        $(s.logic.eventSelector).trigger(s.logic.eventType);

    }

}

function isEqual(a, b) {
    if (a.length && b.length && a.length == b.length) {
        for (i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }
    return a == b;
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
function loadStartMenu(result) {
    console.log(result)
    if (!result){
        result="Select a game mode to begin.";
    }
    // Set the header text
    $("#headerText").text("DNA Fingerprinting");
    // Set subtext to instructions
    $("#endSubText").text(result);
    // Show subtext
    $("#endSubText").css({
        opacity: 1,
        "visibility": "visibile"
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
    }
    else {
        $("#dataReport").css({
            "opacity": 0
        });
    }
    // High scores
    refreshHighScores();
    showMenu();
}

function refreshHighScores() {

}

function showMenu() {
    showOverlay();
    if (showingChallenges) {
        $("#challengeButton").removeClass("anim_exitChButton");
        $("#challengeButton").addClass("anim_enterChButton2");
    }
    else {
        $("#challengeButton").removeClass("anim_exitChButton");
        $("#challengeButton").addClass("anim_enterChButton");
    }
    $("#challengeScreen").removeClass("anim_exitChallenges");
    $("#challengeScreen").addClass("anim_enterChallenges");
}

function showOverlay() {
    lockModes();
    enableClicks(true);
    // Make overlay visible
    $("#overlay").css({
        'opacity': 1
        , 'z-index': 100
    });
    // Show results screen
    $("#results").removeClass("anim_exitResults");
    $("#results").addClass("anim_enterResults");
    $("#overlayBG").removeClass("anim_fadeOutBG");
    $("#overlayBG").addClass("anim_fadeInBG");
}

function hideMenu() {
    // Make overlay invisible after it fades out
    setTimeout(function () {
        $("#overlay").css({
            'opacity': 0
            , 'z-index': -100
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
    $("#endOptionText" + (1)).text(modes[0].title);
    $("#endOptionDescText" + (1)).text(modes[0].unlockedDescription);
    $("#endOption" + (1)).removeClass("endOptionLocked");
    $("#endOption" + (1)).addClass("endOptionUnlocked");
}

// function unlockMode(i) {
//     // Unlock
//     $("#endOptionDescText" + (i + 1)).text(modes[i].unlockedDescription);
//     $("#endOption" + (i + 1)).removeClass("endOptionLocked");
//     $("#endOption" + (i + 1)).addClass("endOptionUnlocked");
// }

// function lockMode(i) {
//     // Lock
//     $("#endOptionDescText" + (i + 1)).text(modes[i].lockedDescription);
//     $("#endOption" + (i + 1)).removeClass("endOptionUnlocked");
//     $("#endOption" + (i + 1)).addClass("endOptionLocked");
// }
