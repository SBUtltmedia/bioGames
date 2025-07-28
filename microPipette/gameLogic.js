var ENABLE_CHALLENGE = true;

var leftLiquidHeight = 75; // Keep this here or it breaks
var rightLiquidHeight = 10;

var stageLeft = 0;
var stageTop = 0;
var stageWidth = 0;
var stageHeight = 0;
var pipetteType;

// Variables that are saved using the php file
var hintScore = 0;
var noHints10 = false;
var noHints100 = false;
var noHints1000 = false;
var challengeScore = 0;

var noHintsPipette = 0;

var overlayAnimIn = false;

var hintsSpeed = false;
var noHintsSpeed = false;
var challengeSpeed = false;

var clicks = 0;

var startTime;
var endTime;

var enableAltControls = true;

// Stats
var stats = {
    hintScore: 0,
    noHints10: false,
    noHints100: false,
    noHints1000: false,
    challengeScore: 0,
    time: "",
    hintsWins: 0,
    noHintsWins: 0,
    challengeWins: 0,
    transferred: 0,
    pipetteCapacityWins: [0, 0, 0],
    pipetteTypeWins: [0, 0],
    challengeStates: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
};

if (window.location.href.indexOf("research") != -1) pipetteType = "research";
else pipetteType = "reference";

pipetteType = "research";

var plungerTopFloat;
// Called when game is started.
$(function () {
    hintScore = 0;
    $.ajax({
        url: "info.php",
        dataType: "json"
    }).done(function (data) {
        //showTitle = false; //Turned off tutorial for now
        //        hintScore = data.hintScore;
        //        if (hintScore == undefined) hintScore = 100;
        //        noHints10 = (data.noHints10 == "true");
        //        noHints100 = (data.noHints100 == "true");
        //        noHints1000 = (data.noHints1000 == "true");
        //        challengeScore = data.challengeScore;

        netID = data.name;
        firstName = data.firstname;
        getStats = data.stats;
        // Special Case
        if (Object.keys(getStats).length == 0) {
            // New file
            // //console.log("new file");
            postData();
        } else {
            stats = getStats;
            // //console.log("not a new file");
            // //console.log(stats);
        }
        hintScore = stats.hintScore;
        noHints10 = stats.noHints10;
        noHints100 = stats.noHints100;
        noHints1000 = stats.noHints1000;
        challengeScore = stats.challengeScore;

        if (hintScore < 75) {
            loadTitle();
            setPipette();
            newGame(true, false);
        } else {
            showTitle = false;
            $("#title").css({
                'z-index': -1000,
                'opacity': 0
            });
            setPipette();
            returnMenu();
        }
        continueLoading();

    }).fail(function () {
        continueLoading();
        startOffline();
    });
});

function continueLoading() {
    loadAllPlayerData();
    // Prep challenges last?
    prepChallenges();
    loadEvents();
    $(".cellSelected").hover(function (e) {
        // Mouse over cell
        var id = betterParseInt($(e.target).attr('id'));
        if ($(e.target).attr('id') == "viewLeaderboardSelected") {
            id = 100;
        }
        setCurrentChallenge(id);
        if (id != 100) {
            // Mark challenge as not new
            challenges.getChallenge(id).setAsNew(false);
        }
        $("#currentChallenge").css({
            "opacity": 1
        });
    }, function () {
        // Leave cell
        $("#currentChallenge").css({
            "opacity": 0
        });
    });
    resizeWindow();
    requestAnimationFrame(animate);
    updateLiquids(leftLiquidHeight, rightLiquidHeight);
}


function loadAllPlayerData() {
    $.ajax({
        url: "info_allScores.php",
        dataType: "json"
    }).done(function (data) {
        allPlayerData = data;
        ////console.log(data);
        processAllPlayerData();
    }).fail(function () {
        //startOffline();
    });
}

// COMMENTSSSSSS

function startOffline() {
    //console.log("Starting in offline mode.");
    netID = "Jim";
    firstName = "Jim";
    showTitle = false; //Turned off tutorial
    hintScore = 100;
    noHints10 = true;
    noHints100 = true;
    noHints1000 = true;
    challengeScore = 0;
    // C H E A T B O Y S
    challengeHighScores = [];
    for (var i = 0; i < 99; i++) {
        var obj = new Object();
        obj.name = "Phil";
        obj.score = Math.floor(1000 * Math.random());
        challengeHighScores.push(obj);
    }
    var obj = new Object();
    obj.name = "Jim";
    obj.score = Math.floor(1000 * Math.random());
    challengeHighScores.push(obj);
    ////console.log(challengeHighScores);
    processAllPlayerData();
    if (hintScore < 75) {
        loadTitle();
        newGame(true, false);
    } else {
        showTitle = false;
        $("#title").css({
            'z-index': -1000,
            'opacity': 0
        });
        returnMenu();
    }
    setPipette();
}

function setPipette() {
    if (pipetteType == "research") {
        $("#zoomPipette").removeClass("referencePipette");
        $("#zoomPipette").addClass("researchPipette");
        $("#dials").removeClass("referenceDials");
        $("#dials").addClass("researchDials");
        $(".dial").removeClass("referenceDial");
        $(".dial").addClass("researchDial");
        $(".dialHint").removeClass("referenceDialHint");
        $(".dialHint").addClass("researchDialHint");
        $(".hint_num").removeClass("referenceHintNum");
        $(".hint_num").addClass("researchHintNum");
        $("#hints").removeClass("referenceHints");
        $("#hints").addClass("researchHints");
        $(".zoom_dial_num").removeClass("referenceZoomDialNum");
        $(".zoom_dial_num").addClass("researchZoomDialNum");
        $("#pipeBody").attr("src", "img/pipette_research_new.svg");
        $("#ejectPlunger").css("opacity", 1);
        $("#pipetteDials").css({
            opacity: 1
        });
        $("#stateButton3Text").text("Eject ____");
    } else if (pipetteType == "reference") {
        $("#zoomPipette").removeClass("researchPipette");
        $("#zoomPipette").addClass("referencePipette");
        $("#dials").removeClass("researchDials");
        $("#dials").addClass("referenceDials");
        $(".dial").removeClass("researchDial");
        $(".dial").addClass("referenceDial");
        $(".dialHint").removeClass("researchDialHint");
        $(".dialHint").addClass("referenceDialHint");
        $(".hint_num").removeClass("researchHintNum");
        $(".hint_num").addClass("referenceHintNum");
        $("#hints").removeClass("researchHints")
        $("#hints").addClass("referenceHints");
        $(".zoom_dial_num").removeClass("researchZoomDialNum");
        $(".zoom_dial_num").addClass("referenceZoomDialNum");
        $("#refColor").removeClass("researchColor");
        $("#refColor").addClass("referenceColor");
        $("#pipeBody").attr("src", "img/pipette_reference.svg");
        $("#ejectPlunger").css("opacity", 0);
        $("#pipetteDials").css({
            opacity: 0
        });
        $("#stateButton3Text").text("Third Stop");
    }
}
var pipetteVolumes = [
            10,
            100,
            1000
        ];
