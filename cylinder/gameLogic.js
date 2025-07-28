// Game object
var game;

// You can define step object references here for convenience if your IDE has code completion. If not, then go download Brackets and use that instead, and your quality of life will be greatly improved
var step1;
var step2;
var step3;

var cylinders = [];
var zoomCylinder = -1;

var score = 0;
var completed = 0;
var phase = 0;
var lives = 3;
var currentCylinder = 0;
var cylDiff = 0;
var lineDiff = 0;
var gradMistakes = 0;
var volMistakes = 0;
var lastCyl = 0;

var currentZoom = 1;

var startDate;
var stopDate;

const allVolumes = [10, 20, 50, 100, 200, 500, 1000];

var userNetID = "";
var firstName = "";

// Speed achievements
var startTime = 0;
var stopTime = 0;
var practiceSpeed = false;
var challengeSpeed = false;
var challengePlusSpeed = false;

// No medal Practice
var noMedalPractice = false;

// Cylinder type achievement data
var cylinderTypes = [0, 0, 0, 0, 0, 0, 0];
var sameCylinder5 = false;
var all7Types = false;

// Stats
var stats = {
    practiceWins: 0,
    challengeWins: 0,
    challengePlusWins: 0,
    readCylinders: 0,
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
    // // console.log(props);
    resetLives();
    currentZoom = 1;
    cylinderTypes = [0, 0, 0, 0, 0, 0, 0];
    sameCylinder5 = false;
    all7Types = false;
    cylDiff = 0;
    lineDiff = 0;
    if (props.mode == 1) {
        // Reset game variables
        score = 0;
        completed = 0;
        phase = 0;
        lives = 3;
        lastCyl = -1;
        // Initialize cylinders
        var volumes = [];
        for (var i = 0; i < 7; i++) {
            volumes.push(allVolumes[i]);
        }
        initCylinders(volumes);
        setCylinder();
        setVolume();
        // // console.log("cylDiff: " + cylDiff + " | lineDiff: " + lineDiff + " | volume: " + cylinders[currentCylinder].fluidHeight);
        setTimeout(function () {
            zoom(currentCylinder, currentZoom);
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
        currentCylinder = 0;
        lives = 3;
        // Initialize cylinders
        var volumes = [];
        for (var i = 0; i < 10; i++) {
            volumes.push(allVolumes[Math.floor(7 * Math.random())]);
        }
        initCylinders(volumes);
        setTimeout(function () {
            zoom(currentCylinder, currentZoom);
            showHUD();
        }, 1000);
        // Set title
        $("#headerText").text("Enter the volume of the fluid.");
        // Set some HUD text
        $("#progressLabel2").text("of " + volumes.length);
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
        // // console.log(startDate);
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
    $("#endScoreScore").text(game.props.mode == 1 ? completed + 1 : score);
    $("#endScoreScoreSub").text(game.props.mode == 1 ? "questions" : "points");
    if (game.props.mode == 1) {
        if (completed + 1 == 5) {
            setMedal(4, "gold");
        } else if (completed + 1 <= 7) {
            setMedal(4, "silver");
        } else if (completed + 1 <= 10) {
            setMedal(4, "bronze");
        } else {
            setMedal(4, "blank");
            // No-medal Practice
            noMedalPractice = true;
        }
    } else {
        if (score == 100) {
            setMedal(4, "gold");
        } else if (score >= 90) {
            setMedal(4, "silver");
        } else if (score >= 80) {
            setMedal(4, "bronze");
        } else {
            setMedal(4, "blank");
        }
    }

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
            if (completed + 1 < studentData.highScores[0] || studentData.highScores[0] == 0) {
                studentData.highScores[0] = completed + 1;
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
    // Log end time
    endDate = new Date();
    endTime = new Date().getTime();
    gameData.endTime = endDate;
    var totalTime = ((endTime - startTime) / 1000);
    // console.log(totalTime + " seconds");
    // Speed achievements
    if (game.props.mode == 1 && totalTime <= 60 && result == "win") {
        practiceSpeed = true;
    }
    if (game.props.mode == 2 && totalTime <= 75 && result == "win") {
        challengeSpeed = true;
    }
    if (game.props.mode == 3 && totalTime <= 90 && result == "win") {
        challengePlusSpeed = true;
    }
    // Run timer for lolz
    if (false) {
        $("#endSubText").text("Time elapsed: " + totalTime + " seconds");
    }
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
    //// console.log(studentData);
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
        // // console.log("Starting step 1");
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
        // // console.log("Step 1 has ended");
    }
}

/*
    loadStartMenu: this function shows the menu at the start of the game
*/
function loadStartMenu() {
    // Set the header text
    $("#headerText").text("Graduated Cylinder");
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

function Cylinder(id, volume, half) {
    this.id = id;
    this.volume = volume;
    this.height = 6 * (Math.pow(this.volume / 10, 1 / 3));
    this.cylType = function () {
        for (var i = 0; i < allVolumes.length; i++) {
            if (this.volume == allVolumes[i]) {
                return i;
            }
        }
        return -1;
    }
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

function zoom(id, zoomLevel) {
    currentZoom = zoomLevel;
    // Default parameters (reset)
    var width = 100;
    var height = 100;
    var top = 0;
    var left = 0;
    if (id >= 0) {
        var cylinder = cylinders[id];
        var centerX = .25 + .5 * ((2 * id + 1) / (2 * cylinders.length));
        var centerY = .6 - .2 * (cylinder.height / 100);
        if (zoomLevel > 1) {
            var pct = cylinder.fluidPercent;
            centerY = .6 - .2 * (cylinder.height / 100) * 1.75 * pct;
        }
        height = (zoomLevel * 100) / (.5 * cylinder.height / 100);
        width = height;
        top = -1 * centerY * height + 50;
        left = -1 * centerX * width + 50;
    }
    $("#view").animate({
        'width': width + "%",
        'height': height + "%",
        'top': top + "%",
        'left': left + "%"
    }, 500);
}

function newQuestion() {
    questionData = {
        "capacity": cylinders[currentCylinder].volume,
        "gradation": cylinders[currentCylinder].interval,
        "volume": cylinders[currentCylinder].fluidHeight,
        "gradAnswers": [],
        "volAnswers": []
    }
}

function submitEntry() {
    var input = $("#entryInput").val();
    if (input != "") {
        if (game.props.mode == 1 && phase == 0) {
            // Save answer
            questionData.gradAnswers.push(input);
            if (Math.abs(input - cylinders[currentCylinder].getInterval()) < .00001) {
                // Correct
                answerCorrect();
            } else {
                // Incorrect
                answerIncorrect();
            }
        } else {
            // Save answer
            questionData.volAnswers.push(input);
            if (Math.abs(input - cylinders[currentCylinder].fluidHeight) < .00001) {
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
        } else if (phase == 1) {
            // Add question data to game data
            gameData.questions.push(questionData);
            // Record cylinder types
            cylinderTypes[cylinders[currentCylinder].cylType()]++;
            // console.log(cylinderTypes);
            phase = 0;
            score += 10;
            stats.readCylinders += 1;
            if (gradMistakes == 0) {
                // No gradation mistakes, level up
                cylDiff++;
            } else if (gradMistakes < 3) {
                // 1 or 2 gradation mistakes, no change in level
            } else if (cylDiff > 0) {
                // 3 or more mistakes, level down
                cylDiff--;
            }
            if (volMistakes == 0) {
                // No gradation mistakes, level up
                lineDiff++;
            } else if (volMistakes < 3) {
                // 1 or 2 gradation mistakes, no change in level
            } else if (lineDiff > 0) {
                // 3 or more mistakes, level down
                lineDiff--;
            }
            volMistakes = 0;
            gradMistakes = 0;
            if (cylDiff < 5 || lineDiff < 5) {
                completed++;
                setCylinder();
                setVolume();
                lastCyl = currentCylinder;
                // // console.log("cylDiff: " + cylDiff + " | lineDiff: " + lineDiff + " | volume: " + cylinders[currentCylinder].fluidHeight);
                zoom(currentCylinder, currentZoom);
                newQuestion();
            } else {
                setTimeout(function () {
                    zoom(-1, 1);
                    hideHUD();
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
        // Add question data to game data
        gameData.questions.push(questionData);
        cylinderTypes[cylinders[currentCylinder].cylType()]++;
        // console.log(cylinderTypes);
        completed++;
        currentCylinder = completed;
        phase = 0;
        score += 7 + lives;
        stats.readCylinders += 1;
        if (completed < cylinders.length) {
            zoom(completed, currentZoom);
            newQuestion();
        } else {
            setTimeout(function () {
                zoom(-1, 1);
                hideHUD();
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

function setCylinder() {
    // Determine cylinder to use for next question
    if (cylDiff == 0) {
        // Easy
        if (lastCyl != 2 && lastCyl != 3 && lastCyl != 6) {
            if (Math.random() < 1 / 3) {
                // 50 mL
                currentCylinder = 2;
            } else if (Math.random() < 1 / 2) {
                // 100 mL
                currentCylinder = 3;
            } else {
                // 1000 mL
                currentCylinder = 6;
            }
        } else if (lastCyl == 2) {
            if (Math.random() < 1 / 2) {
                // 100 mL
                currentCylinder = 3;
            } else {
                // 1000 mL
                currentCylinder = 6;
            }
        } else if (lastCyl == 3) {
            if (Math.random() < 1 / 2) {
                // 50 mL
                currentCylinder = 2;
            } else {
                // 1000 mL
                currentCylinder = 6;
            }
        } else if (lastCyl == 6) {
            if (Math.random() < 1 / 2) {
                // 50 mL
                currentCylinder = 2;
            } else {
                // 100 mL
                currentCylinder = 3;
            }
        }
    } else if (cylDiff == 1 || cylDiff == 2) {
        // Medium
        if (Math.random() < 1 / 2 && lastCyl != 0) {
            // 10 mL
            currentCylinder = 0;
        } else if (lastCyl != 5) {
            // 500 mL
            currentCylinder = 5;
        } else {
            // 10 mL
            currentCylinder = 0;
        }
    } else if (cylDiff >= 3) {
        // Hard
        if (Math.random() < 1 / 2 && lastCyl != 1) {
            // 20 mL
            currentCylinder = 1;
        } else if (lastCyl != 4) {
            // 200 mL
            currentCylinder = 4;
        } else {
            // 20 mL
            currentCylinder = 1;
        }
    }
}

function setVolume() {
    var volume;
    var prop = cylProps.props[currentCylinder];
    if (lineDiff == 0) {
        // Major Labeled
        volume = (1 + Math.floor((prop.volume / prop.majorLabeled) * Math.random())) * prop.majorLabeled;
    } else if (lineDiff == 1) {
        // Major Unlabeled
        volume = (1 + Math.floor((prop.volume / prop.majorLabeled) * Math.random())) * prop.majorLabeled - prop.majorUnlabeled;
    } else if (lineDiff == 2) {
        // Major Labeled +/- 1
        volume = (1 + Math.floor((prop.volume / prop.majorLabeled) * Math.random())) * prop.majorLabeled;
        if (Math.random() < 1 / 2 && volume < prop.volume) {
            volume += prop.interval;
        } else {
            volume -= prop.interval;
        }
    } else if (lineDiff == 3) {
        // Major Unlabeled +/- 1
        volume = (1 + Math.floor((prop.volume / prop.majorLabeled) * Math.random())) * prop.majorLabeled - prop.majorUnlabeled;
        if (Math.random() < 1 / 2) {
            volume += prop.interval;
        } else {
            volume -= prop.interval;
        }
    } else if (lineDiff >= 4) {
        // Major Line +/- 2
        volume = (1 + Math.floor((prop.volume / prop.majorLabeled) * Math.random())) * prop.majorLabeled;
        if (Math.random() < 1 / 2) {
            volume -= prop.majorUnlabeled;
        }
        if (Math.random() < 1 / 2 && volume < prop.volume) {
            volume += 2 * prop.interval;
        } else {
            volume -= 2 * prop.interval;
        }
    }
    cylinders[currentCylinder].setFluidHeight(volume);
}

function answerIncorrect() {
    if (game.props.mode == 1) {
        if (phase == 0) {
            gradMistakes++;
        } else if (phase == 1) {
            volMistakes++;
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
            zoom(-1, 1);
            hideHUD();
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
        $("#endOptionDescText2").html("Read 10 graduated cylinders.  If you make 3 mistakes, you lose.");
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
        $("#endOptionDescText3").html("Read 10 graduated cylinders.  If you make 3 mistakes, you lose.  More difficult than Challenge.");
        $("#endOption3").removeClass("endOptionLocked");
        $("#endOption3").addClass("endOptionUnlocked");
    } else {
        // Lock
        $("#endOptionDescText3").html("Locked! <br> Complete Challenge mode to unlock.");
        $("#endOption3").removeClass("endOptionUnlocked");
        $("#endOption3").addClass("endOptionLocked");
    }
}

// Better than parseInt() in that it detects the first integer in a string even if it starts with something that is not a number.  Still returns NaN if no integers are found.
function betterParseInt(s) {
    var str = s + "";
    while (isNaN(parseInt(str)) && str.length > 0) {
        str = str.substring(1, str.length);
    }
    return parseInt(str);
}