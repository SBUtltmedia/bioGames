// Game object
var game;

var UNLOCK_EVERYTHING = false;

// You can define step object references here for convenience if your IDE has code completion. If not, then go download Brackets and use that instead, and your quality of life will be greatly improved
var step1;
var step2;
var step3;

var currentZoom = 1;

var userNetID = "";
var firstName = "";

var netID = "";

var showingHUD = false;

// Stats
var stats = {
    practiceWins: 0,
    practiceWinDetails: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    puzzleUnlocks: [false, false, false, false],
    puzzleCompletion: [false, false, false, false, false, false, false, false, false, false, false, false],
    puzzleScores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tubesBalanced: 0,
    challengeStates: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
};

var modeNames = ["Practice", "Challenge", "Puzzle"];

var studentData = {}; // Student data
var gameData = {}; // Data for the round being played
var questionData = {}; // Data for the current question

// Set this to true to enable step skipping: click the active step object to complete it
var skipEnabled = false;

var tubesLeft = 2;
var totalTubes = 2;
var wellStates = [];
var spinIntervalID = -1;
var lockedWells = [];
var bannedWells = [];

var practiceWinStreak = false;
var practiceWinStreakNum = 0;
var practiceMeta = false;

var gameLost = false;

var optimal = [false, false, false];

// For Challenge mode
var level = 0;
var levelData = [];
var tubesUsed = 0;

// For Puzzle mode
var puzzleSelected = -1;
var puzzleData = [
    {
        "title": "Off by One",
        "desc": "Balance the centrifuge using as few tubes as possible.",
        "locked": [8, 16, 23],
        "perfect": 5
    },
    {
        "title": "Square Dance",
        "desc": "Balance the centrifuge using as few tubes as possible.",
        "locked": [1, 4, 9, 16],
        "perfect": 5
    },
    {
        "title": "Elbow Room",
        "desc": "Balance the centrifuge using as many tubes as possible, without placing tubes in adjacent slots.",
        "locked": [],
        "perfect": 12
    },
    {
        "title": "Imperfect Star",
        "desc": "Balance the centrifuge using as few tubes as possible.",
        "locked": [1, 5, 9, 13, 19],
        "perfect": 8
    },
    {
        "title": "Triangulation",
        "desc": "Balance the centrifuge using as few tubes as possible.",
        "locked": [1, 3, 6, 10, 15, 21],
        "perfect": 10
    },
    {
        "title": "No Opposition",
        "desc": "Balance the centrifuge using as many tubes as possible, without placing tubes in opposite slots.",
        "locked": [],
        "perfect": 12
    },
    {
        "title": "Fibonacci",
        "desc": "Balance the centrifuge using as few tubes as possible.",
        "locked": [1, 2, 3, 5, 8, 13, 21],
        "perfect": 12
    },
    {
        "title": "About Face",
        "desc": "Balance the centrifuge using as few tubes as possible.",
        "locked": [4, 5, 6, 7, 8, 9, 17, 21],
        "perfect": 12
    },
    {
        "title": "No Quarter",
        "desc": "Balance the centrifuge using as many tubes as possible, without placing tubes in slots 1-6.",
        "locked": [],
        "perfect": 12
    },
    {
        "title": "Prime Time",
        "desc": "Balance the centrifuge using as few tubes as possible.",
        "locked": [2, 3, 5, 7, 11, 13, 17, 19, 23],
        "perfect": 12
    },
    {
        "title": "Four Count",
        "desc": "Balance the centrifuge using as few tubes as possible.",
        "locked": [2, 7, 8, 13, 14, 12, 19, 20, 21, 22],
        "perfect": 13
    },
    {
        "title": "Detriple",
        "desc": "Balance the centrifuge using as many tubes as possible, without placing three tubes in a triangular pattern.",
        "locked": [],
        "perfect": 16
    },
];