var minCapacity = [
            0.5,
            10,
            100
        ];
var sleeveLabels = {
    "img/pipette_tip_1.png": "0.5-10μL",
    "img/pipette_tip_2.png": "10-100μL",
    "img/pipette_tip_3.png": "100-1000μL"
};
var sleeveLabelsNum = {
    "img/pipette_tip_1.png": 0,
    "img/pipette_tip_2.png": 1,
    "img/pipette_tip_3.png": 2
};
var topLabels = {
    "img/pipetteTopOne.svg": pipetteVolumes[0] + "μL",
    "img/pipetteTopTwo.svg": pipetteVolumes[1] + "μL",
    "img/pipetteTopThree.svg": pipetteVolumes[2] + "μL"
};

var dialStyle = [
    {
        "num_1": "#ffffff",
        "num_2": "#ffffff",
        "num_3": "#ffffff",
        "num_4": "#ffffff"
    },
    {
        "num_1": "#ffffff",
        "num_2": "#ffffff",
        "num_3": "#ffffff",
        "num_4": "#ffffff"
    },
    {
        "num_1": "#ffffff",
        "num_2": "#ffffff",
        "num_3": "#ffffff",
        "num_4": "#ffffff"
    }
]


var topLabelsNum = {
    "img/pipetteTopOne.svg": 0,
    "img/pipetteTopTwo.svg": 1,
    "img/pipetteTopThree.svg": 2
};

var positionLabel = [
            "Resting State",
            "First Stop",
            "Second Stop",
            "Third Stop"
        ];
var dialDigits = 4;
var wheelHeight = 0;
var slowPlungerSpeed = 900;
var plungerTopFloat;
var plungerRange = 11;
var plungerState = 0;
var plungerSpeed = 30;
var totalPlungerStates = 3; //don't change number of states
var currentPlungerSpeed = plungerSpeed;
var beakerLeft = 129;
var beakerRight = 219;
var liquidHeight = 29;

// Left and right flask volumes (aka liquid height)
var fluidHeightL = 1000; // Starts with 1000 µl, max capacity is 1500 µl.
var fluidHeightR = 500; // Starts with 500 µl, max capacity is also 1500 µl.
var MAX_FLUID = 1500; // Max capacity
var visGoalHeight = 0;

// Position of draggable area
var draggableLeft = 0;
var draggableTop = 0;

// Game state variable
/*
    pickType: User must choose a type of pipette: research or reference
    pickTop: User must choose a top
    dial: User must set dials to correct numbers
    sleeve: User must choose a sleeve before using the pipette
    middle: User must set plunger to middle position before dipping pipette into liquid
    insert: User must insert plunger sleeve into liquid (left beaker)
    top: User must set plunger to rest (top) state
    move: User must move pipette sleeve to the opening of the right beaker
    bottom: User must set plunger to bottom position, expelling liquid
    complete: User has completed the task.
*/
var gameState = "";

// Variable that stores whether the user has taken an incorrect action
var errors = "";
/*
	
*/
var errorFlash = 0;
var overlayOpacity = 0;
var resultTop = 1000;

// Variable that stores the current game mode.  Guided: players are given specific instructions and cannot proceed to the next game state until the current mini-objective is fulfilled.  Not guided: players are given no instructions and are only congratulated upon completion of the task and told when their pipette breaks.
var guidedMode = true;

// Variable that stores whether challenge mode is enabled.  If enabled, the player can use multiple pipettors to transfer a larger amount of liquid (typically 2000 - 3000 µL) with .01 µL accuracy.  This is for the leaderboards!
var challengeMode = false;
var challengeRound = 0;

// Show hint bubbles next to dials?
var showHintBubbles = false;
var hintBubbleOpacity = 0;

// Has the user won yet?
var gameEnd = false;
var optionChosen = false;

// Show title screen? Defaults to true
var showTitle = true;

// The user's score
var score = 0;
// Mistakes made
var mistakes = [0, 0, 0, 0, 0, 0, 0];

// The user's high score and challenge high score; sync this using Shibboleth
var highScore = 0;
var challengeHighScore = 0;

var allPlayerData = [];
var sortedPlayerData = [];

var lbPage = 0;

// The user's NetID and first name
var netID = "";
var firstName = "";

// Frame/animation variables
var frames = 0;
var alertOpacity = 0;
var titleOpacity = 1;

// Desired amount of liquid to be transferred, in microliters
var goalAmount = 2;
// The correct sleeve that should be clicked.
var correctSleeve = 0;
// The correct end states of the dials
var goalDials = [0, 0, 0, 0];

// Challenge mode only
var inPipette = 0;
var transferred = 0;
var pipettesUsed = 0;

var PIPETTE_STOPS = 3; // Number of stops the pipette has, 2 or 3

// The values of the numeric displays on the pipette.
var pipetteDisplay = [0, 0, 0, 0];
////console.log(pipetteDisplay)
// The pipette and tip that have been selected
var selectedPipette = 0;
var selectedTip = 0;

// Is the pipette in liquid?
var pipetteInLiquid = false;

// Can the tip be ejected into the trash?
var canEject = false;

// Tip eject animation
var tipFalling = false;
var tipTop;

// Title screen functionality
var showTitle = true; // Show the title screen or not?
var currentSlide = 0; // Slide that the user is currently on
var TOTAL_SLIDES = 6; // Constant, don't change this in code!
var slidePositions = [25, 75, 125, 175, 225, 275]; // Positions of slides (in percent)
var buttonLeftOpacity = 0;
var buttonRightOpacity = 1;

