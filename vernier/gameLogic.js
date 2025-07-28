// Game object
var game;

var UNLOCK_EVERYTHING = false;

// You can define step object references here for convenience if your IDE has code completion. If not, then go download Brackets and use that instead, and your quality of life will be greatly improved
var step1;
var step2;
var step3;

var cylinders = [];
var zoomCylinder = -1;

var questions = [];

var score = 0;
var completed = 0;
var progress = 0;
var phase = 0;
var lives = 3;
var currentCylinder = 0;
var cylDiff = 0;
var lineDiff = 0;
var gradMistakes = 0;
var volMistakes = 0;
var lastCyl = 0;

var currentZoom = 1;
var caliperDisplay = 0;

var startDate;
var stopDate;

// Speed achievements
var startTime = 0;
var stopTime = 0;
var practiceSpeed = false;
var challengeSpeed = false;
var challengePlusSpeed = false;

var noMedalPractice = false;

var hint1;
var hint2;

const allVolumes = [10, 20, 50, 100, 200, 500, 1000];

var userNetID = "";
var firstName = "";

var netID = "";

var checksPerQuestion = 2;

var objects = ["step_finished", "knob", "research_pipette", "cuvette_empty", "pipette_tip", "watch", "test_tube", "tiny_spect", "cylinder10"];

// Stats
var stats = {
    practiceWins: 0,
    challengeWins: 0,
    challengePlusWins: 0,
    measuredObjects: 0,
    objectRecord: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    challengeStates: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
};

var cylProps = {
    props: [
        {
            "volume": 10,
            "interval": .1,
            "majorLabeled": 1,
            "majorUnlabeled": .5,
            "meniscusClass": "meniscusTall"
        },
        {
            "volume": 20,
            "interval": .2,
            "majorLabeled": 2,
            "majorUnlabeled": 1,
            "meniscusClass": "meniscusTall"
        },
        {
            "volume": 50,
            "interval": 1,
            "majorLabeled": 10,
            "majorUnlabeled": 5,
            "meniscusClass": "meniscusMedium"
        },
        {
            "volume": 100,
            "interval": 1,
            "majorLabeled": 10,
            "majorUnlabeled": 5,
            "meniscusClass": "meniscusMedium"
        },
        {
            "volume": 200,
            "interval": 2,
            "majorLabeled": 20,
            "majorUnlabeled": 10,
            "meniscusClass": "meniscusMedium"
        },
        {
            "volume": 500,
            "interval": 5,
            "majorLabeled": 100,
            "majorUnlabeled": 50,
            "meniscusClass": "meniscusShort"
        },
        {
            "volume": 1000,
            "interval": 10,
            "majorLabeled": 100,
            "majorUnlabeled": 50,
            "meniscusClass": "meniscusShort"
        }
    ]
};

var modeNames = ["Practice", "Challenge", "Challenge+"];

