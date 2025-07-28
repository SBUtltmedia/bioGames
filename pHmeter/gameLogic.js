// Game object
var game;

var UNLOCK_EVERYTHING = true;

// You can define step object references here for convenience if your IDE has code completion. If not, then go download Brackets and use that instead, and your quality of life will be greatly improved
var step1;
var step2;
var step3;

var currentZoom = 1;

var userNetID = "";
var firstName = "";

var netID = "";

// Stats
var stats = {
    practiceWins: 0,
    challengeWins: 0,
    challengePlusWins: 0,
    measuredObjects: 0,
    objectRecord: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    challengeStates: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
};

var modeNames = ["Practice", "Challenge", "Challenge+"];

var studentData = {}; // Student data
var gameData = {}; // Data for the round being played
var questionData = {}; // Data for the current question

var buffersUsed = [false, false, false];
var bufferSelected = -1;

// What the meter is currently displaying
var meterDisplay = {
    sOn: true,
    temp: 21.7,
    pH: 6.75,
    tempOn: true,
    pHOn: true,
    measuringOn: true,
    measuringNumbersOn: [false, false, false, false, false],
    clearOn: false,
    setOn: false,
    buffersOn: false
};

// Generated randomly when the meter is being calibrated
var pHTween1 = 0;
var pHTween2 = 0;

var bufferData = [
    {
        "text1": "Storage",
        "text2": "Solution",
        "color": "#ffffff",
        "opacity": .15,
        "pH": 7
    },
    {
        "text1": "pH 4",
        "text2": "",
        "color": "#e02a33",
        "opacity": .5,
        "pH": 4
    },
    {
        "text1": "pH 7",
        "text2": "",
        "color": "#ded620",
        "opacity": .5,
        "pH": 7
    },
    {
        "text1": "pH 10",
        "text2": "",
        "color": "#3372b7",
        "opacity": .5,
        "pH": 10
    }
];

var liquidData = [
    {
        "text1": "Coffee",
        "text2": "",
        "color": "#1a0d00",
        "opacity": .7,
        "pH": 5
    },
    {
        "text1": "Orange",
        "text2": "Juice",
        "color": "#ffd633",
        "opacity": .5,
        "pH": 3.7
    },
    {
        "text1": "Milk",
        "text2": "",
        "color": "#ffffff",
        "opacity": .9,
        "pH": 6.5
    },
    {
        "text1": "Apple",
        "text2": "Juice",
        "color": "#ffb84d",
        "opacity": .5,
        "pH": 5
    }
];

var jarData = [];