var outOfOrderMistake = false;

var slideText = [
            "In this game, you are tasked with transferring a specific amount of liquid from one tube to another.",
            "Follow the step-by-step instructions to complete the task.",
            "Complete the task with 75% accuracy or higher, and you can play without hints.",
            "In no-hints mode, you lose if you make a single mistake!",
            "Complete the task without hints to win the game!",
            "Click the center of the screen to begin!"
        ];

var showFeedback = false;

function oIndexOf(mObject, value) {
    var index = 0
    for (var key in mObject) {
        if (key == value) return index;
        index++;
    }
}



// Updates the level of the liquids
function updateLiquids(l, r) {
    // Old liquids for beakers (keeping in case we need to revert for some reason)
    $("#liquidLeft").css({
        height: l + "%",
        top: (100 - l) + "%",
    });
    $("#liquidRight").css({
        height: r + "%",
        top: (100 - r) + "%",
    });
    // New liquids for tubes
    $("#tubeFluidL").css({
        height: (100 * fluidHeightL / MAX_FLUID) + "%",
        top: (100 - (100 * fluidHeightL / MAX_FLUID)) + "%",
    });
    $("#tubeFluidR").css({
        height: (100 * fluidHeightR / MAX_FLUID) + "%",
        top: (100 - (100 * fluidHeightR / MAX_FLUID)) + "%",
    });
}

// Check to see if the dials are adjusted correctly
function checkDials() {
    var isCorrect = true;
    if (selectedPipette != correctSleeve) isCorrect = false;

    for (var i = 0; i < goalDials.length; i++) {
        if (goalDials[i] != pipetteDisplay[i])
            isCorrect = false;
    }
    if (guidedMode) {
        if (isCorrect) {
            gameState = "sleeve";
            // TODO: remove this later
            //gameState = "insert";
            errors = "";
            updateText();
            showHintBubbles = false;
        }
    } else {
        if (isCorrect) {
            //winGame();
            gameState = "waste";
        } else if (!challengeMode) {
            loseGame("Incorrect amount of solution transferred.");
        }
    }
}

function getPipetteVolume() {
    var total = 0;
    for (var i = 0; i < 4; i++) {
        total += pipetteDisplay[i] * Math.pow(10, 3 - i);
    }
    total *= Math.pow(10, selectedPipette - 2);
    return total;
}

// Starts a new game.
function newGame(mode, challenge) {
    checkChallengeEnabled();
    guidedMode = mode;
    challengeMode = challenge;
    challengeRound = 0;
    pipettesUsed = 0;
    clicks = 0;
    // Reset game state and update text
    leftLiquidHeight = 75;
    rightLiquidHeight = 10;

    if (challengeMode) {
        MAX_FLUID = 3000; // Max capacity
        fluidHeightL = 2000; // Starts with 1000 µl, max capacity is 1500 µl.
        fluidHeightR = 1000; // Starts with 500 µl, max capacity is also 1500 µl.
    } else {
        MAX_FLUID = 1500;
        fluidHeightL = 1000; // Starts with 1000 µl, max capacity is 1500 µl.
        fluidHeightR = 500; // Starts with 500 µl, max capacity is also 1500 µl.
    }
    updateLiquids(fluidHeightL, fluidHeightR);


    frames = 0;
    errors = ""; // The user hasn't made any mistakes...yet
    mistakes = [0, 0, 0, 0, 0, 0, 0];
    pipetteInLiquid = false;
    // Reset pipette display

    optionChosen = false;
    $("#tubeFluidR").removeClass("greenFluid");
    // Randomize goal
    pipetteRange = [{
        "lowest": 1.01,
        "highest": 10,
        "decimals": 2
       }, {
        "lowest": 10.1,
        "highest": 100,
        "decimals": 1
       }, {
        "lowest": 101,
        "highest": 1000,
        "decimals": 0
       }];
    if (!challengeMode) {
        // No challenge mode, single round
        correctSleeve = Math.floor(Math.random() * 3);
        if (!guidedMode) {
            correctSleeve = noHintsPipette;
        }
        goalAmount = getRandomArbitrary(pipetteRange[correctSleeve]["lowest"], pipetteRange[correctSleeve]["highest"], pipetteRange[correctSleeve]["decimals"]);
        visGoalHeight = 27.5053 * Math.log(1.43845 * goalAmount);
        ////console.log(goalAmount + " " + visGoalHeight);
        var mod = 1000;
        var goal = Math.round(goalAmount * Math.pow(10, pipetteRange[correctSleeve]["decimals"]));
        goalAmount = goal / Math.pow(10, pipetteRange[correctSleeve]["decimals"]);

        for (i = 0; i < dialDigits; i++) {
            goalDials[i] = Math.floor(goal / mod);
            goal = goal % mod;
            mod = mod / 10;
            $("#pipette_num_" + (i + 1)).text(pipetteDisplay[i]);
            $("#zoom_num_" + (i + 1)).text(pipetteDisplay[i]);
            $("#hint_num_" + (i + 1)).text(goalDials[i].toString());
        }

        showEndChallenge(false);
    } else {
        // Challenge mode, multiple rounds
        goalAmount = getRandomArbitrary(1500, 2000, 2);
        transferred = 0;
        inPipette = 0;
        showEndChallenge(true);
    }

    // Set goal text
    $("#goalText").contents().text("Task: Transfer " + goalAmount + "μL of solution from the left beaker to the right beaker.");
    // Set draggable revert property to true (so users can't drag the pipette) ONLY in guided mode
    if (guidedMode) {
        $("#draggable").draggable({
            revert: true
        });
    } else {
        $("#draggable").draggable({
            revert: false
        });
    }
    resetRound();
    // Timer
    startTime = new Date().getTime();
}

function newChallengeRound() {
    showEndChallenge(true);
    resetRound();
}