var studentData = {}; // Student data
var gameData = {}; // Data for the round being played
var questionData = {}; // Data for the current question

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
    // console.log(props);
    resetLives();
    $(".progressCheckState").removeClass("completeIcon");
    $(".progressCheckState").addClass("incompleteIcon");
    currentZoom = 1;
    if (props.mode == 1) {
        // Reset game variables
        score = 0;
        completed = 0;
        progress = 0;
        phase = 0;
        lives = 3;
        // Prepare questions
        questions = [];
        for (var i = 0; i < 10000; i++) {
            questions[i] = 1 + Math.floor(Math.random() * 900) / 100;
        }
        setTimeout(function () {
            showHUD();
        }, 1000);
        // Set title
        $("#headerText").text("Answer the questions.");
        // Set some HUD text
        // $("#progressLabel2").text("of " + volumes.length);
        setTimeout(function () {
            $("#entryInput").focus();
        }, 1500);
    }
    if (props.mode >= 2) {
        // Reset game variables
        score = 0;
        completed = 0;
        lives = 3;
        // Prepare questions
        questions = [];
        for (var i = 0; i < 10; i++) {
            questions[i] = 1 + Math.floor(Math.random() * 900) / 100 + (props.mode == 3 ? 0.005 : 0);
        }
        setTimeout(function () {
            showHUD();
        }, 1000);
        // Set title
        $("#headerText").text("Read the vernier caliper.");
        // Set some HUD text
        setTimeout(function () {
            $("#entryInput").focus();
        }, 1500);
    }
    startDate = new Date();
    startTime = new Date().getTime();
    // Initialize the object that stores game data
    gameData = {
            "mode": (modeNames[game.props.mode - 1]),
            "startTime": startDate,
            "endTime": 0,
            "elapsedTime": 0,
            "questions": [],
            "score": 0
        }
        // console.log(startDate);
    newQuestion();
    hideMenu();
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
    $("#endScoreScore").text(game.props.mode == 1 ? completed : score);
    $("#endScoreScoreSub").text(game.props.mode == 1 ? "questions" : "points");
    var boostLevel = 0;
    if (game.props.mode == 1) {
        if (completed == 5) {
            setMedal(4, "gold");
            boostLevel += 3;
        } else if (completed <= 7) {
            setMedal(4, "silver");
            boostLevel += 2;
        } else if (completed <= 10) {
            setMedal(4, "bronze");
            boostLevel += 1;
        } else {
            setMedal(4, "blank");
            // No-medal Practice
            noMedalPractice = true;
        }
    } else {
        if (score == 100) {
            setMedal(4, "gold");
            boostLevel += 3;
        } else if (score >= 90) {
            setMedal(4, "silver");
            boostLevel += 2;
        } else if (score >= 80) {
            setMedal(4, "bronze");
            boostLevel += 1;
        } else {
            setMedal(4, "blank");
        }
    }
    boostLevel += 2 * (game.props.mode - 1);

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
        // Apply boost
        boostObjectRecord(1 + .05 * boostLevel);
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
    // Log end time
    endDate = new Date();
    endTime = new Date().getTime();
    gameData.endTime = endDate;
    var totalTime = ((endTime - startTime) / 1000);
    console.log(totalTime + " seconds");
    // Speed achievements
    if (game.props.mode == 1 && totalTime <= 60 && result == "win") {
        practiceSpeed = true;
    }
    if (game.props.mode == 2 && totalTime <= 90 && result == "win") {
        challengeSpeed = true;
    }
    if (game.props.mode == 3 && totalTime <= 120 && result == "win") {
        challengePlusSpeed = true;
    }
    gameData.endTime = endDate;
    gameData.elapsedTime = formatTime((endDate.valueOf() - startDate.valueOf()) / 1000);
    if (props.mode == 1) {
        gameData.score = completed + 1;
    } else {
        gameData.score = score;
    }
    if (result == "lose") {
        // Add last question data to game data
        gameData.questions.push(questionData);
    }
    // Add the game results to the student's record
    studentData.gameRecord.push(gameData);
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
    $("#headerText").text("Vernier Caliper");
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
        "background-image": "url(../resources/img/medal_" + medal + ".svg)"
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