/*
    newGame: this function is called to start a new game with the specified parameters
    you can specify whatever parameters you like in the "props" object (current game mode, etc)
    also specify code that should be run when a new game starts
*/
function newGame(props) {
    // Create a new game object
    game = new Game(props);
    // console.log(props);
    currentZoom = 1;
    optimal = [false, false, false];
    // Show correct left box
    $(".box_left").css("z-index", 0);
    $(".box_left").css("opacity", 0);
    $("#box_left" + props.mode).css("z-index", 20);
    $("#box_left" + props.mode).css("opacity", 1);
    // Show correct right box
    $(".box_right").css("z-index", 0);
    $("#box_right" + (props.mode == 3 ? 2 : 1)).css("z-index", 20);
    $("#box_right" + (props.mode == 3 ? 2 : 1)).css("opacity", 1);
    // Maybe hide the return button
    if (props.mode == 2) {
        $("#returnButton").css("opacity", 0);
    } else {
        $("#returnButton").css("opacity", 1);
    }
    if (props.mode == 1) {
        practiceWinStreakNum = 0;
      //  totalTubes = leastIncompleteNumber();
        setTimeout(function () {
            showHUD();
        }, 1000);
        // Set title
        $("#headerText").text("Balance the centrifuge.");
        setTimeout(function () {
            $("#entryInput").focus();
        }, 1500);
    } else if (props.mode == 2) {
        totalTubes = -1;
        tubesUsed = 0;
        level = 0;
        makeBetterLevels();
        loadLevel(0);
        updateTubeDisplay();
        setTimeout(function () {
            showHUD();
        }, 1000);
        // Set title
        $("#headerText").text("Balance the centrifuge.");
        setTimeout(function () {
            $("#entryInput").focus();
        }, 1500);
    } else if (props.mode == 3) {
        // Lock/unlock puzzles
        for (var i = 0; i < 4; i++) {
            var o;
            var z;
            if (stats.puzzleUnlocks[i]) {
                o = 0;
                z = 0;
            } else {
                o = 1;
                z = 20;
            }
            $("#puzzleSetBox" + i).css({
                'opacity': o,
                'z-index': z
            });
        }
        checkPuzzleSetLocks();
        puzzleSelected = -1;
        setPuzzleModeText();
        setTimeout(function () {
            showHUD();
        }, 1000);
        // Set title
        $("#headerText").text("Solve the puzzles.");
        setTimeout(function () {
            $("#entryInput").focus();
        }, 1500);
    }
    resetTubes();
    // Initialize the object that stores game data
    hideMenu();
}

function checkPuzzleSetLocks() {
    // Determine which sets are locked/unlocked
    var ch = totalChallengesComplete() + trueCount(stats.puzzleCompletion);
    var req = [2, 8, 16, 24];
    for (var i = 0; i < 4; i++) {
        if (ch >= req[i] || UNLOCK_EVERYTHING) {
            // Unlocked
            $("#puzzleSetBoxLock" + i).text("0");
            if (!stats.puzzleUnlocks[i]) {
                // Unlock puzzle set in 1 second
                unlockPuzzleSet(i, 1000);
            }
        } else {
            // Still locked
            $("#puzzleSetBoxLock" + i).text(req[i] - ch);
        }
    }
}