var buffersActive = true;

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
    $(".progressCheckState").removeClass("completeIcon");
    $(".progressCheckState").addClass("incompleteIcon");
    currentZoom = 1;
    setpHReadout(6.75);
    setTempReadout(21.7);
    updateMeter();
    setBufferColors();
    buffersActive = true;
    if (props.mode == 1) {
        setTimeout(function () {
            showHUD();
        }, 1000);
        // Set some HUD text
        // $("#progressLabel2").text("of " + volumes.length);
        setTimeout(function () {
            $("#entryInput").focus();
        }, 1500);
    }
    if (props.mode >= 2) {
        setTimeout(function () {
            showHUD();
        }, 1000);
        // Set some HUD text
        setTimeout(function () {
            $("#entryInput").focus();
        }, 1500);
    }
    electrodeLifted = false;
    buffersUsed = [false, false, false];
    bufferSelected = -1;
    setupClicks = 0;
    $("#smallJar1").css("opacity", 0);
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
    // Un-focus textbox
    $("#entryInput").blur();
    // Show scores
    $("#endScoreBox").css({
        opacity: 1
    });
    // If the player wins
    if (result == "win") {
        $("#endText").text("Great Success");
        $("#endSubText").css({
            opacity: 0
        });
        $(".endErrorText").css({
            opacity: 0
        });
        // Check for high scores
        if (props.mode == 1) {
            studentData.unlocks[0] = true;
            if (completed < studentData.highScores[0] || studentData.highScores[0] == 0) {
                studentData.highScores[0] = completed;
            }
            stats.practiceWins += 1;
        } else if (props.mode == 2) {
            studentData.unlocks[1] = true;
            if (score > studentData.highScores[1]) {
                studentData.highScores[1] = score;
            }
            stats.challengeWins += 1;
        } else if (props.mode == 3) {
            studentData.unlocks[2] = true;
            if (score > studentData.highScores[2]) {
                studentData.highScores[2] = score;
            }
            stats.challengePlusWins += 1;
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
    checkChallenges();
    postData();
    //console.log(studentData);
    refreshHighScores();
    // Show the menu
    showMenu();
}

/* 
    startStep: this function is called whenever a step starts
    this is the "set-up" phase for a particular step
    specify code that should be executed when a step starts (animations, etc)
*/
function startStep(step) {
    // Sample: this is called when step1 starts
    if (game.props.mode == 1) {
        $("#headerText").text(step.longText);
    }
    if (step.id == "selectSolution") {
        $("#jarSwitchBox").addClass("anim_switchJars");
        setTimeout(function () {
            jarData = liquidData.slice();
            buffersActive = false;
            setBufferColors();
        }, 250);
        setTimeout(function () {
            $("#jarSwitchBox").removeClass("anim_switchJars");
        }, 500);
    }
    if (step.id == "rinseElectrode") {
        // Show the waste container for rinsing
        $("#wasteContainer").removeClass("anim_wasteContainerOut");
        $("#wasteContainer").addClass("anim_wasteContainerIn");
    }
}

/* 
    startStep: this function is called whenever a step ends
    this is the "clean-up" phase for a particular step
    specify code that should be executed when a step ends (animations, etc)
*/
function endStep(step) {
    // Sample: this is called when step1 has ended
    if (step.id == "wipeElectrode") {
        // Show the waste container for rinsing
        $("#wasteContainer").removeClass("anim_wasteContainerIn");
        $("#wasteContainer").addClass("anim_wasteContainerOut");
    }
}

/*
    loadStartMenu: this function shows the menu at the start of the game
*/
function loadStartMenu() {
    // Set the header text
    $("#headerText").text("pH Meter");
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
    if (studentData.highScores[0] > 0) {
        $("#scoreBox1").text("Best: " + studentData.highScores[0] + " questions");
        if (studentData.highScores[0] == 5) {
            setMedal(1, "gold");
        } else if (studentData.highScores[0] <= 7) {
            setMedal(1, "silver");
        } else if (studentData.highScores[0] <= 10) {
            setMedal(1, "bronze");
        }
    } else {
        $("#scoreBox1").text("");
    }
    if (studentData.highScores[1] > 0) {
        $("#scoreBox2").text("Best: " + studentData.highScores[1] + " points");
        if (studentData.highScores[1] == 100) {
            setMedal(2, "gold");
        } else if (studentData.highScores[1] >= 90) {
            setMedal(2, "silver");
        } else if (studentData.highScores[1] >= 80) {
            setMedal(2, "bronze");
        }
    } else {
        $("#scoreBox2").text("");
    }
    if (studentData.highScores[2] > 0) {
        $("#scoreBox3").text("Best: " + studentData.highScores[2] + " points");
        if (studentData.highScores[2] == 100) {
            setMedal(3, "gold");
        } else if (studentData.highScores[2] >= 90) {
            setMedal(3, "silver");
        } else if (studentData.highScores[2] >= 80) {
            setMedal(3, "bronze");
        }
    } else {
        $("#scoreBox3").text("");
    }
}

function setMedal(id, medal) {
    $("#medal" + id).css({
        "background-image": "url(img/medal_" + medal + ".svg)"
    })
}

function showMenu() {
    lockModes();
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

function zoom(zoomLevel, centerX, centerY) {
    currentZoom = zoomLevel;
    // Default parameters (reset)
    var width = 100 * zoomLevel;
    var height = 100 * zoomLevel;
    var top = centerY * -100 * (zoomLevel - 1);
    var left = centerX * -100 * (zoomLevel - 1);
    $("#view").animate({
        'width': width + "%",
        'height': height + "%",
        'top': top + "%",
        'left': left + "%"
    }, 250);
    if (game.props.mode == 1) {
        if (zoomLevel > 1) {
            if (progress == 0) {
                if (phase == 0) {
                    hintFade(1, true);
                } else if (phase == 1) {
                    hintFade(2, true);
                }
            }
        } else {
            if (phase == 0) {
                hintFade(1, false);
            } else if (phase == 1) {
                hintFade(2, false);
            }
        }
    }
}

function formatTime(sec) {
    var s = sec;
    var h = Math.floor(s / 3600);
    s -= 3600 * h;
    var m = Math.floor(s / 60);
    s -= 60 * m;
    s = Math.round(s * 1000) / 1000;
    return h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

function lockModes() {
    $("#endOption1").removeClass("endOptionLocked");
    $("#endOption1").addClass("endOptionUnlocked");
    if (studentData.unlocks[0] || UNLOCK_EVERYTHING) {
        // Unlock
        $("#endOptionDescText2").html("Measure 10 objects.  If you make 3 mistakes, you lose.");
        $("#endOption2").removeClass("endOptionLocked");
        $("#endOption2").addClass("endOptionUnlocked");
    } else {
        // Lock
        $("#endOptionDescText2").html("Locked! <br> Complete Practice mode to unlock.");
        $("#endOption2").removeClass("endOptionUnlocked");
        $("#endOption2").addClass("endOptionLocked");
    }
    if (studentData.unlocks[1] || UNLOCK_EVERYTHING) {
        // Unlock
        $("#endOptionDescText3").html("Measure 10 objects.  If you make 3 mistakes, you lose.  More difficult than Challenge.");
        $("#endOption3").removeClass("endOptionLocked");
        $("#endOption3").addClass("endOptionUnlocked");
    } else {
        // Lock
        $("#endOptionDescText3").html("Locked! <br> Complete Challenge mode to unlock.");
        $("#endOption3").removeClass("endOptionUnlocked");
        $("#endOption3").addClass("endOptionLocked");
    }
}

function tryElectrodeUp() {
    if (game.props.mode != 1 || game.getCurrentStep().id == "liftElectrode") {
        if (game.getCurrentStep().id == "liftElectrode") {
            setTimeout(function () {
                game.nextStep();
            }, 750);
            electrodeUp();
        } else {
            // Fail game
            electrodeUp();
            endGame("lose");
        }
    }
}

function tryElectrodeDown() {
    if (game.props.mode != 1 || game.getCurrentStep().id == "lowerElectrode") {
        if (game.getCurrentStep().id == "lowerElectrode") {
            setTimeout(function () {
                tweenpHReadout(meterDisplay.pH, pHTween1, 1000);
            }, 125);
            setTimeout(function () {
                game.nextStep();
            }, 1125);
            electrodeDown();
        } else {
            // Fail game
            electrodeDown();
            endGame("lose");
        }
    }
}

function electrodeUp() {
    electrodeLifted = true;
    $("#electrode").removeClass("anim_electrodeDown");
    $("#electrode").addClass("anim_electrodeUp");
    setTimeout(function () {
        returnSmallJar(bufferSelected + 2);
    }, 250);
    wireUp();
}

function electrodeDown() {
    electrodeLifted = false;
    $("#electrode").removeClass("anim_electrodeUp");
    $("#electrode").addClass("anim_electrodeDown");
    wireDown();
}

function wireUp() {
    for (var i=0; i<=25; i++) {
        setWirePos(i, 5 * i);
    }
}

function wireDown() {
    for (var i=0; i<=25; i++) {
        setWirePos(25-i, 5 * i);
    }
}

function setWirePos(frame, time) {
    setTimeout(function() {
        var x1 = -.4 * frame;
        var x2 = 60 - 1.6 * frame;
        $("#wire").attr("d", "M35,70 C30,40 77.5," + x1 + " 77.5," + x2);
    }, time);
}

function tryRinseElectrode() {
    if (game.props.mode != 1 || game.getCurrentStep().id == "rinseElectrode") {
        if (game.getCurrentStep().id == "rinseElectrode") {
            rinseElectrode();
        } else {
            // Fail game
            endGame("lose");
        }
    }
}

function rinseElectrode() {
    rinseAnim = true;
    $("#waterBottle").addClass("anim_bottleRinse");
    setTimeout(function () {
        makeDroplets();
        meterDisplay.sOn = false;
        updateMeter();
    }, 500);
    setTimeout(function () {
        $("#waterBottle").removeClass("anim_bottleRinse");
        rinseAnim = false;
        game.nextStep();
    }, 2000);
}

function tryWipeElectrode() {
    if (game.props.mode != 1 || game.getCurrentStep().id == "wipeElectrode") {
        if (game.getCurrentStep().id == "wipeElectrode") {
            wipeElectrode();
        } else {
            // Fail game
            endGame("lose");
        }
    }
}

function wipeElectrode() {
    wipeAnim = true;
    $("#wipe").addClass("anim_wipeElectrode");
    setTimeout(clearDroplets, 500);
    setTimeout(function () {
        $("#wipe").removeClass("anim_wipeElectrode");
        wipeAnim = false;
        game.nextStep();
    }, 1500);
}

function tryTakeSmallJar(i) {
    if (game.props.mode != 1 || (game.getCurrentStep().id == "selectBuffer" || game.getCurrentStep().id == "selectSolution")) {
        if (game.getCurrentStep().id == "selectBuffer" && buffersUsed[i - 2] == false) {
            buffersUsed[i - 2] = true;
            takeSmallJar(i);
        } else if (game.getCurrentStep().id == "selectSolution") {
            takeSmallJar(i);
        } else if (game.props.mode != 1) {
            // Fail game
            endGame("lose");
        }
    }
}

function takeSmallJar(i) {
    $("#smallJar" + (i)).addClass("anim_smallJarTake" + (i));
    $("#jar").css("opacity", 0);
    setTimeout(function () {
        $("#jar").css("opacity", 1);
        $("#smallJar" + i).css("opacity", 0);
        for (var j = 1; j <= 4; j++) {
            $(".anim_smallJarTake" + j).removeClass("anim_smallJarTake" + j);
            $(".anim_smallJarReturn" + j).removeClass("anim_smallJarReturn" + j);
        }
        setBufferColors();
        game.nextStep();
    }, 500);
    bufferSelected = i - 2;
    var target = jarData[bufferSelected + 1].pH;
    var error1 = (.1 + .1 * Math.random()) * (Math.random() < .5 ? 1 : -1);
    var error2 = error1 * (.6 - .2 * Math.random());
    pHTween1 = target + error1;
    if (buffersActive) {
        pHTween2 = target + error2;
    } else {
        pHTween2 = target;
    }
}

function returnSmallJar(i) {
    $("#smallJar" + i).addClass("anim_smallJarReturn" + (bufferSelected + 2));
    $("#smallJar" + i).css("opacity", 1);
    $("#jar").css("opacity", 0);
    setTimeout(function () {
        for (var j = 1; j <= 4; j++) {
            $(".anim_smallJarTake" + j).removeClass("anim_smallJarTake" + j);
            $(".anim_smallJarReturn" + j).removeClass("anim_smallJarReturn" + j);
        }
    }, 500);
}

function tryStirJar() {
    if (game.props.mode != 1 || game.getCurrentStep().id == "stirSolution") {
        if (game.getCurrentStep().id == "stirSolution") {
            stirJar();
        } else {
            // Fail game
            endGame("lose");
        }
    }
}

function stirJar() {
    jarStirAnim = true;
    $("#jar").addClass("anim_jarStir");
    tweenpHReadout(pHTween1, pHTween2, 1000);
    setTimeout(function () {
        $("#jar").removeClass("anim_jarStir");
        jarStirAnim = false;
        meterDisplay.sOn = true;
        updateMeter();
        game.nextStep();
    }, 1000);
}

function setpHReadout(n) {
    var digits = [0, 0, 0, 0];
    var m = Math.round(n * 100);
    for (var i = 3; i >= 0; i--) {
        digits[3 - i] = Math.floor(m / Math.pow(10, i));
        m -= digits[3 - i] * Math.pow(10, i);
    }
    for (var i = 0; i < 4; i++) {
        $("#pHRead" + (i + 1)).css("background-image", "url(img/led" + digits[i] + ".svg)");
    }
    if (n < 10) {
        $("#pHRead1").css("opacity", 0);
    } else {
        $("#pHRead1").css("opacity", 1);
    }
}

function setTempReadout(n) {
    var digits = [0, 0, 0];
    var m = Math.round(n * 10);
    for (var i = 2; i >= 0; i--) {
        digits[2 - i] = Math.floor(m / Math.pow(10, i));
        m -= digits[2 - i] * Math.pow(10, i);
    }
    for (var i = 0; i < 3; i++) {
        $("#tempRead" + (i + 1)).css("background-image", "url(img/led" + digits[i] + ".svg)");
    }
}

function updateMeter() {
    if (meterDisplay.sOn) {
        $("#boxS").css("opacity", 1);
    } else {
        $("#boxS").css("opacity", 0);
    }
    if (meterDisplay.measuringOn) {
        $("#labelMeasuring").css("opacity", 1);
    } else {
        $("#labelMeasuring").css("opacity", 0);
    }

    if (meterDisplay.clearOn) {
        $("#labelClear").css("opacity", 1);
    } else {
        $("#labelClear").css("opacity", 0);
    }

    if (meterDisplay.setOn) {
        $("#labelSet").css("opacity", 1);
    } else {
        $("#labelSet").css("opacity", 0);
    }
    if (meterDisplay.buffersOn) {
        $("#labelBuffers").css("opacity", 1);
    } else {
        $("#labelBuffers").css("opacity", 0);
    }
    var labelNums = [2, 4, 7, 10, 12];
    for (var i = 0; i < 5; i++) {
        if (meterDisplay.measuringNumbersOn[i]) {
            $("#label" + labelNums[i]).css("opacity", 1);
        } else {
            $("#label" + labelNums[i]).css("opacity", 0);
        }
    }
    if (meterDisplay.tempOn) {
        $(".tempComponent").css("opacity", 1);
        setTempReadout(meterDisplay.temp);
    } else {
        $(".tempComponent").css("opacity", 0);
    }
    if (meterDisplay.pHOn) {
        $(".pHComponent").css("opacity", 1);
        setpHReadout(meterDisplay.pH);
    } else {
        $(".pHComponent").css("opacity", 0);
    }
}

function makeDroplets() {
    for (var i = 0; i < 20; i++) {
        makeDroplet(i);
    }
}

function makeDroplet(i) {
    setTimeout(function () {
        $("#droplets").append("<div id='droplet" + i + "' class='droplet anim_dropletFall'></div>");
        $("#droplet" + i).css("left", (15 + (Math.random() * 70)) + "%");
    }, 100 * i);
}

function clearDroplets() {
    $("#droplets").empty();
}

function tweenpHReadout(start, end, time) {
    for (var i = 0; i < time / 40; i++) {
        var progress = Math.pow(i / (time / 40), .25);
        var value = start + progress * (end - start);
        setpHReadoutDelay(value, i * 40);
    }
    setpHReadoutDelay(end, time);
}

function setpHReadoutDelay(value, delay) {
    setTimeout(function () {
        meterDisplay.pH = value;
        updateMeter();
    }, delay);
}

function resetBufferData() {
    jarData = bufferData.slice();
}

function setBufferColors() {
    setJarColor(0, jarData[bufferSelected + 1].color, jarData[bufferSelected + 1].opacity);
    setJarLabel(0, jarData[bufferSelected + 1].text1, jarData[bufferSelected + 1].text2);
    for (var i = 1; i <= 4; i++) {
        setJarColor(i, jarData[i - 1].color, jarData[i - 1].opacity);
        setJarLabel(i, jarData[i - 1].text1, jarData[i - 1].text2);
    }
}

function setJarColor(id, color, opacity) {
    $("#smallJarLiquid" + id).css({
        "fill": color,
        "opacity": opacity
    });
}

function setJarLabel(id, txt1, txt2) {
    $("#smallJarLabelText" + id + "a").text(txt1);
    $("#smallJarLabelText" + id + "b").text(txt2);
    if (txt1 == "") {
        $("#smallJarLabel" + id).css("opacity", 0);
    } else {
        $("#smallJarLabel" + id).css("opacity", 1);
    }
    if (txt2 == "") {
        $("#smallJarLabelText" + id + "a").attr("dy", 15);
    } else {
        $("#smallJarLabelText" + id + "a").attr("dy", 0);
    }
}

function tryOpenElectrodeHole() {
    if (game.props.mode != 1 || game.getCurrentStep().id == "closeElectrodeHole") {
        if (game.getCurrentStep().id == "closeElectrodeHole") {
            openElectrodeHole();
        } else {
            // Fail game
            endGame("lose");
        }
    }
}

function openElectrodeHole() {
    $("#holeBGClear").addClass("anim_openElectrodeHole");
    setTimeout(function () {
        game.nextStep();
    }, 500);
}