function Cylinder(id, volume, half) {
    this.id = id;
    this.volume = volume;
    this.height = 6 * (Math.pow(this.volume / 10, 1 / 3));
    this.getInterval = function () {
        var list = cylProps.props;
        for (var i = 0; i < list.length; i++) {
            if (list[i].volume == this.volume) {
                return list[i].interval;
            }
        }
        return 0;
    }
    this.getClass = function () {
        var list = cylProps.props;
        for (var i = 0; i < list.length; i++) {
            if (list[i].volume == this.volume) {
                return list[i].meniscusClass;
            }
        }
        return "";
    }
    this.setFluidHeight = function (newFluidHeight) {
        // Change stored height
        this.fluidHeight = newFluidHeight;
        this.fluidPercent = this.fluidHeight / this.volume;
        var pct = this.fluidPercent;
        // Change visual height
        $("#fluid" + id).css({
            'top': (94.45 - 75.75 * pct) + "%",
            'height': (75.75 * pct) + "%"
        });
        if (this.getClass() == "meniscusTall") {
            $("#meniscus" + id).css({
                'top': (91.8 - 75.75 * pct) + "%"
            });
        } else if (this.getClass() == "meniscusMedium") {
            $("#meniscus" + id).css({
                'top': (91.8 - 75.75 * pct) + "%"
            });
        } else if (this.getClass() == "meniscusShort") {
            $("#meniscus" + id).css({
                'top': (91.8 - 75.75 * pct) + "%"
            });
        }
    }
    this.interval = this.getInterval();
    this.fluidHeight = this.interval * Math.floor((this.volume / this.interval) * (.1 + .8 * Math.random()));
    if (half) {
        this.fluidHeight -= this.getInterval() / 2;
    }
    this.fluidPercent = this.fluidHeight / this.volume;
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

function newQuestion() {
    questionData = {

    }
    $("#hintText1").text("");
    $("#hintText2").text("");
    setCaliper(questions[completed]);
}

function submitEntry() {
    var input = $("#entryInput").val();
    if (input != "") {
        if (game.props.mode == 1) {
            if (phase == 0) {
                // Read the zero on the vernier scale.
                if (Math.abs(input - Math.floor(10 * questions[completed]) / 10) < .00001) {
                    // Correct
                    answerCorrect();
                } else {
                    // Incorrect
                    answerIncorrect();
                }
            } else if (phase == 1) {
                // Which of the vernier scale lines matches the fixed scale line?
                if (Math.abs(input - 100 * (questions[completed] - Math.floor(10 * questions[completed]) / 10)) < .00001) {
                    // Correct
                    answerCorrect();
                } else {
                    // Incorrect
                    answerIncorrect();
                }
            } else if (phase == 2) {
                // Read the vernier scale.
                console.log(questions[completed]);
                if (Math.abs(input - questions[completed]) < .00001) {
                    // Correct
                    answerCorrect();
                } else {
                    // Incorrect
                    answerIncorrect();
                }
            }
        } else {
            if (Math.abs(input - questions[completed]) < .00001) {
                // Correct
                answerCorrect();
            } else {
                // Incorrect
                answerIncorrect();
            }
        }
        $("#entryInput").val("");
    }
}

function answerCorrect() {
    if (game.props.mode == 1) {
        if (phase == 0) {
            phase = 1;
            if (currentZoom > 1 && progress == 0) {
                hintFade(1, false);
                hintFade(2, true);
            }
            $("#hintText1").text(hint1);
        } else if (phase == 1) {
            phase = 2;
            if (currentZoom > 1) {
                hintFade(2, false);
            }
            $("#hintText2").text(hint2);
        } else if (phase == 2) {
            // Add question data to game data
            gameData.questions.push(questionData);
            phase = 0;
            score += 10;
            completed++;
            stats.measuredObjects++;
            for (var i = 0; i < checksPerQuestion; i++) {
                animateCompleteCheckState(progress);
                progress++;
            }
            if (progress < 10) {
                newQuestion();
                if (currentZoom > 1 && progress == 0) {
                    hintFade(1, true);
                }
            } else {
                setTimeout(function () {
                    hideHUD();
                    zoom(1, .5, .5);
                }, 500);
                setTimeout(function () {
                    endGame("win");
                }, 1500);
            }
        }
        $(".correctText").addClass("anim_textGreen");
        setTimeout(function () {
            $(".correctText").removeClass("anim_textGreen");
        }, 500);
    } else {
        animateCompleteCheckState(completed);
        // Add question data to game data
        //gameData.questions.push(questionData);
        animateCompleteCheckState(completed);
        completed++;
        phase = 0;
        score += 7 + lives;
        stats.measuredObjects++;
        if (completed < questions.length) {
            newQuestion();
        } else {
            setTimeout(function () {
                hideHUD();
                zoom(1, .5, .5);
            }, 500);
            setTimeout(function () {
                endGame("win");
            }, 1500);
        }
        $(".correctText").addClass("anim_textGreen");
        setTimeout(function () {
            $(".correctText").removeClass("anim_textGreen");
        }, 500);
    }
    updateHUD();
}

function answerIncorrect() {
    if (game.props.mode == 1) {
        if (phase == 0) {
            gradMistakes++;
        } else if (phase == 1) {
            volMistakes++;
        }
        if (progress > 0) {
            progress--;
            animateFailCheckState(progress);
            // Show hint if progress is now 0
            if (progress == 0) {
                if (phase == 0) {
                    hintFade(1, true);
                } else if (phase == 1) {
                    hintFade(2, true);
                }
            }
        }
        $(".incorrectText").addClass("anim_textRed");
        setTimeout(function () {
            $(".incorrectText").removeClass("anim_textRed");
        }, 500);
    }
    if (game.props.mode >= 2) {
        loseLife();
        updateHUD();
        $(".incorrectText").addClass("anim_textRed");
        setTimeout(function () {
            $(".incorrectText").removeClass("anim_textRed");
        }, 500);
    }
}

function loseLife() {
    var heart = $("#heart" + lives);
    heart.addClass("anim_heartBreak");
    lives--;
    if (lives == 0) {
        setTimeout(function () {
            hideHUD();
            zoom(1, .5, .5);
        }, 500);
        setTimeout(function () {
            endGame("lose");
        }, 1500);
    }
}

function resetLives() {
    for (var i = 1; i <= 3; i++) {
        var heart = $("#heart" + i);
        heart.removeClass("anim_heartBreak");
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

// Set the measure of the caliper to x inches
// 1 inch = 5.618%
function setCaliper(x) {
    // Set the actual caliper
    caliperDisplay = x;
    console.log(x);
    $('.caliper_slide').animate({
        'foo': 20 * x
    }, {
        step: function (foo) {
            $(this).attr('transform', "translate(" + foo + ", 0)");
        },
        duration: 500
    });
    // Hints
    hint1 = Math.floor(x * 10) / 10;
    if (hint1 == Math.floor(hint1)) {
        hint1 = hint1 + ".0";
    }
    hint2 = Math.round(100 * (x - Math.floor(x * 10) / 10));
    var hintPct1 = (14.2 + 5.2125 * hint1);
    var hintPct2 = hintPct1 + 0.515 * hint2;
    var objectWidth = 5.2125 * x;
    $("#hintBubble1Text").text(hint1);
    $("#hintBubble2Text").text(hint2);
    $("#hintBubble1").animate({
        'left': hintPct1 + '%'
    }, 500);
    $("#hintBubble2").animate({
        'left': hintPct2 + '%'
    }, 500);
    if (currentZoom == 3) {
        zoom(3, (caliperDisplay / 12.5), .415);
    }
    $("#object").removeClass("anim_enterObject");
    $("#object").addClass("anim_exitObject");
    setTimeout(function () {
        $("#object").removeClass("anim_exitObject");
        $("#object").addClass("anim_enterObject");
    }, 375);
    setTimeout(function (w, x) {
        $("#object").css({
            'width': w + "%"
        });
        setObjectImage(x);
    }, 250, objectWidth, x);
}

function setObjectImage(w) {
    // Get object range based on width of object
    var range = Math.floor(w - 1);
    // Randomly check to see if lab object will be used
    if (Math.random() < stats.objectRecord[range]) {
        // Use lab object now and in future instances of this range
        stats.objectRecord[range] = 1000;
        $("#object").css({
            'background-image': "url('img/" + objects[range] + ".svg')"
        });
    } else {
        // Use the basic colored block instead and increase the chance of getting the lab object in the future
        if (stats.objectRecord[range] == 0) {
            stats.objectRecord[range] = .1;
        } else if (stats.objectRecord[range] < 1) {
            stats.objectRecord[range] = 1.25 * stats.objectRecord[range];
        }
        var blockNum = 1 + Math.floor(range / 3);
        $("#object").css({
            'background-image': "url('img/block" + blockNum + ".svg')"
        });
    }
    console.log(stats.objectRecord);
}

function hintFade(id, isVisible) {
    var opacity = 1;
    if (!isVisible) {
        opacity = 0;
    }
    $("#hintBubble" + id).animate({
        'opacity': opacity
    }, 250);
}

function animateCompleteCheckState(id) {
    $("#progressCheckState" + id).removeClass("completeIcon");
    $("#progressCheckState" + id).removeClass("failedIcon");
    $("#progressCheckState" + id).addClass("incompleteIcon");
    $("#progressCheckState" + id).addClass("anim_stepExit");
    setTimeout(function () {
        $("#progressCheckState" + id).removeClass("anim_stepExit");
        $("#progressCheckState" + id).removeClass("incompleteIcon");
        $("#progressCheckState" + id).addClass("anim_stepEnter");
        $("#progressCheckState" + id).addClass("completeIcon");
    }, 125);
    setTimeout(function () {
        $("#progressCheckState" + id).removeClass("anim_stepEnter");
    }, 500);
}

function animateFailCheckState(id) {
    $("#progressCheckState" + id).removeClass("failedIcon");
    $("#progressCheckState" + id).removeClass("incompleteIcon");
    $("#progressCheckState" + id).addClass("completeIcon");
    $("#progressCheckState" + id).addClass("anim_stepExit");
    setTimeout(function () {
        $("#progressCheckState" + id).removeClass("anim_stepExit");
        $("#progressCheckState" + id).removeClass("completeIcon");
        $("#progressCheckState" + id).addClass("anim_stepFail1");
        $("#progressCheckState" + id).addClass("failedIcon");
    }, 125);
    setTimeout(function () {
        $("#progressCheckState" + id).removeClass("anim_stepFail1");
        $("#progressCheckState" + id).removeClass("failedIcon");
        $("#progressCheckState" + id).addClass("anim_stepFail2");
        $("#progressCheckState" + id).addClass("incompleteIcon");
    }, 500);
    setTimeout(function () {
        $("#progressCheckState" + id).removeClass("anim_stepFail2");
    }, 750);
}

function secretObjectsFound() {
    var count = 0;
    for (var i = 0; i < 9; i++) {
        if (stats.objectRecord[i] >= 1000) {
            count++;
        }
    }
    return count;
}

function boostObjectRecord(factor) {
    for (var i = 0; i < 9; i++) {
        if (stats.objectRecord[i] == 0) {
            stats.objectRecord[i] = .1;
        } else if (stats.objectRecord[i] < 1) {
            stats.objectRecord[i] = stats.objectRecord[i] * factor;
        }
    }
    console.log(stats.objectRecord);
}