/*
    endGame: the "result" parameter should take the value of "win" or "lose"
    when the player wins, call endGame("win"); when they lose, call endGame("lose")
*/
function endGame(result) {
    // Un-focus textbox
    $("#entryInput").blur();
    // Show scores
    $("#endScoreBox").css({
        opacity: 1
    });
    $("#endScoreMode").text(modeNames[game.props.mode - 1]);
    if (game.props.mode == 1) {
        // Score based on completion percentage
        var completed = practiceCompletion();
        if (completed == 21) {
            setMedal(4, "gold");
        } else if (completed >= 14) {
            setMedal(4, "silver");
        } else if (completed >= 7) {
            setMedal(4, "bronze");
        } else {
            setMedal(4, "blank");
        }
        $("#endScoreScoreLabel").text("Progress");
        $("#endScoreScore").text(Math.floor(completed / .21) + "%");
        $("#endScoreScoreSub").text("completed");
    } else if (game.props.mode == 2) {
        if (level == 20) {
            setMedal(4, "gold");
        } else if (level >= 15) {
            setMedal(4, "silver");
        } else if (level >= 10) {
            setMedal(4, "bronze");
        } else {
            setMedal(4, "blank");
        }
        $("#endScoreScoreLabel").text("Score");
        $("#endScoreScore").text(level);
        $("#endScoreScoreSub").text(level == 1 ? "level" : "levels");
    } else if (game.props.mode == 3) {
        // Score based on completion percentage
        var completed = trueCount(stats.puzzleCompletion);
        if (completed == 12) {
            setMedal(4, "gold");
        } else if (completed >= 8) {
            setMedal(4, "silver");
        } else if (completed >= 4) {
            setMedal(4, "bronze");
        } else {
            setMedal(4, "blank");
        }
        $("#endScoreScoreLabel").text("Progress");
        $("#endScoreScore").text(Math.floor(completed / .12) + "%");
        $("#endScoreScoreSub").text("solved");
    }

    // If the player wins
    if (result == "win") {
        if (game.props.mode != 2) {
            $("#endText").text("Progress Report");
        } else {
            $("#endText").text("Great Success");
        }
        $("#endSubText").css({
            opacity: 0
        });
        $(".endErrorText").css({
            opacity: 0
        });
    }
    // If the player loses
    else if (result == "lose") {
        gameLost = true;
        $("#endText").text("Game Over");
        $("#endSubText").css({
            opacity: 0
        });
        $(".endErrorText").css({
            opacity: 1
        });
    }
    checkHighScores();
    checkChallenges();
    postData();
    //console.log(studentData);
    refreshHighScores();
    // Show the menu
    showMenu();
}

function checkHighScores() {
    // Check for high scores
    if (props.mode == 1) {
        if (practiceCompletion() > studentData.highScores[0]) {
            studentData.highScores[0] = practiceCompletion();
        }
        if (studentData.highScores[0] >= 1) {
            studentData.unlocks[0] = true;
        }
    } else if (props.mode == 2) {
        if (level > studentData.highScores[1]) {
            studentData.highScores[1] = level;
        }
        if (studentData.highScores[1] >= 10) {
            studentData.unlocks[1] = true;
        }
    } else if (props.mode == 3) {
        if (trueCount(stats.puzzleCompletion) > studentData.highScores[2]) {
            studentData.highScores[2] = trueCount(stats.puzzleCompletion);
        }
        if (studentData.highScores[2] >= 1) {
            studentData.unlocks[2] = true;
        }
    }
}

/*
    startStep: this function is called whenever a step starts
    this is the "set-up" phase for a particular step
    specify code that should be executed when a step starts (animations, etc)
*/
function startStep(step) {
    // Sample: this is called when step1 starts
    if (step == step1) {
        // console.log("Starting step 1");
    }
}

/*
    startStep: this function is called whenever a step ends
    this is the "clean-up" phase for a particular step
    specify code that should be executed when a step ends (animations, etc)
*/
function endStep(step) {
    // Sample: this is called when step1 has ended
    if (step == step1) {
        // console.log("Step 1 has ended");
    }
}

/*
    loadStartMenu: this function shows the menu at the start of the game
*/
function loadStartMenu() {
    // Set the header text
    $("#headerText").text("Centrifuge");
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
        $("#scoreBox1").text("Progress: " + Math.floor(studentData.highScores[0] / .21) + "%");
        if (studentData.highScores[0] == 21) {
            setMedal(1, "gold");
        } else if (studentData.highScores[0] >= 14) {
            setMedal(1, "silver");
        } else if (studentData.highScores[0] >= 7) {
            setMedal(1, "bronze");
        }
    } else {
        $("#scoreBox1").text("");
    }
    if (studentData.highScores[1] > 0) {
        $("#scoreBox2").text("Best: " + studentData.highScores[1] + " level" + (studentData.highScores[1] == 1 ? "" : "s"));
        if (studentData.highScores[1] == 20) {
            setMedal(2, "gold");
        } else if (studentData.highScores[1] >= 15) {
            setMedal(2, "silver");
        } else if (studentData.highScores[1] >= 10) {
            setMedal(2, "bronze");
        }
    } else {
        $("#scoreBox2").text("");
    }
    if (studentData.highScores[2] > 0) {
        // Puzzle mode
        $("#scoreBox3").text("Solved: " + Math.floor(studentData.highScores[2] / .12) + "%");
        if (studentData.highScores[2] == 12) {
            setMedal(3, "gold");
        } else if (studentData.highScores[2] >= 8) {
            setMedal(3, "silver");
        } else if (studentData.highScores[2] >= 4) {
            setMedal(3, "bronze");
        }
    } else {
        $("#scoreBox3").text("");
    }
}

