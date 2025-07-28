// Game object
var game;
var challenges;

// Global references to step objects
var turnOn;
var warmUp;
var zeroLeft;
var setWavelength;
var selectBlank;
var zeroRight;
var removeBlank;
var insertSample;
var readSample;
var cleanHolder;
var wipeBlank;
var insertBlank;
var wipeSample;
var selectSample;

var warmUpTime = 3000; // Time it takes for the machine to warm up, in ms
var goalWavelength = 550; // The wavelength that should be set.
var currentWavelength = 340; // Current wavelength of the machine.
var currentCalibration = 0;
var blankAdjust = 0;
var coverOpen = false; // Whether or not the holder cover is closed
var coverLocked = true; // Whether or not the cover is locked
var holderStatus = "empty"; // Indicates what is in the holder: "empty", "old", "blank", "sample"

var startTime = 0; // ???
var endTime = 0; // ???

var stableCheckEvent = 0;

var lockInput = false;

// Keeps track of whether the user made mistakes
var hintsModeMistakes = 0;
var completedHintsModeWithoutMistakes = false;
var hintsModeArrows = 0;
var completedHintsModeWithoutArrows = false;
var hintsModeClicks = 0;
var completedHintsModeIn15Clicks = false;
var hintsSpeed = false;
var noHintsSpeed = false;

var stats = {
    hintsWins: 0,
    noHintsWins: 0,
    expertWins: 0,
    readTransmittance: 0,
    readAbsorbance: 0,
    noHintsWinStreak: 0,
    expertWinStreak: 0,
    challengeStates: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    secret: false
}

function Game(guided, manual) {
    this.guided = guided;
    this.manual = manual;
    this.steps = [];
    this.addStep = function (step) {
        this.steps.push(step);
    }
    this.linkSteps = function () {
        for (var i = 0; i < this.steps.length - 1; i++) {
            this.steps[i].successor = this.steps[i + 1];
        }
        this.makeStepObjects();
    }
    this.getSteps = function () {
        return this.steps;
    }
    this.getCurrentStep = function () {
        for (var i = 0; i < this.getSteps().length; i++) {
            if (this.getSteps()[i].state == 1)
                return this.getSteps()[i];
        }
    }
    this.isGuided = function () {
        return this.guided;
    }
    this.isManual = function () {
        return this.manual;
    }
    this.makeStepObjects = function () {
        // console.log("Making steps");
        $("#steps").empty();
        for (var i = 0; i < this.steps.length; i++) {
            $("#steps").append("<div id='step" + i + "' class='step'></div>");
            $("#step" + i).append("<div class='icon_bg'></div>");
            $("#step" + i).append("<div id='icon" + i + "' class='icon'></div>");
            $("#step" + i).append("<div id='panel" + i + "' class='panel'></div>");
            $("#panel" + i).append("<div id='stepText" + i + "' class='stepText fs-18'></div>");
            $("#step" + i).css({
                'top': (10 * i) + "%"
            });
        }
        resizeWindow();
    }
}

function Step(id, shortText, longText, feedbackText) {
    this.id = id;
    this.shortText = shortText;
    this.longText = longText;
    this.feedbackText = feedbackText;
    this.successor;
    this.state = 0; // 0 if inactive and not complete, 1 if active and not complete, 2 if complete (cannot be active anymore), 3 if failed
    this.hintTimeout = 0;
    this.hintShowing = false;
    this.isActive = function () {
        return this.state == 1;
    };
    this.isComplete = function () {
        return this.state == 2;
    };
    this.isFailed = function () {
        return this.state == 3;
    }
    this.complete = function () {
        if (this.state == 1) {
            endStep(this);
            this.state = 2;
            animateCompleteStep(this);
            if (this.successor != null) {
                this.successor.activate();
            }
            this.prepComplete();
            updateSteps();
        }
    };
    this.activate = function () {
        if (this.state == 0) {
            this.state = 1;
            animateActivateStep(this);
            startStep(this);
            // Start timer to show hint
            if (game.isGuided()) {
                this.hintTimeout = setTimeout(function (t) {
                    t.hintShowing = true;
                    $("#box_" + t.id).removeClass("anim_hintFadeOut");
                    $("#box_" + t.id).addClass("anim_hintFadeIn");
                    hintsModeArrows++;
                }, 15000, this);
            }
        }
    }
    this.reset = function () {
        this.state = 0;
    };
    this.setSuccessor = function (successor) {
        this.successor = successor;
    };
    this.fail = function () {
        this.state = 3;
        animateFailStep(this);
        updateSteps();
        if (zoomLevel == 3) {
            zoom(1);
        } else if (zoomLevel == 4) {
            zoom(5);
        }
        if (game.isManual()) {
            showExtraButtons(false);
        }
        setTimeout(function () {
            endGame("lose");
        }, 1000);
    }
    this.getFeedbackText = function () {
        return this.feedbackText;
    }
    this.prepComplete = function () {
        this.hideHint();
    }
    this.hideHint = function () {
        // Hide hint
        if (this.hintShowing) {
            $("#box_" + this.id).removeClass("anim_hintFadeIn");
            $("#box_" + this.id).addClass("anim_hintFadeOut");
            setTimeout(function () {
                $("#box_" + this.id).removeClass("anim_hintFadeOut");
            }, 250);
            this.hintShowing = false;
        }
        clearTimeout(this.hintTimeout);
        this.hintTimeout = 0;
    }
}