function resetRound() {
    loadTypeSelectScreen();
    challengeRound++;
    gameState = "pickType";
    gameEnd = false;
    showHintBubbles = false;
    // Reset plunger state box text
    $("#plungerStateBox").text("");
    $("#sleeveVolumeBox").text("");
    // Reset plunger stop box display
    $("#stopBoxFill").css({
        height: 0 + "%",
    });
    $("#pipetteSleeve").removeClass("fallingSleeve");
    // Set plunger state
    plungerState = 0;
    for (var i = 0; i < 4; i++) {
        if (i == 0) {
            $("#stateButton" + i).addClass("currentState");
        } else {
            $("#stateButton" + i).removeClass("currentState");
        }
    }
    setPlungerState(0);
    setPlungerState(0); // yes there are two of these here, necessary for animations to work
    pipetteDisplay = new Array(dialDigits + 1).join('0').split('').map(parseFloat);
    for (i = 0; i < dialDigits; i++) {
        $("#pipette_num_" + (i + 1)).text(pipetteDisplay[i]);
        $("#zoom_num_" + (i + 1)).text(pipetteDisplay[i]);
    }
    updateText();
    // Make all sleeves visible
    for (var i = 1; i <= 3; i++) {
        $("#sleeve" + i).css({
            'opacity': 1
        });
    }
    // Make pipette tops visible
    $(".pipetteTops").css({
        'opacity': 1
    });
    // Make pipette and dials invisible
    $("#draggable").css({
        'opacity': 0
    });
    $("#dials").css({
        'opacity': 0
    });
    $("#shortPipette").css({
        'opacity': 0
    });

    // Reset pipette position
    $("#draggable").css({
        'top': 0,
        'left': 0
    });

    plungerTopFloat = -0.9979838709677419;

    // Reset pipette sleeve
    $('#pipetteSleeve').attr("src", null);
    $('#pipetteSleeve').css({
        'opacity': 0
    });

    // Move dials back
    $("#dials").css({
        'opacity': 0,
        'z-index': -10
    });

    // Set pipette
    setPipette();
}

function loadTitle() {
    var year = Math.floor(100 * Math.random() + 1950);
    $("#titleBGHeader").text("Pipette Simulator");
}

function checkChallengeEnabled() {
    updateText();
    // Set CSS based on whether challenge mode is enabled
    if (noHints10 && noHints100 && noHints1000) {
        ENABLE_CHALLENGE = true;
    } else {
        ENABLE_CHALLENGE = false;
    }
    if (!ENABLE_CHALLENGE) {
        $("#endOption1").css({
            'left': "15%"
        });
        $("#hintScoreBox").css({
            'left': "15%"
        });
        $("#endOption2").css({
            'left': "60%"
        });
        $("#endOption2c").css({
            'left': "60%"
        });
        $("#endOption2L").css({
            'left': "60%"
        });
        $("#endOption3").css({
            'opacity': 0,
            'z-index': -1000
        });
        $("#endOption3L").css({
            'opacity': 0,
            'z-index': -1000
        });
        $("#noHintScoreBox1").css({
            'left': "60.75%"
        });
        $("#noHintScoreBox2").css({
            'left': "69%"
        });
        $("#noHintScoreBox3").css({
            'left': "77.25%"
        });
        $("#challengeScoreBox").css({
            opacity: 0
        });
    } else {
        $("#endOption1").css({
            'left': "5%"
        });
        $("#hintScoreBox").css({
            'left': "5%"
        });
        $("#endOption2").css({
            'left': "37.5%"
        });
        $("#endOption2c").css({
            'left': "37.5%"
        });
        $("#endOption2L").css({
            'left': "37.5%"
        });
        $("#endOption3").css({
            'opacity': 1,
            'z-index': 1000
        });
        $("#endOption3L").css({
            'opacity': 0,
            'z-index': -1000
        });
        $("#noHintScoreBox1").css({
            'left': "38.25%"
        });
        $("#noHintScoreBox2").css({
            'left': "46.5%"
        });
        $("#noHintScoreBox3").css({
            'left': "54.75%"
        });
        $("#challengeScoreBox").css({
            opacity: 1
        });
    }
}

function markGameAsEnded() {
    gameEnd = true;
    optionChosen = false;
    overlayAnimIn = true;
    animateInOverlay();
}

function winGame() {
    // Called when the player wins the game.  If the user played in guided mode, they are given the option of advancing to "no help" mode.  If the user played in "no help" mode, a win is recorded.
    // Show feedback in no-hints mode
    if (guidedMode) {
        showFeedback = true;
        updateFeedback();
    } else {
        showFeedback = false;
    }
    // Display the win screen
    markGameAsEnded();
    optionChosen = false;
    if (!challengeMode) {
        $("#endMargin").text("");
        $("#endMarginNum").text("");
        $("#endMistake").text("");
        $("#endMistakeNum").text("");
        $("#endScore").text("");
        $("#endScoreNum").text("");
    }
    // In guided mode, present "guided" or "no help" options
    if (guidedMode) {
        var score = getScore();
        $(".endText").text("Task Complete");
        $(".scoreText").text("Accuracy: " + score + "%");
        if (score > hintScore) {
            hintScore = score;
        }

        updateText();
        if (score == 0) {
            makeEverythingTerrible();
        }
        if (hintScore >= 75) {
            // Passing score
            $(".endSubText").text("Would you like to play without hints?");
            $(".endSubSubText").text("(You fail if you make any mistakes!)");
            $("#endOption2Text").text("Play without hints");
            // Show both buttons by default.
            $("#endOption2").css({
                'opacity': 1,
                'z-index': 100
            });
            $("#endOption2L").css({
                'opacity': 0,
                'z-index': -100
            });
        } else {
            // Failing score
            $(".endSubText").text("Great, but not perfect. Try again?");
            $(".endSubSubText").text("(Aim for 75% accuracy or better!)");
            $("#endOption2Text").text("Play without hints");
            // Hide right button, revealing "locked" graphic
            $("#endOption2").css({
                'opacity': 0,
                'z-index': -100
            });
            $("#endOption2L").css({
                'opacity': 1,
                'z-index': 100
            });
        }
        stats.hintsWins++;
        incrementWinCount(pipetteType, selectedPipette);
        stats.transferred += goalAmount;
    } else if (!challengeMode) {
        $(".endText").text("Success!");
        $(".scoreText").text("Completed without hints!");
        $(".endSubText").text("Excellent work!");
        $(".endSubSubText").text(netID == "" ? "(Can't record your score; you're not signed in!)" : "(Your success has been recorded.)");
        $("#endOption2Text").text("Retry without hints");
        if (noHintsPipette == 0) {
            noHints10 = true;
        }
        if (noHintsPipette == 1) {
            noHints100 = true;
        }
        if (noHintsPipette == 2) {
            noHints1000 = true;
        }
        stats.noHintsWins++;
        stats.transferred += goalAmount;
        incrementWinCount(pipetteType, selectedPipette);
        checkChallengeEnabled();
        updateText();
    } else if (challengeMode) {
        // User has clicked to end challenge mode
        // Let's compute their score, which is based on accuracy and number of tips used (for efficiency)
        var rawError = Math.abs(transferred - goalAmount) / goalAmount;
        var error = Math.round(10000 * (rawError)) / 100;
        var score;
        if (rawError > .1)
            score = 0;
        else {
            // Quadratic score formula
            //score = Math.round(100000 * rawError * rawError - 20000 * rawError + 1000);
            // Cubic score formula
            score = Math.round(-1666670 * rawError * rawError * rawError + 350000 * rawError * rawError - 28333.3 * rawError + 1000);
        }
        score *= 1 - .01 * Math.pow(Math.max((pipettesUsed - 2), 0), 2);
        if (score > 500) {
            incrementWinCount(pipetteType, selectedPipette);
            stats.challengeWins++;
            stats.transferred += transferred;
        }
        ////console.log("Error: " + rawError);
        $(".endText").text("Challenge Complete");
        $(".scoreText").text("");
        $(".endSubText").text("");
        $(".endSubSubText").text("");

        $("#endMargin").text("Margin of error:");
        $("#endMarginNum").text(error + "%");
        $("#endMistake").text("Pipettors used:");
        $("#endMistakeNum").text(pipettesUsed);
        $("#endScore").text("Final Score");
        if (score > challengeScore) {
            ////console.log("High score");
            challengeScore = score;
        }
        updateText();
        $("#endScoreNum").text(score);
    }
    // Timer and speed achievement check
    endTime = new Date().getTime();
    var totalTime = ((endTime - startTime) / 1000);
    //console.log(totalTime);
    if (guidedMode && totalTime <= 40) {
        hintsSpeed = true;
    }
    if (!guidedMode && !challengeMode && totalTime <= 40) {
        noHintsSpeed = true;
    }
    if (!guidedMode && challengeMode && score >= 900 && totalTime <= 80) {
        challengeSpeed = true;
    }
    checkChallenges();
    postData();
}