function setMedal(id, medal) {
    $("#medal" + id).css({
        "background-image": "url(../resources/img/medal_" + medal + ".svg)"
    });
}

function showMenu() {
    exitHUD();
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
    enterHUD();
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
        $("#endOptionDescText2").html("Some tubes are already in the centrifuge. Add more to balance it, but don't blow up the lab!");
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
        $("#endOptionDescText3").html("Solve puzzles to test your centrifuge skills.");
        $("#endOption3").removeClass("endOptionLocked");
        $("#endOption3").addClass("endOptionUnlocked");
    } else {
        // Lock
        $("#endOptionDescText3").html("Locked! <br> Clear level 10 of Challenge mode to unlock.");
        $("#endOption3").removeClass("endOptionUnlocked");
        $("#endOption3").addClass("endOptionLocked");
    }
}

function updateBannedWells() {
    bannedWells = [];
    for (var i = 0; i < 24; i++) {
        bannedWells.push(false);
    }
    if (game != undefined) {
        if (game.props.mode == 3) {
            if (puzzleSelected == 2) {
                for (var i = 0; i < 24; i++) {
                    if (wellStates[i]) {
                        bannedWells[(i + 1) % 24] = true;
                        bannedWells[(i + 23) % 24] = true;
                    }
                }
            } else if (puzzleSelected == 5) {
                for (var i = 0; i < 24; i++) {
                    if (wellStates[i]) {
                        bannedWells[(i + 12) % 24] = true;
                    }
                }
            } else if (puzzleSelected == 8) {
                for (var i = 0; i < 6; i++) {
                    bannedWells[i] = true;
                }
            } else if (puzzleSelected == 11) {
                for (var i = 0; i < 24; i++) {
                    if (wellStates[(i + 8) % 24] && wellStates[(i + 16) % 24]) {
                        bannedWells[i] = true;
                    }
                }
            }
        }
    }
}