function hideHints() {
    game.getCurrentStep().hideHint();
}

function Challenges() {
    this.list = [];
    this.left = [40, 40, 55.75, 55.75, 40, 24.25, 24.25, 40, 55.75, 71.5, 71.5, 71.5, 55.75, 40, 24.25, 8.5, 8.5, 8.5, 24.25];
    this.top = [40, 22, 31, 49, 58, 49, 31, 4, 13, 22, 40, 58, 67, 76, 67, 58, 40, 22, 13];
    this.init = function () {
        // Load hexagons
        for (var i = 0; i < 19; i++) {
            var j = Math.min(i, this.left.length - 1);
            $("#hexGrid").append("<div id='cell" + i + "' class='cell'></div>");
            $("#cell" + i).append("<div id='cellState" + i + "' class='cellState'></div>");
            $("#cell" + i).append("<div id='cellSelected" + i + "' class='cellSelected'></div>");
            $("#cell" + i).append("<div id='challengeAlert" + i + "' class='challengeAlert text fs-20 anim_chAlert'>New!</div>");
            $("#cell" + i).css({
                "left": this.left[j] + "%",
                "top": this.top[j] + "%"
            });
        }
    }
    this.getChallenge = function (i) {
        return this.list[i];
    }
    this.addChallenge = function (id, title, desc, flavor, level, num) {
        this.list.push(new Challenge(id, title, desc, flavor, level, num));
    }
    this.update = function () {
        for (var i = 0; i < this.list.length; i++) {
            var cell = $("#cellState" + i);
            var challenge = challenges.getChallenge(i);
            cell.removeClass("unknownIcon");
            cell.removeClass("knownIcon");
            cell.removeClass("finishedIcon");
            if (challenge.isUnknown()) {
                cell.addClass("unknownIcon");
            } else if (challenge.isKnown()) {
                cell.addClass("knownIcon");
            } else if (challenge.isComplete()) {
                cell.addClass("finishedIcon");
            }
        }
        totalChallengesComplete();
        updateWipes();
    }

}

function Challenge(id, title, desc, flavor, level, num) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    this.flavor = flavor;
    this.level = level;
    this.num = num;
    this.state = 0; // 0 if unknown, 1 if known, 2 if complete
    this.adjacent = [];
    this.new = false;
    this.completionCount = 0;
    this.isUnknown = function () {
        return this.state == 0;
    };
    this.isKnown = function () {
        return this.state == 1;
    };
    this.isComplete = function () {
        return this.state == 2;
    }
    this.activate = function () {
        if (this.state == 0) {
            animateActivateChallenge(this.num);
            this.state = 1;
        }
    }
    this.complete = function () {
        if (this.state < 2) {
            animateCompleteChallenge(this.num);
            this.state = 2;
            for (var i = 0; i < this.adjacent.length; i++) {
                challenges.getChallenge(this.adjacent[i]).activate();
            }
        }
    }
    this.setAsNew = function (bool) {
        this.new = bool;
        $("#challengeAlert" + this.num).css({
            opacity: (bool ? 1 : 0)
        })
    }
    this.initAdjacent = function () {
        // Center
        var temp = [];
        if (num == 0) {
            for (var i = 1; i <= 6; i++) {
                temp.push(i);
            }
        }
        if (num >= 1 && num <= 6) {
            temp.push(0);
            temp.push(num % 6 + 1);
            temp.push((num + 4) % 6 + 1);
            var outer = 2 * (num - 1) + 7;
            temp.push(outer);
            temp.push(outer + 1);
            if (outer == 7) {
                temp.push(18);
            } else {
                temp.push(outer - 1);
            }

        }
        if (num >= 7 && num <= 18) {
            if (num % 2 == 0) {
                if (num == 18) {
                    temp.push(7);
                    temp.push(1);
                } else {
                    temp.push(num + 1);
                    temp.push((num - 6) / 2 + 1);
                }
                temp.push(num - 1);
                temp.push((num - 8) / 2 + 1);
            } else {
                temp.push(num + 1);
                if (num == 7) {
                    temp.push(18);
                } else {
                    temp.push(num - 1);
                }

                temp.push((num - 7) / 2 + 1);
            }
        }
        this.adjacent = [];
        for (var i = 0; i < temp.length; i++) {
            var ch = challenges.getChallenge(temp[i]);
            if (ch.level <= level + 1) {
                this.adjacent.push(temp[i]);
            }
        }
    }
}

