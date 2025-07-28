// eventlogic.js

var lastPlungerStates = [];

$(function() {
    setInterval(function() {
        console.log(gameState);
    }, 250);
});

function loadEvents() {

    // Clicky stuff here

    $("#selectResearch").click(function () {
        if (gameState == "pickType") {
            pipetteType = "research";
            typeSelected();
        }
    });
    $("#selectReference").click(function () {
        if (gameState == "pickType") {
            pipetteType = "reference";
            typeSelected();
        }
    });

    $(".pipetteTops").children("div").click(function () {
        if (gameState == "pickTop") {
            var clickedImage = $(this).children("img").attr("src");
            selectedPipette = topLabelsNum[clickedImage];
            if (selectedPipette == 0) {
                $("#refColor").css({
                    'background-color': "#ffffff"
                });
            } else if (selectedPipette == 1) {
                $("#refColor").css({
                    'background-color': "#fff200"
                });
            } else if (selectedPipette == 2) {
                $("#refColor").css({
                    'background-color': "#364fa2"
                });
            }
            $("#plunger").attr('src', "img/plunger" + (selectedPipette + 1) + ".svg");
            // Resize border widths
            resizeBorderWidths();
            if (selectedPipette == correctSleeve || !guidedMode) {
                // If so, set state to sleeve
                gameState = "dial";
                errors = "";
                updateText();
                $("#draggable").css({
                    'opacity': 1
                });
                $("#dials").css({
                    'opacity': 1,
                    'z-index': 30
                });
                $("#shortPipette").css({
                    'opacity': 1
                });
                $(".pipetteTops").css({
                    'opacity': 0
                });
                $('#plungerStateBox').text("Plunger is now in the Resting State");
                // Set some digits to red based on clicked pipette

                for (i = 0; i < dialDigits; i++) {}
                // If not guided, skip "dial" and immediately set gameState to "sleeve"
                if (!guidedMode) {
                    gameState = "sleeve";
                    errors = "";
                    updateText();
                } else {
                    // Show hints after 10s
                    var timeoutID = window.setTimeout(showDialBubbles, 10000);
                }

            } else {
                errors = "wrongTop";
                logMistake(0);
                errorFlash = 150;
                updateText();
            }
        }
    });


    $(".shelfSleeves").children("div").click(function () {
        if (!guidedMode && plungerState != 0) {
            loseGame("Selected tip when plunger was pressed down.");
        } else if (gameState == "dial" && guidedMode) {
            errors = "tipTooEarly";
            logMistake(5);
            updateText();
        } else if (gameState == "sleeve") {
            var clickedImage = $(this).children("img").attr("src");
            selectedTip = sleeveLabelsNum[clickedImage];

            // Check if the correct sleeve has been clicked
            if (selectedTip == correctSleeve || !guidedMode) {
                // If so, set state to dial and hide non-clicked sleeves
                for (var i = 1; i <= 3; i++) {
                    if (selectedTip + 1 != i) {
                        $("#sleeve" + i).css({
                            'opacity': .2
                        });
                    }
                }
                $('#pipetteSleeve').css({
                    'opacity': 1
                });
                gameState = "middle";
                errors = "";
                updateText();
            } else {
                errors = "wrongSleeve";
                logMistake(1);
                errorFlash = 150;
                updateText();
            }
            $('#pipetteSleeve').attr("src", clickedImage);

            $('#sleeveVolumeBox').text(sleeveLabels[clickedImage]);

        } else if (gameState == "pickTop" && guidedMode) {
            errors = "sleeveTooEarly";
            errorFlash = 150;
            logMistake(5);
            updateText();
        }
    });



    $('.numberPuncher').keydown(function () {
        return false;
    });

    // This runs when a dial number is clicked
    $(".zoom_dial_num").click(function (event) {
        if (plungerState != 0 && !guidedMode) {
            loseGame("Adjusted dials when not in resting state.");
        }
        var numClicked = $(event.target).attr("id").split("_")[2] - 1;
        dialClicked(numClicked, 0);
    });

    $("#draggable").draggable({
            containment: "#lab",
            scroll: false,
            stop: function (event, ui) {
                //var input = $("#draggable").attr("style");
                //var arr = input.split(";");
                //var output = "";
               // for (i of arr) {
                 //   if (i.indexOf("opacity") > -1 ||  i.indexOf("top") > -1 || i.indexOf("inset")>-1 || i.indexOf("left") > -1) {
                //        output += (arr[i] + ";");
                  //  }
                //}
		//console.log(output, arr)
               // $("#draggable").attr("style", output);
            },
            drag: function (event, ui) {
                var pipetteLeft = parseInt($(this).css("left"));
                var pipetteTop = parseInt($(this).css("top"));
                draggableLeft = pipetteLeft / stageWidth * 100;
                draggableTop = pipetteTop / stageHeight * 100;
                var leftPct = pipetteLeft / stageWidth;
                var topPct = pipetteTop / stageHeight;
                // Formulas computed with a linear regression
                var leftHeightPct = 0.3149 - 0.2685 * (fluidHeightL / MAX_FLUID);
                var rightHeightPct = 0.3149 - 0.2685 * (fluidHeightR / MAX_FLUID);

                if (leftPct > 0.335 && leftPct < 0.380 && topPct > leftHeightPct && topPct < leftHeightPct + .061) {
                    // Pipette is correctly in the liquid
                    // Lose game if pipette is not in first stop upon touching liquid
                    ////console.log(gameState);
                    pipetteInLiquid = true;
                    if (!guidedMode && (gameState == "insert" || gameState == "dial" || gameState == "middle") && plungerState != 1) {
                        loseGame("Pipettor not in first stop during extraction step.");
                    }
                    // Lose game if guidedMode is off and there is a pipette/tip mismatch
                    if (!guidedMode && selectedPipette != selectedTip) {
                        var capacities = ["10μL", "100μL", "1000μL"];
                        loseGame("Pipettor (" + capacities[selectedPipette] + ") and tip (" + capacities[selectedTip] + ") do not match.");
                    }
                    if ($('#sleeveVolumeBox').text() == "") {

                    } else if (gameState == "insert") {
                        gameState = "top";
                        errors = "";
                        updateText();
                    }
                }
                // Check for contact with liquid in left flask (too deep)
                else if (leftPct > 0.335 && leftPct < 0.380 && topPct >= leftHeightPct + .061) {
                    pipetteInLiquid = true;
                    //$("#helpText").text("Your pipette is too deep into the liquid!");
                    errors = "tooDeep";
                    if (gameState == "insert" && guidedMode) {
                        logMistake(2);
                    } else if (gameState == "move" && guidedMode) {
                        logMistake(4);
                    }
                    updateText();
                    // If not in guided mode, lose the game
                    if (!guidedMode) {
                        if ($('#sleeveVolumeBox').text() == "" && topPct > leftHeightPct + .015) {
                            loseGame("Pipettor inserted into liquid without a tip.");
                        } else if (topPct > leftHeightPct + .015) {
                            loseGame("Pipettor inserted too deep into liquid.");
                        }
                    }
                } else {
                    pipetteInLiquid = false;
                    if (gameState == "top" && guidedMode) {
                        gameState = "insert";
                        errors = "pipetteMoved";
                        logMistake(3);
                        updateText();
                    }
                }
                // Check for contact with mouth of right flask
                if (leftPct > 0.518 && leftPct < 0.565 && topPct > rightHeightPct && topPct < rightHeightPct + .061) {
                    if (gameState == "move") {
                        gameState = "bottom";
                        errors = "";
                        updateText();
                    }
                }
                if (gameState == "bottom") {
                    if (!(leftPct > 0.518 && leftPct < 0.565 && topPct > rightHeightPct && topPct < rightHeightPct + .061)) {
                        gameState = "move";
                        errors = "pipetteMoved2";
                        updateText();
                    }
                }
                // Check for contact with liquid in right flask (too deep)
                else if (leftPct > 0.518 && leftPct < 0.565 && topPct >= rightHeightPct + .061) {
                    errors = "tooDeep";
                    updateText();
                }

                // If the user drags the pipette in "sleeve" mode, tell them they are wrong :(
                if (gameState == "sleeve" && guidedMode) {
                    errors = "moveTooEarly";
                    logMistake(5);
                    updateText();
                } else if (gameState == "dial" && guidedMode) {
                    errors = "moveTooEarlyDial";
                    logMistake(5);
                    updateText();
                } else if (gameState == "middle" && guidedMode) {
                    errors = "moveTooEarlyMiddle";
                    logMistake(5);
                    updateText();
                }

                // Check for positioning over waste basket
                if (leftPct > .043 && leftPct < .163 && topPct < .193) {
                    canEject = true;
                } else {
                    canEject = false;
                }
                if (gameState == "waste") {
                    if (leftPct > .043 && leftPct < .163 && topPct < .193) {
                        gameState = "eject";
                        updateText();
                    }
                }
                if (gameState == "eject") {
                    if (!(leftPct > .043 && leftPct < .163 && topPct < .193)) {
                        gameState = "waste";
                        updateText();
                    }
                }

            }

        }

    );
    $("#stage").droppable({
        drop: function (event, ui) {
            $(this)
                .addClass("ui-state-highlight")
                .find("p")
                .html();
        }
    });

    // Click end options
    $("#endOption1").click(function () {
        newGame(true, false);
        optionChosen = true;
        hideMenu();
    });
    $("#endOption3").click(function () {
        newGame(false, true);
        optionChosen = true;
        hideMenu();
    });

    $("#noHintsButton1").click(function () {
        noHintsPipette = 0;
        newGame(false, false);
        optionChosen = true;
        hideMenu();
    });
    $("#noHintsButton2").click(function () {
        noHintsPipette = 1;
        newGame(false, false);
        optionChosen = true;
        hideMenu();
    });
    $("#noHintsButton3").click(function () {
        noHintsPipette = 2;
        newGame(false, false);
        optionChosen = true;
        hideMenu();
    });

    // Click title buttons
    $("#buttonLeft").click(function () {
        if (currentSlide > 0) currentSlide--;
    });
    $("#buttonRight").click(function () {
        if (currentSlide < TOTAL_SLIDES - 1) currentSlide++;
    });
    // Start game
    $("#slide5").click(function () {
        showTitle = false;
        newGame(true, false);
    });

    // Click state buttons
    $(".stateClickButton").click(function () {
        // Check if the state can be changed
        if (gameState == "middle" || gameState == "top" || gameState == "bottom" || (!guidedMode && gameState != "pickTop") || gameState == "eject") {
            var id = betterParseInt($(this).attr('id'));
            if (id != plungerState) {
                var newState = id;
                var ok = true; // Set to false to cancel state change

                // Execute game state events
                if (gameState == "middle") {
                    if (challengeMode) {
                        // TODO: Lose if dials < min capacity
                        if (getPipetteVolume() < minCapacity[selectedPipette]) {
                            loseGame("Minimum capacity of this pipettor is " + minCapacity[selectedPipette] + " µL.");
                        }
                    }
                    if (newState == 1) {
                        if (guidedMode) {
                            //plungerTopFloat = 1; // Lock
                        }
                        gameState = "insert";
                        errors = "";
                        updateText();
                        $("#draggable").draggable({
                            revert: false
                        });
                    } else {
                        wrongPlungerState(newState);
                    }
                } else if (gameState == "top") {
                    if (newState == 0) {
                        // Challenge mode
                        if (challengeMode) {
                            inPipette = getPipetteVolume();
                            visGoalHeight = 27.5053 * Math.log(1.43845 * inPipette);
                        }
                        fluidHeightL -= visGoalHeight;
                        updateLiquids(leftLiquidHeight, rightLiquidHeight);
                        gameState = "move";
                        errors = "";
                        updateText();
                    } else {
                        wrongPlungerState(newState);
                    }
                } else if (gameState == "bottom") {
                    if (newState == 2) {
                        // Challenge mode
                        if (challengeMode) {
                            gameState = "waste";
                            transferred += inPipette;
                            inPipette = 0;
                        }
                        $("#tubeFluidR").addClass("greenFluid");
                        if (guidedMode) {
                            gameState = "waste";
                            errors = "";
                            updateText();
                        } else {
                            checkDials();
                        }
                        fluidHeightR += visGoalHeight;
                        updateLiquids(leftLiquidHeight, rightLiquidHeight);
                    } else {
                        wrongPlungerState(newState);
                    }
                } else if (gameState == "eject") {
                    if (newState == 3) {
                        gameState = "complete";
                        $("#pipetteSleeve").addClass("fallingSleeve");
                        if (!challengeMode) {
                            // No challenge mode: win game
                            window.setTimeout(winGame, 2000);
                        } else {
                            // Challenge mode: reset to first state
                            window.setTimeout(newChallengeRound, 2000);
                        }
                    }
                    // If in challenge mode, can switch to resting state to use the pipette again
                    else if (newState == 0 && challengeMode) {
                        gameState = "middle";
                    } else if (newState == 1 && challengeMode) {
                        gameState = "insert";
                    } else {
                        wrongPlungerState(newState);
                    }
                } else if (gameState == "waste") {
                    // If in challenge mode, can switch to resting state to use the pipette again
                    if (newState == 0 && challengeMode) {
                        gameState = "middle";
                    } else if (newState == 1 && challengeMode) {
                        gameState = "insert";
                    }
                } else if (gameState == "move") {
                    // If in challenge mode, fail
                    wrongPlungerState(newState);
                }
                if (ok) {
                    setPlungerState(id);
                }
            }


        } else if (gameState == "sleeve" && guidedMode) {
            errors = "plungerTooEarly";
            logMistake(5);
            updateText();
        } else if (gameState == "dial" && guidedMode) {
            errors = "plungerTooEarlyDial";
            logMistake(5);
            updateText();
        } else if (gameState == "pickTop" && guidedMode) {
            errors = "plungerTooEarlyTop";
            logMistake(5);
            updateText();
        }
    });

    // Keys 1, 2, 3, 4 trigger the state change buttons
    $(window).keypress(function (event) {
        var n = event.which;
        if (n >= 49 && n <= 52) {
            $("#stateButton" + (n - 49)).click();
        }
    });

    // Click to end challenge mode
    $(".endChallenge").click(function () {
        endChallengeMode();
    });

    $("#leaderboardButton").click(function () {
        if (noHints10 && noHints100 && noHints1000) {
            showLeaderboard();
        }
    });

    // Leaderboard controls
    $("#lbButton1").click(function () {
        pages = getlbPages();
        lbPage += (pages - 1);
        lbPage = lbPage % pages;
        displayHighScores(lbPage);
    });

    $("#lbButton2").click(function () {
        hideLeaderboard();
    });

    $("#lbButton3").click(function () {
        pages = getlbPages();
        lbPage += (pages + 1);
        lbPage = lbPage % pages;
        displayHighScores(lbPage);
    });

    $("#challengeButton").click(function () {
        if (showingChallenges) {
            hideChallengeScreen();
        } else {
            showChallengeScreen();
        }
    });

    $("body").click(function () {
        clicks++;
    });

    $("body").keypress(function (event) {
        if (enableAltControls) {
            if (event.which == 117) {
                // U key pressed
                dialClicked(-1, 1);
            } else if (event.which == 100) {
                // D key pressed
                dialClicked(-1, -1);
            }
        }
    });

    $("#viewLeaderboardSelected").click(function () {
        window.open("https://apps.tlt.stonybrook.edu/bio/leaderboard", "_self");
    });

};