function updateTubeDisplay() {
    updateBannedWells();
    $(window).mousemove();
    if (totalTubes == -1) {
        $("#tube_count").text("∞");
    } else if (tubesLeft >= 0) {
        $("#tube_count").text((tubesLeft < 10 ? "0" : "") + tubesLeft);
    }
    for (var i = 0; i < 24; i++) {
        if (wellStates[i] || bannedWells[i]) {
            $("#centrifuge_well_marker" + i).css("opacity", 1);
        } else {
            $("#centrifuge_well_marker" + i).css("opacity", 0);
        }
        if (lockedWells[i]) {
            $("#centrifuge_well_marker" + i).css("background-image", "url('img/well_locked.svg')");
        } else {
            $("#centrifuge_well_marker" + i).css("background-image", "url('img/well_marker.svg')");
        }
        if (bannedWells[i]) {
            $("#centrifuge_well_marker" + i).css("background-image", "url('img/well_banned.svg')");
            $("#centrifuge_well_marker" + i).css("opacity", .4);
        }
    }
    $(".tube_count_button").removeClass("tube_count_selected");
    $(".tube_count_button").removeClass("tube_count_complete");
    $(".tube_count_button").removeClass("tube_count_incomplete");
    $(".tube_count_button_number").removeClass("tube_count_number_selected");
    $(".tube_count_button_number").removeClass("tube_count_number_complete");
    $(".tube_count_button_number").removeClass("tube_count_number_incomplete");
    for (var i = 0; i < stats.practiceWinDetails.length; i++) {
        if (totalTubes == i + 2) {
            // Currently selected
            $("#tube_count_button" + i).addClass("tube_count_selected");
            $("#tube_count_button_number" + i).addClass("tube_count_number_selected");
        } else if (stats.practiceWinDetails[i]) {
            // Completed
            $("#tube_count_button" + i).addClass("tube_count_complete");
            $("#tube_count_button_number" + i).addClass("tube_count_number_complete");
        } else {
            // Not completed
            $("#tube_count_button" + i).addClass("tube_count_incomplete");
            $("#tube_count_button_number" + i).addClass("tube_count_number_incomplete");
        }
    }
    $(".puzzleButton").removeClass("tube_count_selected");
    $(".puzzleButton").removeClass("tube_count_complete");
    $(".puzzleButton").removeClass("tube_count_incomplete");
    $(".puzzleButtonNumber").removeClass("tube_count_number_selected");
    $(".puzzleButtonNumber").removeClass("tube_count_number_complete");
    $(".puzzleButtonNumber").removeClass("tube_count_number_incomplete");
    for (var i = 0; i < 12; i++) {
        if (puzzleSelected == i) {
            // Currently selected
            $("#puzzleButton" + i).addClass("tube_count_selected");
            $("#puzzleButtonNumber" + i).addClass("tube_count_number_selected");
        } else if (stats.puzzleCompletion[i]) {
            // Completed
            $("#puzzleButton" + i).addClass("tube_count_complete");
            $("#puzzleButtonNumber" + i).addClass("tube_count_number_complete");
        } else {
            // Not completed
            $("#puzzleButton" + i).addClass("tube_count_incomplete");
            $("#puzzleButtonNumber" + i).addClass("tube_count_number_incomplete");
        }
    }
    // Puzzle mode best score
    if (puzzleSelected == -1) {
        $("#puzzle_best_text").css("color", "#a0a0a0");
    } else {
        $("#puzzle_best_text").text(stats.puzzleScores[puzzleSelected] != 0 ? "Best: " + stats.puzzleScores[puzzleSelected] + " tubes" : "");
        if (stats.puzzleCompletion[puzzleSelected]) {
            $("#puzzle_best_text").css("color", "#2AB673");
        } else {
            $("#puzzle_best_text").css("color", "#a0a0a0");
        }
    }

}

function clearTubes() {
    wellStates = [];
    lockedWells = [];
    tubesLeft = totalTubes;
    for (var i = 0; i < 24; i++) {
        wellStates.push(false);
        lockedWells.push(false);
    }
    updateTubeDisplay();
}

function resetTubes() {
    wellStates = [];
    lockedWells = [];
    tubesLeft = totalTubes;
    for (var i = 0; i < 24; i++) {
        wellStates.push(false);
        lockedWells.push(false);
    }
    if (game.props.mode == 2) {
        loadLevel(level);
    }
    updateTubeDisplay();
}