function failGame(error, correct) {
    if (cuvetteIn) {
        cuvettePanelOut();
    }
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

function animateActivateStep(step) {
    var id = game.getSteps().indexOf(step);
    $("#icon" + id).addClass("inactiveIcon");
    $("#icon" + id).addClass("anim_stepExit");
    setTimeout(function () {
        $("#icon" + id).removeClass("anim_stepExit");
        $("#icon" + id).removeClass("inactiveIcon");
        $("#icon" + id).addClass("anim_stepEnter");
        $("#icon" + id).addClass("activeIcon");
    }, 125);
    setTimeout(function () {
        $("#icon" + id).removeClass("anim_stepEnter");
    }, 500);
}

function animateCompleteStep(step) {
    var id = game.getSteps().indexOf(step);
    $("#icon" + id).removeClass("inactiveIcon");
    $("#icon" + id).addClass("activeIcon");
    $("#icon" + id).addClass("anim_stepExit");
    setTimeout(function () {
        $("#icon" + id).removeClass("anim_stepExit");
        $("#icon" + id).removeClass("activeIcon");
        $("#icon" + id).addClass("anim_stepEnterBig");
        $("#icon" + id).addClass("completeIcon");
    }, 125);
    setTimeout(function () {
        $("#icon" + id).removeClass("anim_stepEnterBig");
    }, 500);
}

function animateFailStep(step) {
    var id = game.getSteps().indexOf(step);
    $("#icon" + id).removeClass("inactiveIcon");
    $("#icon" + id).addClass("activeIcon");
    $("#icon" + id).addClass("anim_stepExit");
    setTimeout(function () {
        $("#icon" + id).removeClass("anim_stepExit");
        $("#icon" + id).removeClass("activeIcon");
        $("#icon" + id).addClass("anim_stepEnterBig");
        $("#icon" + id).addClass("failIcon");
    }, 125);
    setTimeout(function () {
        $("#icon" + id).removeClass("anim_stepEnterBig");
    }, 500);
}

function resetVisualState() {
    // Reset title
    $("#headerText").text("Spectrophotometer Simulator");
    // Reset steps
    for (var i = 0; i < 10; i++) {
        $("#icon" + i).removeClass("activeIcon");
        $("#icon" + i).removeClass("completeIcon");
        $("#icon" + i).removeClass("failIcon");
        $("#icon" + i).removeClass("anim_stepExit");
        $("#icon" + i).removeClass("anim_stepEnter");
        $("#icon" + i).addClass("inactiveIcon");
    }
    // Reset knobs
    for (var i = 0; i < knobs.length; i++) {
        knobs[i].angle = 0;
        knobs[i].rotation = 0;
        $("#knob" + i).css({
            'transform': "rotate(0deg)"
        });
    }
    // Reset wavelength wheel
    $("#waveWheel").css({
        'transform': "rotate(-180deg)"
    });
    // Reset cuvettes
    $("#cuvetteOld").removeClass("anim_cuvetteExit");
    $("#cuvetteNew").removeClass("anim_cuvetteExit");
    $("#cuvetteNew").removeClass("anim_cuvetteEnter");
    $("#cuvetteNew").removeClass("animBlank");
    $("#cuvetteNew").removeClass("animSample");
    $("#cuvetteBlank").css({
        opacity: 1
    });
    $("#cuvetteSample").css({
        opacity: 1
    });
    $("#smallBlank").removeClass("anim_selectSmallBlank");
    $("#smallBlank").removeClass("anim_insertCuvette");
    $("#smallBlank").removeClass("anim_returnSmallBlank");
    $("#smallSample").removeClass("anim_selectSmallSample");
    $("#smallSample").removeClass("anim_insertCuvette");
    // Reset entry field text
    $("#numInput").val("");
    // Reset needle position
    $("#needle").css({
        'transform': "rotate(-54deg)"
    });
    // Close holder
    closeHolder();
}

// Code executed when a step starts
function startStep(step) {
    stableCheckEvent = 0;
    if (game.isGuided()) {
        $("#headerText").text(step.longText);
    }
    enableClicks(true);
    if (step == turnOn) {
        // Only enable knob 0 and let it range from 0 to 90 degrees
        knobs[0].enabled = true;
        knobs[0].bounds = [0, 90];
        knobs[2].bounds = [0, 90];
        knobs[1].enabled = false;
        knobs[2].enabled = false;
        knobs[3].enabled = false;
        knobs[4].enabled = false;
    }
    if (step == warmUp) {
        // Disable knob 0; wait and then go to the next step
        knobs[0].enabled = false;
        setTimeout(function () {
            warmUp.complete();
        }, warmUpTime);
        fastForward(10);
    }
    if (step == zeroLeft) {
        // In guided mode, zoom in a bit later
        if (!game.isManual()) {
            setTimeout(function () {
                zoom(3);
            }, 600);
        }
        // Disable knob 4
        knobs[4].enabled = false;
        // Enable knob 2 and change bounds for calibration
        knobs[2].enabled = true;
        knobs[0].bounds = [90, 450];
        knobs[2].bounds = [90, 450];
        // Lock holder
        coverLocked = true;
    }
    if (step == setWavelength) {
        // Disable knob 2
        knobs[2].enabled = false;
        // Enable knob 4 (wavelength knob)
        knobs[4].enabled = true;
        // Animate needle into uncalibrated position
        animateNeedle(-10, (display + calibration + error), 1000);
        // Zoom in wavelength panel in a bit
        waveZoomIn();
    }
    if (step == cleanHolder) {
        // Enable opening of cuvette holder
        coverLocked = true; // If the holder should open/close automatically, keep it locked
        // Zoom out wavelength
        waveZoomOut();
        openHolder();
    }
    if (step == selectBlank || step == selectSample) {
        closeHolder();
        if (!game.isManual()) {
            zoom(1);
            setTimeout(function () {
                zoom(4);
            }, 1000);
        }
    }
    if (step == zeroRight) {
        knobs[1].rotation = 360;
        knobs[3].rotation = 360;
        if (!game.isManual()) {
            zoom(3);
        }
        // Enable knob 3
        knobs[3].enabled = true;
    }
    if (step == removeBlank) {
        openHolder();
    }
    if (step == readSample) {
        // Zoom in
        zoom(2);
        prepareReadings(totalReadings);

        // Bring up numpad for entering answer
        enterNumpad();
    }
}

function endStep(step) {
    if (step == setWavelength) {
        // Disable knob 4
        knobs[4].enabled = false;
        stableCheckEvent = 0;
    }
    if (step == zeroLeft) {
        // Disable knob 2
        knobs[2].enabled = false;
        stableCheckEvent = 0;
    }
    if (step == insertBlank) {
        closeHolder();
        animateNeedle(0, 105, 500);
    }
    if (step == wipeBlank || step == wipeSample) {
        if (!game.isManual()) {
            zoom(5);
        }
    }
    if (step == zeroRight) {
        if (!game.isManual()) {
            zoom(1);
        }
        knobs[3].enabled = false;
    }
    if (step == insertSample) {
        closeHolder();
    }
    if (step == readSample) {
        // Win the game
        setTimeout(function () {
            exitNumpad();
            zoom(1);
            if (game.isManual()) {
                showExtraButtons(false);
            }
            endGame("win");
        }, 1000);
    }
}

function zoom(level) {
    zoomLevel = level;
    for (var i = 1; i <= 5; i++) {
        $("#view").removeClass("anim_zoom" + i);
    }
    if (level == 1 || level == 5) {
        $(".zoomBubble").removeClass("anim_fadeIn");
        $(".zoomBubble").addClass("anim_fadeOut");
        $("#needle").removeClass("anim_needleThin");
        $("#needle").addClass("anim_needleThick");
    }
    if (level == 2) {
        $("#needle").removeClass("anim_needleThick");
        $("#needle").addClass("anim_needleThin");
    }
    if (level == 3) {
        $(".zoomBubble").removeClass("anim_fadeOut");
        $(".zoomBubble").addClass("anim_fadeIn");
        $("#needle").removeClass("anim_needleThick");
        $("#needle").addClass("anim_needleThin");
    }
    if (level == 4) {
        $(".zoomBubble").removeClass("anim_fadeIn");
        $(".zoomBubble").addClass("anim_fadeOut");
        $("#needle").removeClass("anim_needleThick");
        $("#needle").addClass("anim_needleThin");
    }
    $("#view").addClass("anim_zoom" + level);
    if (zoomLevel == 5) zoomLevel = 1;
}

function newGame(guided, manual) {
    // Create new game object
    game = new Game(guided, manual);
    display = 0;
    currentCalibration = 0;
    blankAdjust = 0;
    error = 5 * Math.random() - 7.5;
    holderStatus = "old";
    goalWavelength = 550;
    currentWavelength = 340;
    coverOpen = false;
    coverLocked = true;
    zoomLevel = 1;
    lockInput = false;
    // Set wavelength if not guided
    if (!guided) {
        goalWavelength = 400 + 5 * (Math.floor(81 * Math.random()));
    } else {
        goalWavelength = 550;
    }
    $("#waveNum").text(goalWavelength + " nm");
    // Checking for achievements
    if (guided) {
        hintsModeMistakes = 0;
        completedHintsModeWithoutMistakes = false;
    }
    if (guided) {
        hintsModeArrows = 0;
        completedHintsModeWithoutArrows = false;
        hintsModeClicks = 0;
        completedHintsModeIn15Clicks = false;
    }
    if (guided) {
        totalReadings = 3;
    } else if (!guided && !manual) {
        totalReadings = 5;
    } else if (!guided && manual) {
        totalReadings = 7;
    }
    $("#numInput").prop("disabled", false);
    // Define steps (order doesn't matter here)
    turnOn = new Step("turnOn", "Turn On", "Turn on the spectrophotometer by turning the power control knob to the right.", "turn on the device");
    warmUp = new Step("warmUp", "Warm Up", "Wait 10 minutes for the machine to warm up.", "wait for the device to warm up");
    zeroLeft = new Step("zeroLeft", "Zero Transmittance", "Adjust the power control knob to zero transmittance.", "zero the transmittance");
    setWavelength = new Step("setWavelength", "Set Wavelength", "Rotate the wavelength selection knob to the specified wavelength.", "set the wavelength to 550 nm");
    selectBlank = new Step("selectBlank", "Select Blank", "Select the blank to be used.", "select the blank");
    zeroRight = new Step("zeroRight", "Zero Absorbance", "Adjust the light control knob so the meter reads zero absorbance.", "blank the device");
    removeBlank = new Step("removeBlank", "Remove Blank", "Click the blank to remove it from the device.", "remove the blank from the device");
    insertSample = new Step("insertSample", "Insert Sample", "Click the sample holder cover to insert the sample.", "click the sample holder cover");
    readSample = new Step("readSample", "Read Sample", "Read the meter and enter its value.", "read the dial correctly");
    cleanHolder = new Step("cleanHolder", "Empty Holder", "Click the cuvette to remove it from the holder.", "remove the cuvette from the holder");
    wipeBlank = new Step("wipeBlank", "Wipe Blank", "Click the box of wipes to wipe the blank.", "wipe the blank with a kimwipe");
    insertBlank = new Step("insertBlank", "Insert Blank", "Click the sample holder cover to insert the blank.", "click the sample holder cover");
    selectSample = new Step("selectSample", "Select Sample", "Select the sample to be used.", "wipe the sample with a kimwipe");
    wipeSample = new Step("wipeSample", "Wipe Sample", "Click the box of wipes to wipe the blank.", "wipe the sample with a kimwipe");
    // Add steps to game object in desired order
    game.addStep(turnOn);
    game.addStep(warmUp);
    game.addStep(setWavelength);
    game.addStep(cleanHolder);
    game.addStep(zeroLeft);
    game.addStep(selectBlank);
    game.addStep(wipeBlank);
    game.addStep(insertBlank);
    game.addStep(zeroRight);
    game.addStep(removeBlank);
    game.addStep(selectSample);
    game.addStep(wipeSample);
    game.addStep(insertSample);
    game.addStep(readSample);
    // Link steps based on the order added
    game.linkSteps();
    // Reset game state appearance (steps, knobs)
    resetVisualState();
    // Show or hide extra buttons based on mode
    if (!game.isManual()) {
        showExtraButtons(false);
    } else {
        showExtraButtons(true);
    }
    // Hide OK buttons on guided mode
    var opacity = 1;
    if (game.isGuided()) {
        opacity = 0;
    }
    $("#okButton").css({
        opacity: opacity
    });
    // Start first step
    turnOn.activate();

    // Hide menu
    hideMenu();

    // Update steps
    updateSteps();
    // Animate in step objects
    enterStepObjects();
    // Record start time
    startTime = new Date().getTime();
    //testGame();
    // Resize window
    resizeWindow();
    checkSecretAccess();
}

function endGame(result) {
    // Record end time
    endTime = new Date().getTime();
    var totalTime = ((endTime - startTime) / 1000);
    // console.log(totalTime + " seconds");
    // Run timer for lolz
    if (false) {
        $("#endSubText").text("Time elapsed: " + totalTime + " seconds");
    }
    // Banish step objects to the shadow realm
    exitStepObjects();
    // If the player wins
    if (result == "win") {
        $("#endText").text("Great Success");
        $("#endSubText").text("You completed the task!");
        $("#endSubText").css({
            opacity: 1
        });
        $(".endErrorText").css({
            opacity: 0
        });
        // Increment wins
        if (game.isGuided()) {
            stats.hintsWins++;
        } else if (!game.isGuided() && !game.isManual()) {
            stats.noHintsWins++;
        } else if (!game.isGuided() && game.isManual()) {
            stats.expertWins++;
        }
        if (!game.isGuided() && !game.isManual()) {
            stats.noHintsWinStreak++;
        } else if (!game.isGuided() && game.isManual()) {
            stats.expertWinStreak++;
        }
        if (game.isGuided() && hintsModeClicks <= 16) {
            completedHintsModeIn15Clicks = true;
        }
        // Speed achievements
        if (game.isGuided() && totalTime <= 120) {
            hintsSpeed = true;
        }
        if (!game.isGuided() && totalTime <= 120) {
            noHintsSpeed = true;
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
        if (!game.isGuided() && !game.isManual()) {
            stats.noHintsWinStreak = 0;
        } else if (!game.isGuided() && game.isManual()) {
            stats.expertWinStreak = 0;
        }
    }
    // Check if the user beat hints mode without mistakes
    if (game.isGuided() && hintsModeMistakes == 0) {
        completedHintsModeWithoutMistakes = true;
    }
    if (game.isGuided() && hintsModeArrows == 0) {
        completedHintsModeWithoutArrows = true;
    }
    checkChallenges();
    // Post data
    postData();
    // Show the menu
    showMenu();
}

function loadStartMenu() {
    $("#headerText").text("Spectrophotometer Simulator");
    $("#endText").text("Welcome back!");
    $("#endSubText").text("Select a game mode to begin.");
    $("#endSubText").css({
        opacity: 1
    });
    $(".endErrorText").css({
        opacity: 0
    });
    showMenu();
}

function showMenu() {
    // Make overlay visible
    $("#overlay").css({
        'opacity': 1,
        'z-index': 100
    });
    // Lock/unlock modes
    lockModes();
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
    // Intermediate mode: lock if Beginner not yet completed
    if (stats.challengeStates[0]) {
        // Unlock
        $("#endOptionDescText2").html("• No hints <br> • 5 dial readings <br> • You lose if you make a mistake.");
        $("#endOption2").removeClass("endOptionLocked");
        $("#endOption2").addClass("endOptionUnlocked");
    } else {
        // Lock
        $("#endOptionDescText2").html("Locked! <br> Complete Beginner mode to unlock.");
        $("#endOption2").removeClass("endOptionUnlocked");
        $("#endOption2").addClass("endOptionLocked");
    }
    // Expert mode: lock if Intermediate not yet completed
    if (stats.challengeStates[1]) {
        // Unlock
        $("#endOptionDescText3").html("• No hints, more controls <br> • 7 dial readings <br> • You lose if you make a mistake.");
        $("#endOption3").removeClass("endOptionLocked");
        $("#endOption3").addClass("endOptionUnlocked");
    } else {
        // Lock
        $("#endOptionDescText3").html("Locked! <br> Complete Intermediate mode to unlock.");
        $("#endOption3").removeClass("endOptionUnlocked");
        $("#endOption3").addClass("endOptionLocked");
    }
}

function showExtraButtons(show) {
    if (show) {
        $("#zoomButton").removeClass("anim_zoomButtonExit");
        $("#zoomButton").addClass("anim_zoomButtonEnter");
        $("#zoomButton").css({
            'opacity': 1
        });
        setSelectedCircle(1);
    } else {
        $("#zoomButton").removeClass("anim_zoomButtonEnter");
        $("#zoomButton").addClass("anim_zoomButtonExit");
        setTimeout(function () {
            $("#zoomButton").css({
                'opacity': 0
            });
        }, 125);
    }

}

function enterStepObjects() {
    for (var i = 0; i < game.getSteps().length; i++) {
        setTimeout(function (id) {
            $("#step" + id).removeClass("anim_exitStepObject")
            $("#step" + id).addClass("anim_enterStepObject")
        }, 400 * i / game.getSteps().length, i);
    }
}

function exitStepObjects() {
    for (var i = game.getSteps().length - 1; i >= 0; i--) {
        setTimeout(function (id) {
            $("#step" + id).removeClass("anim_enterStepObject")
            $("#step" + id).addClass("anim_exitStepObject")
        }, 400 * i / game.getSteps().length, i);
    }
}

function fadeSuccess() {
    $(".fade").removeClass("fadeFail");
    $(".fade").addClass("fadeSuccess");
    $(".fade").addClass("anim_fadeResult");
    setTimeout(function () {
        $(".fade").removeClass("anim_fadeResult");
    }, 750);
}

function fadeFail() {
    $(".fade").removeClass("fadeSuccess");
    $(".fade").addClass("fadeFail");
    $(".fade").addClass("anim_fadeResult");
    setTimeout(function () {
        $(".fade").removeClass("anim_fadeResult");
    }, 750);
}

function prepChallenges() {
    // Initialize challenges
    challenges = new Challenges();
    challenges.init();
    // Load challenge data
    var challengeData = [
        {
            "id": "hintsWin",
            "title": "First Steps",
            "desc": "Complete Beginner mode.",
            "flavor": "Your first achievement!",
            "level": 0
        },
        {
            "id": "noHintsWin",
            "title": "Independence",
            "desc": "Complete Intermediate mode.",
            "flavor": "I knew you could do it!",
            "level": 1
        },
        {
            "id": "complete5",
            "title": "Pentathlon",
            "desc": "Complete the game in any mode 5 times.",
            "flavor": "Achieved ~1000 times during development.",
            "level": 2
        },
        {
            "id": "perfectHintsWin",
            "title": "No Mistakes",
            "desc": "Complete Beginner mode without reading the dial incorrectly.",
            "flavor": "I knew you could do it!",
            "level": 1
        },
        {
            "id": "winBeforeHints",
            "title": "No Hints Needed",
            "desc": "Complete Beginner mode before any of the green hint arrows appear.",
            "flavor": "I knew you could do it!",
            "level": 2
        },
        {
            "id": "readings10",
            "title": "10 Readings",
            "desc": "Correctly read the dial 10 times.",
            "flavor": "I knew you could do it!",
            "level": 1
        },
        {
            "id": "noHints2",
            "title": "Double Dare",
            "desc": "Complete Intermediate mode twice in a row.",
            "flavor": "I knew you could do it!",
            "level": 2
        },
        {
            "id": "expertMode",
            "title": "Expert Opinion",
            "desc": "Complete Expert Mode.",
            "flavor": "I knew you could do it!",
            "level": 2
        },
        {
            "id": "noHints3",
            "title": "Triple Dare",
            "desc": "Win in Intermediate mode three times in a row.",
            "flavor": "I knew you could do it!",
            "level": 3
        },
        {
            "id": "clicks",
            "title": "Clicker Question",
            "desc": "Complete Beginner mode in 15 clicks or fewer.",
            "flavor": "It's not for attendance, really!",
            "level": 4
        },
        {
            "id": "complete10",
            "title": "Decathlon",
            "desc": "Complete the game in any mode 10 times.",
            "flavor": "I knew you could do it!",
            "level": 3
        },
        {
            "id": "hintsTimed",
            "title": "Speed Demon",
            "desc": "Complete Beginner mode in under 2 minutes.",
            "flavor": "Gotta go fast!",
            "level": 2
        },
        {
            "id": "readings25",
            "title": "25 Readings",
            "desc": "Correctly read the dial 25 times.",
            "flavor": "I knew you could do it!",
            "level": 3
        },
        {
            "id": "desync",
            "title": "Time Traveler",
            "desc": "De-synchronize the in-game clock by 1 hour.",
            "flavor": "I have seen the future!",
            "level": 4
        },
        {
            "id": "transmittance10",
            "title": "Transmittance 10",
            "desc": "Correctly read transmittance 10 times.",
            "flavor": "Not as refreshing as expected.",
            "level": 3
        },
        {
            "id": "noHintsTimed",
            "title": "Speed Demon II",
            "desc": "Complete Intermediate mode in under 2 minutes.",
            "flavor": "Not as refreshing as expected.",
            "level": 2
        },
        {
            "id": "absorbance10",
            "title": "Absorbance 10",
            "desc": "Correctly read absorbance 10 times.",
            "flavor": "Not as refreshing as expected.",
            "level": 3
        },
        {
            "id": "expert3",
            "title": "Hat Trick",
            "desc": "Complete Expert Mode three times in a row without losing.",
            "flavor": "Not as refreshing as expected.",
            "level": 4
        },
        {
            "id": "expert2",
            "title": "Expert Streak",
            "desc": "Complete Expert Mode twice in a row without losing.",
            "flavor": "Not as refreshing as expected.",
            "level": 3
        }
    ];
    for (var i = 0; i < challengeData.length; i++) {
        var data = challengeData[i];
        challenges.addChallenge(data.id, data.title, data.desc, data.flavor, data.level, i);
    }
    for (var i = challengeData.length; i < 19; i++) {
        challenges.addChallenge("challenge" + i, "Challenge " + i, "Placeholder for challenge " + i + ".", "Clever flavor text for challenge " + i + " goes here!");
    }

    /*
        Load challenge data and activate already completed challenges
    */
    for (var i = 0; i < 19; i++) {
        challenges.list[i].initAdjacent();
        if (stats.challengeStates[i]) {
            challenges.getChallenge(i).complete();
        }
    }

    // Make the first challenge viewable
    if (challenges.list[0].isUnknown()) {
        challenges.list[0].activate();
    }

    // Get completion percentage for each challenge
    for (var i = 0; i < 19; i++) {
        var count = 0;
        for (var j = 0; j < allData.length; j++) {
            if (allData[j].stats.challengeStates != undefined) {
                if (allData[j].stats.challengeStates[i] == true || (allData[j].name == netID && stats.challengeStates[i])) {
                    count++;
                }
            }
        }
        challenges.list[i].completionCount = count;
    }

    // Update challenges
    challenges.update();
    // console.log(challenges);
}

function animateCompleteChallenge(id) {
    disableChallengeSelect();
    $("#cellState" + id).addClass("anim_challengeExit");
    $("#cell" + id).addClass("cellFront");
    setTimeout(function () {
        $("#cellState" + id).removeClass("anim_challengeExit");
        $("#cellState" + id).removeClass("unknownIcon");
        $("#cellState" + id).removeClass("knownIcon");
        $("#cellState" + id).addClass("anim_challengeEnterBig");
        $("#cellState" + id).addClass("finishedIcon");
    }, 125);
    setTimeout(function () {
        $("#cellState" + id).removeClass("anim_challengeEnterBig");
        $("#cell" + id).removeClass("cellFront");
        enableChallengeSelect();
    }, 500);
}

function animateActivateChallenge(id) {
    $("#cellState" + id).removeClass("unknownIcon");
    $("#cellState" + id).addClass("unknownIcon");
    $("#cellState" + id).addClass("anim_challengeExit");
    $("#cell" + id).addClass("cellSecondFront");
    setTimeout(function () {
        $("#cellState" + id).removeClass("anim_challengeExit");
        $("#cellState" + id).removeClass("unknownIcon");
        $("#cellState" + id).addClass("anim_challengeEnter");
        $("#cellState" + id).addClass("knownIcon");
    }, 125);
    setTimeout(function () {
        $("#cellState" + id).removeClass("anim_challengeEnter");
        $("#cell" + id).removeClass("cellSecondFront");
    }, 500);
}

function disableChallengeSelect() {
    $(".cellSelected").addClass("cellSelectedHide");
}

function enableChallengeSelect() {
    $(".cellSelected").removeClass("cellSelectedHide");
}

function checkChallenges() {
    var queue = [];
    for (var i = 0; i < 19; i++) {
        var ch = challenges.getChallenge(i);
        var proc = false;
        if (i == 0) {
            // Win a game without hints
            if (stats.hintsWins > 0) {
                proc = true;
            }
        }
        if (i == 1) {
            // Win a game without hints
            if (stats.noHintsWins > 0) {
                proc = true;
            }
        }
        if (i == 2) {
            // Complete the game 5 times
            if (stats.hintsWins + stats.noHintsWins >= 5) {
                proc = true;
            }
        }
        if (i == 3) {
            // Win a game in hints mode without reading dial incorrectly
            if (completedHintsModeWithoutMistakes) {
                proc = true;
            }
        }
        if (i == 4) {
            // Win a game in hints mode without reading dial incorrectly
            if (completedHintsModeWithoutArrows) {
                proc = true;
            }
        }
        if (i == 5) {
            if (stats.readAbsorbance + stats.readTransmittance >= 10) {
                proc = true;
            }
        }
        if (i == 6) {
            // Win No-Hints Mode twice in a row
            if (stats.noHintsWinStreak >= 2) {
                proc = true;
            }
        }
        if (i == 7) {
            // Complete Expert Mode
            if (stats.expertWins > 0) {
                proc = true;
            }
        }
        if (i == 8) {
            // Win No-Hints Mode 3 times in a row
            if (stats.noHintsWinStreak >= 3) {
                proc = true;
            }
        }
        if (i == 9) {
            // Win Hints Mode in 15 clicks or fewer
            if (completedHintsModeIn15Clicks) {
                proc = true;
            }
        }
        if (i == 10) {
            // Complete the game 10 times
            if (stats.hintsWins + stats.noHintsWins >= 10) {
                proc = true;
            }
        }
        if (i == 11) {
            // Complete hints mode in under 2 minutes
            if (hintsSpeed) {
                proc = true;
            }
        }
        if (i == 12) {
            // Correctly read the dial 25 times
            if (stats.readAbsorbance + stats.readTransmittance >= 25) {
                proc = true;
            }
        }
        if (i == 13) {
            // Desynch in-game clock by 1 hour
            if (clockOffset >= 60) {
                proc = true;
            }
        }
        if (i == 14) {
            // Read transmittance 10 times
            if (stats.readTransmittance >= 10) {
                proc = true;
            }
        }
        if (i == 15) {
            // Complete no-hints mode in under 2 minutes
            if (noHintsSpeed) {
                proc = true;
            }
        }
        if (i == 16) {
            // Read absorbance 10 times
            if (stats.readAbsorbance >= 10) {
                proc = true;
            }
        }
        if (i == 17) {
            // Win Expert Mode three times in a row
            if (stats.expertWinStreak >= 3) {
                proc = true;
            }
        }
        if (i == 18) {
            // Win Expert Mode twice in a row
            if (stats.expertWinStreak >= 2) {
                proc = true;
            }
        }
        if (proc && !ch.isComplete()) {
            queue.push(i);
            stats.challengeStates[i] = true;
        }
    }
    if (queue.length > 0) {
        showChallengeScreenInstant();
        setTimeout(completeChallenges, 1000, queue);
    }
}

function completeChallenges(queue) {
    for (var i = 0; i < queue.length; i++) {
        challenges.getChallenge(queue[i]).complete();
        setTimeout(markChallengeAsNew, 500, queue[i]);
    }
    totalChallengesComplete();
    checkSecretAccess();
}

function markChallengeAsNew(i) {
    challenges.getChallenge(i).setAsNew(true);
}

function totalChallengesComplete() {
    // Set completion total
    var total = 0;
    for (var i = 0; i < 19; i++) {
        if (challenges.getChallenge(i).isComplete()) {
            total++;
        }
    }
    $("#totalCompleteText").text(total);
    return total;
}

function checkSecretAccess() {
    if (totalChallengesComplete() == 19 && (stats.secret != true)) {
        // Enable
        secretEnabled = true;
        $("#secret").css({
            'left': "65%",
            'opacity': 1
        });
    } else {
        // Disable
        secretEnabled = false;
        $("#secret").css({
            'left': "165%",
            'opacity': 0
        });
    }
}