function returnMenu() {
    checkChallengeEnabled();
    updateText();
    // Passing score
    $(".endText").text("Hello again!");
    $(".scoreText").text(netID == "" ? "Not signed in." : "Welcome back, " + firstName + ".");
    $(".endSubText").text("You can play with or without hints.");
    $(".endSubSubText").text("(Without hints, you fail if you make any mistakes!)");
    $("#endOption2Text").text("Play without hints");
    // Show both buttons by default.
    $("#endOption2").css({
        'opacity': 1,
        'z-index': 100
    });
    $("#endOption2L").css({
        'opacity': 0,
        'z-index': -100
    });
    markGameAsEnded();
    //    $("#overlay").css({
    //        'z-index': 10
    //    });
    if (!challengeMode) {
        $("#endMargin").text("");
        $("#endMarginNum").text("");
        $("#endMistake").text("");
        $("#endMistakeNum").text("");
        $("#endScore").text("");
        $("#endScoreNum").text("");
    }
}

function postData() {
    stats.hintScore = hintScore;
    stats.noHints10 = noHints10;
    stats.noHints100 = noHints100;
    stats.noHints1000 = noHints1000;
    stats.challengeScore = challengeScore;
    ////console.log(stats);
    var str = JSON.stringify(stats);
    ////console.log(str);
    $.ajax({
        type: "POST",
        url: "writer.php",
        data: {
            stats: str
        }
    }).done(function (msg) {
        //alert("Data Saved");
    }).fail(function () {
        //alert("There was an error with the server :(");
    });
}


//function postHighScore(highScore) {
//    $.ajax({
//        type: "POST",
//        url: "writer.php",
//        data: {
//            highScore: highScore
//        }
//    }).done(function (msg) {
//        //alert("Data Saved: " + msg);
//    }).fail(function () {
//        //alert("There was an error with the server :(");
//    });
//
//}
//
//function postChallengeScore(challengeHighScore) {
//    $.ajax({
//        type: "POST",
//        url: "writer_challenge.php",
//        data: {
//            highScoreCh: challengeHighScore
//        }
//    }).done(function (msg) {
//        //alert("Data Saved: " + msg);
//    }).fail(function () {
//        //alert("There was an error with the server :(");
//    });
//}

function loseGame(reason) {
    // Called when the player loses the game.  Only happens in non-guided mode.
    // Display lose screen
    markGameAsEnded();
    $(".endText").text("Task Failed");
    $(".scoreText").text("Reason: " + reason);
    $(".endSubText").text("Would you like to retry?");
    $(".endSubSubText").text("(You can retry with hints if you want.)");
    $("#endOption2Text").text("Retry without hints");
    $("#endMargin").text("");
    $("#endMarginNum").text("");
    $("#endMistake").text("");
    $("#endMistakeNum").text("");
    $("#endScore").text("");
    $("#endScoreNum").text("");
}