function spinCentrifuge() {
       stats.practiceTryCount =  stats.practiceTryCount || new Array(22).fill(0);
        
        stats.practiceTryCount[totalTubes-2]++;
    // Disable controls
    controlsOn = false;
    setTimeout(function () {
        controlsOn = true;
    }, 4000);
    // Check if balanced
    var x_off = 0;
    var y_off = 0;
    for (var i = 0; i < 24; i++) {
        if (wellStates[i]) {
            x_off += Math.cos(i * Math.PI / 12);
            y_off += Math.sin(i * Math.PI / 12);
        }
    }
    var isBalanced = false;
    if (Math.abs(x_off) < .001 && Math.abs(y_off) < .001) {
        // Balanced
        isBalanced = true;
    }
    // Apply spin animation
    $("#centrifuge_spin").addClass("anim_spin");
    // Apply screen shake animation
    var spinFrame = 0;
    var spinIntervalID = setInterval(function () {
        spinFrame++;
        var scale = 0;
        if (spinFrame < 130) {
            scale = spinFrame / 130;
        } else {
            scale = 1;
        }
        var intensity = 3 * Math.sqrt(Math.abs(x_off) * Math.abs(x_off) + Math.abs(y_off) * Math.abs(y_off)) * scale;
        var x = intensity * (Math.random() - .5);
        var y = intensity * (Math.random() - .5);
        $("#centrifugeView").css({
            'left': x + "%",
            'top': y + "%"
        });
        if (spinFrame >= 400) {
            clearInterval(spinIntervalID);
            spinIntervalID = -1;
            $("#centrifuge_spin").removeClass("anim_spin");
            $("#centrifugeView").css({
                'left': "0%",
                'top': "0%"
            });
        }
    }, 10);
    // If imbalanced, apply some more animations
    if (!isBalanced) {
        // Fade out the UI
        exitHUD();
        // After accelerating, explode the tubes
        setTimeout(function () {
            explodeTubes();
            clearTubes();
        }, 1300);
        // Fade to white after the tubes explode
        setTimeout(function () {
            whiteFadeIn();
        }, 1400);
        // Fade in UI
        if (game.props.mode != 2) {
            setTimeout(function () {
                enterHUD();
            }, 1750);
        }
        // Show the fail text
        setTimeout(function () {
            showFailText();
        }, 1900);
        // Hide the fail text
        setTimeout(function () {
            hideFailText();
        }, 3750);
        // Fade white screen out
        setTimeout(function () {
            whiteFadeOut();
            resetTubes();
            if (game.props.mode < 3) {
                endGame("lose");
            } else if (game.props.mode == 3) {
                loadPuzzle(puzzleSelected);
            }
        }, 4000);
    }
    // If balanced, mark as correct
    else {
        // Checkmark animation; also show success message
        setTimeout(function () {
            if (game.props.mode == 1) {
                completeTubeNumber(totalTubes - 2);
            }
            var optimized = false;
            if (game.props.mode == 3) {
                if (tubesInCentrifuge() == puzzleData[puzzleSelected].perfect) {
                    optimized = true;
                }
            }
            $("#feedback_bottom").removeClass("anim_feedback_bottom_out");
            $("#feedback_bottom").addClass("anim_feedback_bottom_in");
            // Pick a random success message
            var successMessages = ["Correct!", "Nice!", "Well done!", "Balanced!", "Awesome!", "Spectacular!", "Amazing!", "That's right!", "Incredible!", "Excellent!"];
            var optimalMessages = ["Optimal!", "Solved it!", "Perfect!"];
            var subOptimalMessages = ["Almost...", "Not quite...", "Try again..."];
            var message = "";
            if (game.props.mode != 3) {
                message = getRandomItem(successMessages);
            } else if (game.props.mode == 3 && optimized) {
                message = getRandomItem(optimalMessages);
            } else if (game.props.mode == 3 && !optimized) {
                message = getRandomItem(subOptimalMessages);
            }
            $("#feedback_bottom_text").text(message);
        }, 2000);
        // Exit success message
        setTimeout(function () {
            $("#feedback_bottom").removeClass("anim_feedback_bottom_in");
            $("#feedback_bottom").addClass("anim_feedback_bottom_out");
        }, 3750);
        // Reset tubes and set maximum to least incomplete number
        setTimeout(function () {
            stats.tubesBalanced += tubesInCentrifuge();
            if (game.props.mode == 1) {
                if (checkMeta()) {
                    practiceMeta = true;
                }
                practiceWinStreakNum += totalTubes;
                if (practiceWinStreakNum >= 100) {
                    practiceWinStreak = true;
                }
               totalTubes = leastIncompleteNumber();
                resetTubes();
            } else if (game.props.mode == 2) {
                level++;
                tubesUsed += tubesInCentrifuge();
                // Optimal challenges
                if (level >= 10 && tubesUsed <= 70) {
                    optimal[0] = true;
                }
                if (level >= 15 && tubesUsed <= 140) {
                    optimal[1] = true;
                }
                if (level >= 20 && tubesUsed <= 235) {
                    optimal[2] = true;
                }
                if (level >= 20) {
                    endGame("win");
                } else {
                    resetTubes();
                }
            } else if (game.props.mode == 3) {
                var optimized = false;
                if (tubesInCentrifuge() == puzzleData[puzzleSelected].perfect) {
                    optimized = true;
                }
                if (puzzleSelected % 3 == 2) {
                    // More is better
                    if (tubesInCentrifuge() > stats.puzzleScores[puzzleSelected]) {
                        // High score
                        stats.puzzleScores[puzzleSelected] = tubesInCentrifuge();
                    }
                } else {
                    // Less is better
                    if (tubesInCentrifuge() < stats.puzzleScores[puzzleSelected] || stats.puzzleScores[puzzleSelected] == 0) {
                        // High score
                        stats.puzzleScores[puzzleSelected] = tubesInCentrifuge();
                    }
                }
                updateTubeDisplay();
                if (optimized) {
                    stats.puzzleCompletion[puzzleSelected] = true;
                    puzzleSelected = -1;
                    showPuzzleBox();
                    resetTubes();
                    setPuzzleModeText();
                }
            }
        }, 4000);
    }
}