function dialClicked(numClicked, change) {
    if (gameState == "sleeve" && guidedMode) {
        errors = "dialTooEarly";
        logMistake(5);
        updateText();
    } else if (gameState == "dial" || !guidedMode) {
        if (change == 0) {
            pipetteDisplay[numClicked] = (pipetteDisplay[numClicked] + 1) % 10;
            if (pipetteDisplay[0] > 1) pipetteDisplay[0] = 0;
            // No-hints mode: constrain pipette display to < 1000 or 100.0 or 10.00
            if (!guidedMode && !challengeMode) {
                if (overflow() && numClicked == 0) {
                    for (var i = 1; i < dialDigits; i++) {
                        pipetteDisplay[i] = 0;
                    }
                } else if (overflow() && numClicked > 0) {
                    pipetteDisplay[0] = 0;
                }
            } else if (challengeMode && overflow()) {
                loseGame("Pipettor cannot exceed capacity of " + pipetteVolumes[selectedPipette] + "µL.");
            }
            for (var i = 0; i < dialDigits; i++) {
                $("#zoom_num_" + (i + 1)).text(pipetteDisplay[i]);
                $("#pipette_num_" + (i + 1)).text(pipetteDisplay[i]);
            }
            if (guidedMode)
                checkDials();
        } else {
            changeDials(change);
        }

    }
    // If pipette is in liquid, pipette breaks
    if (pipetteInLiquid && !guidedMode) {
        loseGame("Dial adjusted while pipette was in liquid.");
    }
}