// Updates text based on game state and other variables.
function updateText() {
    var text;
    // Update the results screen text
    $("#hintScoreBox").text("Best: " + hintScore + "%");
    $("#noHintScoreBox1").text(noHints10 ? "☑" : "☐");
    $("#noHintScoreBox2").text(noHints100 ? "☑" : "☐");
    $("#noHintScoreBox3").text(noHints1000 ? "☑" : "☐");
    $("#challengeScoreBox").text(challengeScore > 0 ? "Best: " + challengeScore + " pts." : "Not yet attempted.");

    // If the player has completed all 3 no-hints mode stages, the game is complete.
    // Else if there is a high score, display it.  Otherwise, don't display it.
    /*if (noHints10 && noHints100 && noHints1000) {
        $("#highScoreText").text("Game complete!");
    } else if (hintScore > 0) {
        $("#highScoreText").text("Best Accuracy: " + hintScore + "%");
    } else {
        $("#highScoreText").text("");
    }*/
    $("#usernameText").text(netID == "" ? "Not signed in." : "Signed in as " + netID + ".");
    // If the game mode is set to guides on, then display help text.  Otherwise, only display messages when the pipette breaks.
    if (guidedMode) {
        $("#modeText").text("Hints: On");
        if (errors != "") {
            frames = 0;
            errorFlash = 50;
            errorAlert();
        } else {
            errorFlash = 0;
        }
        if (errors == "") {
            if (gameState == "pickType") {
                text = "Click the type of pipettor that you wish to use.";
            } else if (gameState == "pickTop") {
                text = "Click the pipettor with the correct capacity.";
            } else if (gameState == "sleeve") {
                text = "Click the pipette tip that corresponds to your chosen pipettor.";
            } else if (gameState == "dial") {
                text = "Click the black boxes to adjust the dials to the correct amount.";
            } else if (gameState == "middle") {
                text = "Click the \"First Stop\" box to press down the plunger so that it is at the first stop.";
            } else if (gameState == "insert") {
                text = "Drag the pipettor and insert the tip of the pipettor into the left tube.";
            } else if (gameState == "top") {
                text = "Click the \"Resting State\" box to release the plunger so that it is in the resting state.";
            } else if (gameState == "move") {
                text = "Position the pipettor so that its tip is inside the fluid in the right tube.";
            } else if (gameState == "bottom") {
                text = "Click the \"Second Stop\" box to press down the plunger so that it is at the second stop.";
            } else if (gameState == "waste") {
                text = "Position the pipettor so that it is above the waste basket.";
            } else if (gameState == "eject") {
                if (pipetteType == "reference") {
                    text = "Click the \"Third Stop\" box to press down the plunger so that it is at the third stop.";
                } else {
                    text = "Click the \"Eject\" box to eject the pipette tip.";

                }

            } else if (gameState == "complete") {
                text = "Task complete!";
            }
        } else if (errors == "moveTooEarly") {
            text = "Hey! I told you to choose a tip!";
        } else if (errors == "moveTooEarlyDial") {
            text = "Hey! I told you to adjust the dials first!";
        } else if (errors == "moveTooEarlyMiddle") {
            text = "Please press down the plunger first!";
        } else if (errors == "tipTooEarly") {
            text = "Please adjust the dials before choosing a tip!";
        } else if (errors == "wrongSleeve") {
            text = "That isn't the correct tip!";
        } else if (errors == "plungerTooEarly") {
            text = "Please choose a tip before pushing down the plunger!";
        } else if (errors == "plungerTooEarlyDial") {
            text = "Please adjust the dial before pushing down the plunger!";
        } else if (errors == "plungerTooEarlyTop") {
            text = "Please select a pipettor before pushing down the plunger!";
        } else if (errors == "tooDeep") {
            text = "The pipettor is too deep into the liquid!";
        } else if (errors == "pipetteMoved") {
            text = "Don't remove the pipettor until the plunger is in the resting state!";
        } else if (errors == "pipetteMoved2") {
            text = "Don't remove the pipettor until the plunger is in the second stop!";
        } else if (errors == "wrongTop") {
            text = "That isn't the correct pipettor!";
        } else if (errors == "sleeveTooEarly") {
            text = "Please choose a pipettor before choosing a tip!";
        } else if (errors == "incorrectPlungerState") {
            text = "That's not the correct plunger state!";
        }
        // Set text
        $("#helpText").text(text);

    } else {
        // guidedMode is false
        $("#modeText").text("Hints: Off");
        text = "";
        // Set text
        $("#helpText").text(text);
    }
    if (challengeMode) {
        $("#modeText").text("Challenge Mode");
        $("#helpText").text("Round " + challengeRound);
    }
}

function animate() {
    // Increment frame count
    frames++;
    // If there is an error, fade in
    if (errorFlash == 0) {
        errors = "";
        updateText();
        errorFlash = -1;
    }
    if (errorFlash <= 0) {
        alertOpacity *= .9;

    } else if (errorFlash >= 1) {
        alertOpacity += (1 - alertOpacity) / 5;
        errorFlash--;
    }

    // If the user has won or lost, animate in the end screen
    ////console.log(gameEnd + " " + optionChosen);
    //    if (gameEnd && !overlayAnimIn) {
    //        // Animate in overlay
    //        
    //    } else if (!optionChosen) {
    //        //overlayOpacity = 0;
    //    }

    // If the user has selected an end option, animate out the end screen
    /*if (optionChosen && overlayAnimIn) {
        // Animate out end screen
        //        $("#results").removeClass("onScreen");
        //        $("#results").addClass("offScreen");
        //        $("#endScreen").removeClass("fadeIn");
        //        $("#endScreen").addClass("fadeOut");
        //        $("#overlay").removeClass("sendToFront");
        //        $("#overlay").addClass("sendToBack");
        hideMenu();
        
    } else {

    }*/
    // Title screen slide animation
    if (showTitle) {
        // Animate slides
        for (var i = 0; i < TOTAL_SLIDES; i++) {
            var str = "#slide" + i;
            var slideLeft = slidePositions[i];
            slideLeft += ((25 + 50 * (i - currentSlide)) - slideLeft) / 10;
            slidePositions[i] = slideLeft;
            var slideOpacity;
            if (Math.abs(slideLeft - 25) < 20) {
                slideOpacity = 1 - .05 * Math.abs(slideLeft - 25);
            } else {
                slideOpacity = 0;
            }
            $(str).css({
                'left': slideLeft + "%",
                'opacity': slideOpacity
            });
        }
        // Display text
        $("#titleHelpText").contents().text(slideText[currentSlide]);
        // Display buttons sometimes
        if (currentSlide > 0) {
            buttonLeftOpacity += (1 - buttonLeftOpacity) / 5;
        } else {
            buttonLeftOpacity += (0 - buttonLeftOpacity) / 5;
        }
        if (currentSlide < TOTAL_SLIDES - 1) {
            buttonRightOpacity += (1 - buttonRightOpacity) / 5;
        } else {
            buttonRightOpacity += (0 - buttonRightOpacity) / 5;
        }
        // Move buttons
        var bl = 6.5 + .5 * Math.sin(frames / 20);
        var br = 83 - .5 * Math.sin(frames / 20);
        $("#buttonLeft").css({
            'left': bl + "%",
            'opacity': buttonLeftOpacity
        });
        $("#buttonRight").css({
            'left': br + "%",
            'opacity': buttonRightOpacity
        });
    }
    // Fade out title screen
    if (!showTitle) {
        if (titleOpacity > 0) {
            titleOpacity *= .9;
            if (titleOpacity < .001) {
                titleOpacity = 0;
            }
            $("#title").css({
                'opacity': titleOpacity
            });
        } else {
            $("#title").css({
                'z-index': -1000,
                'opacity': 0
            });
        }
    }
    // Animate dial hint bubbles
    if (pipetteType == "research") {
        var bubbleLeft = (123 + 3 * Math.sin(frames / 10)) + "%";
        var numLeft = (114 + 3 * Math.sin(frames / 10)) + "%";
        $("#hints").css({
            'left': bubbleLeft
        });
    } else if (pipetteType == "reference") {
        var bubbleLeft = (123 + 5 * Math.sin(frames / 10)) + "%";
        var numLeft = (114 + 5 * Math.sin(frames / 10)) + "%";
        $("#hints").css({
            'top': bubbleLeft
        });
    }

    if (guidedMode && showHintBubbles) {
        hintBubbleOpacity += (1 - hintBubbleOpacity) / 10;
        $(".dialHint").css({
            'opacity': hintBubbleOpacity,
            'z-index': 100
        });

    } else {
        hintBubbleOpacity *= .9;
        $(".dialHint").css({
            'opacity': hintBubbleOpacity,
            'z-index': -100
        });

    }

    ////console.log("Game state: " + gameState);
    ////console.log("State: " + gameState + " / Capacity: " + getPipetteVolume() + "µL / In pipette: " + inPipette + "µL / Transferred: " + transferred + "µL");
    requestAnimationFrame(animate);
}