function setPuzzleModeText() {
    // Puzzle Mode Text
    $("#puzzle_title").text("Puzzle Mode");
    $("#puzzle_help_text").text("Select a puzzle to solve.");
    $("#puzzle_best_text").text("Solved: " + trueCount(stats.puzzleCompletion) + "/12");
}

function leastIncompleteNumber() {
    var i = 0;
    while (stats.practiceWinDetails[i] == true) {
        i++;
    }
    if (i >= stats.practiceWinDetails.length) {
        i = 0;
    }
    return i + 2;
}

function exitHUD() {
    if (showingHUD) {
        $("#hud").removeClass("anim_whiteScreen_fade_in");
        $("#hud").addClass("anim_whiteScreen_fade_out");
        showingHUD = false;
    }
}

function enterHUD() {
    if (!showingHUD) {
        $("#hud").removeClass("anim_whiteScreen_fade_out");
        $("#hud").addClass("anim_whiteScreen_fade_in");
        showingHUD = true;
    }
}

function whiteFadeIn() {
    $("#whiteScreen").removeClass("anim_whiteScreen_fade_out");
    $("#whiteScreen").addClass("anim_whiteScreen_fade_in");
}

function whiteFadeOut() {
    $("#whiteScreen").removeClass("anim_whiteScreen_fade_in");
    $("#whiteScreen").addClass("anim_whiteScreen_fade_out");
}

function showFailText() {
    $("#failTextBox").removeClass("anim_failTextBox_fade_out");
    $("#failTextBox").addClass("anim_failTextBox_fade_in");
}

function hideFailText() {
    $("#failTextBox").removeClass("anim_failTextBox_fade_in");
    $("#failTextBox").addClass("anim_failTextBox_fade_out");
}

function getNumberButtonCoords(i) {
    var offset = 0;
    if (i <= 2) offset = -17.5;
    if (i >= 18) offset = 17.5;
    var out = {};
    out.x = 17.5 * ((i + 2) % 5) + 7.5 + offset;
    out.y = 17.5 * Math.floor((i + 2) / 5) + 7.5;
    return out;
}

function getPuzzleButtonCoords(i) {
    var out = {};
    out.x = (17.5 + 25 * (i % 3));
    out.y = (12.5 + 20 * Math.floor(i / 3));
    return out;
}

function completeTubeNumber(i) {
   
    var pos = getNumberButtonCoords(i);
    if(!stats.practiceWinTimes)
 	{
	stats.practiceWinTimes = new Array(22).fill(false);
	}
    stats.practiceWinDetails[i] = true;
    stats.practiceWinTimes[i]=Date.now();
    $("#checkmark_box").css({
        'left': pos.x + "%",
        'top': pos.y + "%"
    });
    $("#checkmark").addClass("anim_checkmarkIn");
    setTimeout(function () {
        updateTubeDisplay();
    }, 1000);
    setTimeout(function () {
        $("#checkmark").removeClass("anim_checkmarkIn");
    }, 2000);
}

function makeLevels() {
    levelData = [];
    for (var i = 0; i < 20; i++) {
        var level = [];
        var pool = [];
        // Fill pool
        for (var j = 0; j < 24; j++) {
            pool.push(j);
        }
        for (var j = 0; j < 2 + Math.floor(i / 1.5); j++) {
            var r = Math.floor(Math.random() * pool.length);
            level.push(pool[r]);
            pool.splice(r, 1);
            level.sort(function (a, b) {
                return a - b;
            });
        }
        levelData.push(level);
    }
}