function getlbPages() {
    var total = 0;
    for (var i = 0; i < sortedHighScores.length; i++) {
        if (sortedHighScores[i].score > 0) {
            total++;
        }
    }
    return Math.ceil(total / 10);
}

function wrongPlungerState(newState) {
    if (guidedMode) {
        errors = "incorrectPlungerState";
        ok = false;
        updateText();
        logMistake(6);
    } else {
        switch (newState) {
        case 0:
            loseGame("Released the plunger at the wrong time.");
            break;
        case 1:
            loseGame("Tried to extract liquid, but failed.");
            break;
        case 2:
            loseGame("Released liquid at the wrong time.");
            break;
        case 3:
            loseGame("Ejected pipette tip at the wrong time.");
            break;
        }
    }
}

function setPlungerState(state) {
    plungerState = state;
    for (var i = 0; i < 4; i++) {
        if (i == state) {
            $("#stateButton" + i).addClass("currentState");
        }
        else {
            $("#stateButton" + i).removeClass("currentState");
        }
    }
    if (state == 3 && pipetteType == "research") {
        state = 2;
        $("#ejectPlunger").addClass("anim_ejectPlungerDown");
    }
    else {
        $("#ejectPlunger").removeClass("anim_ejectPlungerDown");
    }
    // Make button light up and animate plunger
    // Save state history for smooth transitions
    lastPlungerStates.push(state);
    if (lastPlungerStates.length > 2) {
        lastPlungerStates.shift();
    }
    for (var i = 0; i < 4; i++) {
        if (lastPlungerStates[0] == i && lastPlungerStates.length > 1) {
            $("#plunger").addClass("animState" + i + "a");
        } else {
            $("#plunger").removeClass("animState" + i + "a");
        }
    }
    for (var i = 0; i < 4; i++) {
        if (i == state) {
            $("#plunger").addClass("animState" + i);
            
        } else {
            $("#plunger").removeClass("animState" + i);
        }
    }
}

function loadTypeSelectScreen() {
    $("#selectType").css({
        'opacity': 1,
        'z-index': 10000
    });
}

function typeSelected() {
    setPipette();
    $("#selectType").css({
        'opacity': 0,
        'z-index': -10000
    });
    gameState = "pickTop";
    updateText();
    // Challenge mode
    if (challengeMode) {
        showEndChallenge(false);
        pipettesUsed++;
    }
}

function overflow() {
    if (pipetteDisplay[0] == 0) return false;
    for (var i = 1; i < dialDigits; i++)
        if (pipetteDisplay[i] > 0) return true;
}

// Better than parseInt() in that it detects the first integer in a string even if it starts with something that is not a number.  Still returns NaN if no integers are found.
function betterParseInt(s) {
    var str = s + "";
    while (isNaN(parseInt(str)) && str.length > 0) {
        str = str.substring(1, str.length);
    }
    return parseInt(str);
}

// Fix aspect ratio of the stage
$(window).resize(function () {
    resizeWindow();
});