function errorAlert() {
    $("#alertFloor").removeClass("alertError");
    setTimeout(function () {
        $("#alertFloor").addClass("alertError");
    }, 1);
}

function showDialBubbles() {
    if (guidedMode && gameState == "dial") {
        showHintBubbles = true;
    }
}


function getRandomArbitrary(min, max, decimals) {
    var raise = Math.pow(10, decimals);
    return Math.floor(Math.random() * (max * raise - min * raise) + min * raise) / raise;
}

function animateInOverlay() {
    //    $("#results").removeClass("offScreen");
    //    $("#results").addClass("onScreen");
    //    $("#endScreen").removeClass("fadeOut");
    //    $("#endScreen").addClass("fadeIn");
    //    $("#overlay").removeClass("sendToBack");
    //    $("#overlay").addClass("sendToFront");
    showMenu();
    if (ENABLE_CHALLENGE) {
        $("#leaderboardButton").removeClass("lbButtonOut");
        $("#leaderboardButton").addClass("lbButtonIn");
    }
    if (showFeedback) {
        $("#feedback").removeClass("lbOut");
        $("#feedback").addClass("lbIn");
    }
}

function showEndChallenge(show) {
    var z = -20000;
    if (show)
        z = 20000;
    $(".endChallenge").css({
        'z-index': z
    });
}

function endChallengeMode() {
    winGame();
}

function showLeaderboard() {
    loadAllPlayerData();
    $("#leaderboardButton").removeClass("lbButtonIn");
    $("#leaderboardButton").addClass("lbButtonOut");
    $("#leaderboard").removeClass("lbOut");
    $("#leaderboard").addClass("lbIn");
    $("#leaderboard").removeClass("sendToBack");
    $("#leaderboard").addClass("lbToFront");
    lbPage = 0;
    displayHighScores(lbPage);
}

function hideLeaderboard() {
    $("#leaderboardButton").removeClass("lbButtonOut");
    $("#leaderboardButton").addClass("lbButtonIn");
    $("#leaderboard").removeClass("lbIn");
    $("#leaderboard").addClass("lbOut");
    $("#leaderboard").removeClass("lbToFront");
    $("#leaderboard").addClass("sendToBack");
    lbPage = 0;
    displayHighScores(lbPage);
}

function processAllPlayerData() {
    sortedPlayerData = allPlayerData.slice(0);
    sortedPlayerData.sort(function (a, b) {
        return b.challengeScore - a.challengeScore;
    });
    var currentTie = 0;
    for (var i = 0; i < sortedPlayerData.length; i++) {
        if (sortedPlayerData[i].challengeScore == sortedPlayerData[currentTie].challengeScore) {
            // It's a tie
        } else {
            // Not a tie, catch up to leaderboards
            currentTie = i;
        }
        sortedPlayerData[i].rank = currentTie + 1;
    }
}

function displayHighScores(page) {
    // Display all
    for (var i = 0; i < 10; i++) {
        var toDisplay = i + 10 * page;
        if (toDisplay < sortedPlayerData.length) {
            $("#lbRank" + i).text("");
            $("#lbName" + i).text("");
            $("#lbScore" + i).text("");
            var p = sortedPlayerData[toDisplay];
            if (toDisplay < sortedPlayerData.length && sortedPlayerData[toDisplay].score > 0 ||
                (p.noHints10 == "true" && p.noHints100 == "true" && p.noHints1000 == "true")) {
                $("#lbRank" + i).text(ordinal(sortedPlayerData[toDisplay].rank));
                $("#lbName" + i).text(sortedPlayerData[toDisplay].name);
                $("#lbScore" + i).text(sortedPlayerData[toDisplay].challengeScore);
            }
            //console.log(toDisplay);
            if (sortedPlayerData[toDisplay].name == netID) {
                $("#lbRank" + i).removeClass("ctext");
                $("#lbName" + i).removeClass("ctext");
                $("#lbScore" + i).removeClass("ctext");
                $("#lbRank" + i).addClass("ctextSelf");
                $("#lbName" + i).addClass("ctextSelf");
                $("#lbScore" + i).addClass("ctextSelf");
            } else {
                $("#lbRank" + i).removeClass("ctextSelf");
                $("#lbName" + i).removeClass("ctextSelf");
                $("#lbScore" + i).removeClass("ctextSelf");
                $("#lbRank" + i).addClass("ctext");
                $("#lbName" + i).addClass("ctext");
                $("#lbScore" + i).addClass("ctext");
            }
        }
    }
    // Display user's own score
    for (var i = 0; i < sortedPlayerData.length; i++) {
        if (sortedPlayerData[i].name == netID) {
            $("#lbRankSelf").text(ordinal(sortedPlayerData[i].rank));
            $("#lbNameSelf").text(sortedPlayerData[i].name);
            $("#lbScoreSelf").text(sortedPlayerData[i].challengeScore);
        }
    }

}