function makeBetterLevels() {
    levelData = [];
    var maxVariance = 0;
    for (var i = 0; i < 20; i++) {
        var level = [];
        var numTubes = 2 + i;
        // Partition the tubes into the four sections (mod 0, mod 1, mod 2, mod 3)
        var part = getRandomItem(getAllPartitions(numTubes));
        shuffle(part);
        // Fill the sections based on the number of tubes obtained in the last step
        for (var j = 0; j < 4; j++) {
            var toAdd = [];
            if (part[j] == 2) {
                // Add one at random, other must be filled in
                var rand = Math.floor(6 * Math.random());
                toAdd.push(rand);
            } else if (part[j] == 3) {
                // Add two random ones which are 2/6 apart
                var rand = Math.floor(6 * Math.random());
                toAdd.push(rand);
                toAdd.push((rand + 2) % 6);
                maxVariance++;
            } else if (part[j] == 4) {
                // Add two random ones which are adjacent to each other
                var rand = Math.floor(6 * Math.random());
                toAdd.push(rand);
                toAdd.push((rand + 1) % 6);
            } else if (part[j] == 6) {
                // Add three in a row, randomly
                var rand = Math.floor(6 * Math.random());
                toAdd.push(rand);
                toAdd.push((rand + 1) % 6);
                toAdd.push((rand + 2) % 6);
            }
            for (var k = 0; k < toAdd.length; k++) {
                level.push(4 * toAdd[k] + j);
            }
        }
        level.sort(function(a, b) {
            return a - b;
        });
        //console.log(part);
        //console.log(getBestSolution(level).length);
        levelData.push(level);
    }
    //console.log("threes: " + maxVariance);
}

function loadLevel(n) {
    var level = levelData[n];
    for (var i = 0; i < level.length; i++) {
        wellStates[level[i]] = true;
        lockedWells[level[i]] = true;
    }
    updateTubeDisplay();
    $("#level_display").text("Level " + (n + 1));
    $("#tubes_used_display").text(tubesUsed);
}

function loadPuzzle(n) {
    puzzleSelected = n;
    totalTubes = -1;
    $("#puzzle_title").text(puzzleData[n].title);
    $("#puzzle_help_text").text(puzzleData[n].desc);
    if (stats.puzzleScores[n] > 0) {
        $("#puzzle_best_text").text("Best: " + stats.puzzleScores[n] + " tubes");
    } else {
        $("#puzzle_best_text").text("");
    }
    resetTubes();
    for (var i = 0; i < puzzleData[n].locked.length; i++) {
        wellStates[puzzleData[n].locked[i] - 1] = true;
        lockedWells[puzzleData[n].locked[i] - 1] = true;
    }
    hidePuzzleBox();
    updateTubeDisplay();
}

function hidePuzzleBox() {
    $("#box_right2").removeClass("anim_showPuzzleBox");
    $("#box_right2").addClass("anim_hidePuzzleBox");
}

function showPuzzleBox() {
    $("#box_right2").removeClass("anim_hidePuzzleBox");
    $("#box_right2").addClass("anim_showPuzzleBox");
    checkPuzzleSetLocks();
}

function tubesInCentrifuge() {
    var total = 0;
    for (var i = 0; i < 24; i++) {
        if (wellStates[i]) {
            total++;
        }
    }
    return total;
}

function practiceCompletion() {
    var total = 0;
    for (var i = 0; i < 24; i++) {
        if (stats.practiceWinDetails[i]) {
            total++;
        }
    }
    return total;
}

function trueCount(list) {
    var total = 0;
    for (var i = 0; i < 24; i++) {
        if (list[i]) {
            total++;
        }
    }
    return total;
}

function checkMeta() {
    for (var i = 0; i < 24; i++) {
        if (wellStates[i]) {
            if (i == 0 || i > 21) {
                return false;
            }
            if (!stats.practiceWinDetails[i - 1]) {
                return false;
            }
        }
    }
    return true;
}

function getRandomItem(list) {
    return list[Math.floor(list.length * Math.random())];
}

function shuffle(array) {
    var i = 0,
        j = 0,
        temp = null;

    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