function ordinal(n) {
    if (n >= 11 && n <= 13) return n + "th";
    switch (n % 10) {
    case 1:
        return n + "st";
        break;
    case 2:
        return n + "nd";
        break;
    case 3:
        return n + "rd";
        break;
    default:
        return n + "th";
        break;
    }
}

function logMistake(type) {
    if (type == 5 && !outOfOrderMistake) {
        outOfOrderMistake = true;
        setTimeout(function () {
            outOfOrderMistake = false;
        }, 2000);
    } else if (type == 5) {
        return;
    }
    mistakes[type]++;
    //console.log("Mistake " + type + ", new score " + getScore() + ", mistakes " + mistakes);
}

function getScore() {
    // Compute score
    score = 0;
    score += (15 - 5 * (mistakes[0] <= 3 ? mistakes[0] : 3)); // Select wrong pipettor
    score += (15 - 5 * (mistakes[1] <= 3 ? mistakes[1] : 3)); // Select wrong sleeve
    score += (mistakes[2] == 0 ? 10 : 0); // Pipette too deep into liquid
    score += (mistakes[3] == 0 ? 10 : 0); // Pipette moved while in liquid
    score += (mistakes[4] == 0 ? 10 : 0); // Pipette too deep into liquid while moving it
    score += (25 - 5 * (mistakes[5] <= 5 ? mistakes[5] : 5)); // User does things out of order
    score += (15 - 5 * (mistakes[6] <= 3 ? mistakes[6] : 3)); // Move plunger to wrong state
    return score;
}

function updateFeedback() {
    updatePanel(0, "Completed task", 100);
    if (mistakes[0] == 0) {
        updatePanel(1, "Picked correct pipettor", 0);
    } else {
        updatePanel(1, "Picked wrong pipettor (" + mistakes[0] + "x)", -5 * (mistakes[0] <= 3 ? mistakes[0] : 3));
    }
    if (mistakes[1] == 0) {
        updatePanel(2, "Picked correct pipette tip", 0);
    } else {
        updatePanel(2, "Picked wrong pipette tip (" + mistakes[1] + "x)", -5 * (mistakes[1] <= 3 ? mistakes[1] : 3));
    }
    if (mistakes[2] == 0) {
        updatePanel(3, "Inserted pipettor correctly", 0);
    } else {
        updatePanel(3, "Inserted pipettor too deep", -10);
    }
    if (mistakes[3] == 0) {
        updatePanel(4, "Extracted solution correctly", 0);
    } else {
        updatePanel(4, "Extracted solution incorrectly", -10);
    }
    if (mistakes[4] == 0) {
        updatePanel(5, "Transferred solution correctly", 0);
    } else {
        updatePanel(5, "Transferred solution incorrectly", -10);
    }
    if (mistakes[5] == 0) {
        updatePanel(6, "Performed all steps in order", 0);
    } else {
        updatePanel(6, "Performed steps out of order (" + mistakes[5] + "x)", -5 * (mistakes[5] <= 5 ? mistakes[5] : 5));
    }
    if (mistakes[6] == 0) {
        updatePanel(7, "Selected correct plunger states", 0);
    } else {
        updatePanel(7, "Selected incorrect plunger state (" + mistakes[6] + "x)", -5 * (mistakes[6] <= 3 ? mistakes[6] : 3));
    }
}

function updatePanel(id, main, score) {
    $("#fbPanelText" + id).text(main);
    if (score == 0) {
        $("#fbScorePanelText" + id).text("OK");
        $("#fbScorePanel" + id).css({
            'background-color': "green"
        });
    } else if (score < 0) {
        $("#fbScorePanelText" + id).text(score);
        $("#fbScorePanel" + id).css({
            'background-color': "red"
        });
    } else if (score > 0) {
        $("#fbScorePanelText" + id).text("+" + score);
        $("#fbScorePanel" + id).css({
            'background-color': "green"
        });
    }
}

// Easter egg
function makeEverythingTerrible() {
    $("p").addClass("everythingIsTerrible");
    $(".ctext").addClass("everythingIsTerrible");
    $("endOptionText").addClass("everythingIsTerrible");
}

function showMenu() {
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
    // Challenge screen
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
    if (ENABLE_CHALLENGE) {
        $("#leaderboardButton").removeClass("lbButtonIn");
        $("#leaderboardButton").addClass("lbButtonOut");
    }
    if (showFeedback) {
        $("#feedback").removeClass("lbIn");
        $("#feedback").addClass("lbOut");
    }
    overlayAnimIn = false;
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
    // Challenges
    $("#challengeButton").removeClass("anim_enterChButton");
    $("#challengeButton").removeClass("anim_enterChButton2");
    $("#challengeButton").addClass("anim_exitChButton");
    $("#challengeScreen").removeClass("anim_enterChallenges");
    $("#challengeScreen").addClass("anim_exitChallenges");
}

function incrementWinCount(pType, capacityID) {
    // Research/reference
    if (pType == "research") {
        stats.pipetteTypeWins[0]++;
    } else if (pType == "reference") {
        stats.pipetteTypeWins[1]++;
    }
    // P10/P100/P1000
    stats.pipetteCapacityWins[capacityID]++;
}

// Manually change dials by a certain amount
function changeDials(amount) {
    var disp = 0;
    for (var i = 0; i < 4; i++) {
        disp += pipetteDisplay[i] * Math.pow(10, 3 - i);
    }
    disp += amount;
    // Check if OK
    if (disp + amount >= -1 && disp + amount <= 1001) {
        for (var i = 0; i < 4; i++) {
            pipetteDisplay[i] = Math.floor(disp / Math.pow(10, 3 - i));
            disp = disp % Math.pow(10, 3 - i);
        }
        for (var i = 0; i < dialDigits; i++) {
            $("#zoom_num_" + (i + 1)).text(pipetteDisplay[i]);
            $("#pipette_num_" + (i + 1)).text(pipetteDisplay[i]);
        }
        checkDials();
    }

}