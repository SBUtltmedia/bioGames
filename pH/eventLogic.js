// Clicky stuff here
var isAdminVar;

var targetArrow = {
    startX: 0,
    startY: 0,
    isActive: false,
    origin: "none"
};

var rinseAnim = false;
var wipeAnim = false;
var jarStirAnim = false;
var electrodeLifted = false;

var setupClicks = 0;

var gameStarted = false;

$(function () {
    // Resize window on page load to ensure proper sizing of elements
    setTimeout(()=>resizeWindow(),1000);
    resetBufferData();
    setBufferColors();

    // Create event listeners for menu button clicks and start game
    $("#endOption1").click(function () {
        if (!gameStarted) {
            gameStarted = true;
            // When menu button 1 is clicked
            props = {
                "mode": 1
            }
            newGame(props);
        }
    });
    $("#endOption2").click(function () {
        if (!gameStarted) {
            // When menu button 2 is clicked
            if (studentData.unlocks[0] || UNLOCK_EVERYTHING) {
                gameStarted = true;
                props = {
                    "mode": 2
                }
                newGame(props);
            }
        }
    });
    $("#endOption3").click(function () {
        if (!gameStarted) {
            // When menu button 3 is clicked
            if ((studentData.unlocks[1] || UNLOCK_EVERYTHING) && false) {
                gameStarted = true;
                props = {
                    "mode": 3
                }
                newGame(props);
            }
        }
    });

    $("#dataReport").click(function () {
        if (isAdmin(netID)) {
            $.ajax({
                url: "info_allScores.php",
                dataType: "json"
            }).done(function (data) {
                exportScoreCSV(data);
                exportDataCSV(data);
            }).fail(function () {

            });
        }
    });

    $("#viewLeaderboardSelected").click(function () {
        window.open("https://apps.tlt.stonybrook.edu/bio/leaderboard");
    });

    $(document).keydown(function (objEvent) {
        if (objEvent.keyCode == 9) { //tab pressed
            objEvent.preventDefault(); // stops its action
        }
    });

    $.ajax({
        url: "info.php",
        dataType: "json"
    }).done(function (data) {
        netID = data.name;
        firstName = data.firstname;
        getStudentData = data.studentData;
        userNetID = data.name;
        isAdminVar = data.isAdmin;
        // Special Case
        if (netID == "pgraziosi" || netID == "japalmeri") firstName = "Jim";
        if (netID == "pstdenis") firstName = "Denis"; // lol
        if (Object.keys(getStudentData).length == 0) {
            // New file
            newStudentData(netID);
            postData();
            continueLoading();
        } else {
            studentData = getStudentData;
            stats = data.stats;
            getAllData();
        }
    }).fail(function () {
        newStudentData();
        continueLoading();
    });
});

function continueLoading() {
    for (var i = 1; i <= 3; i++) {
        initEndOptionHover(i);
    }
    $("#challengeButton").click(function () {
        if (showingChallenges) {
            hideChallengeScreen();
        } else {
            showChallengeScreen();
        }
    });

    // Prep challenges
    prepChallenges();

    initTargetArrow();

    $(".cellSelected").hover(function (e) {
        // Mouse over cell
        var id = betterParseInt($(e.target).attr('id'));
        if ($(e.target).attr('id') == "viewLeaderboardSelected") {
            id = 100;
        }
        setCurrentChallenge(id);
        $("#currentChallenge").css({
            "opacity": 1
        });
        if (id != 100) {
            // Mark challenge as not new
            challenges.getChallenge(id).setAsNew(false);
        }

    }, function () {
        // Leave cell
        $("#currentChallenge").css({
            "opacity": 0
        });
    });

    $("#electrode").click(function () {
        if (!electrodeLifted) {
            tryElectrodeUp();
        } else {
            tryElectrodeDown();
        }
    });

    $("#electrodeClickArea").click(function (evt) {
        tryOpenElectrodeHole();
        evt.stopPropagation();
    });

    $("#waterBottle").click(function () {
        if (!rinseAnim) {
            tryRinseElectrode();
        }
    });

    $("#wipes").click(function () {
        if (!wipeAnim) {
            tryWipeElectrode();
        }
    });

    $("#jar").click(function () {
        if (!jarStirAnim) {
            tryStirJar();
        }
    });

    // Standardize button
    $("#meterButton2").click(function () {
        if (game.props.mode != 1 || game.getCurrentStep().id == "standardize") {
            if (game.getCurrentStep().id == "standardize") {
                meterDisplay.measuringNumbersOn[bufferSelected + 1] = true;
                meterDisplay.pH = jarData[bufferSelected + 1].pH;
                updateMeter();
                game.nextStep();
            } else {
                // Fail game
                failGame("clicked the Standardize button", "");
            }
        }
    });

    // Setup button
    $("#meterButton3").click(function () {
        if (game.props.mode != 1 || game.getCurrentStep().id == "setupButton") {
            if (game.getCurrentStep().id == "setupButton") {
                setupClicks++;
                if (setupClicks == 1) {
                    meterDisplay.sOn = false;
                    meterDisplay.tempOn = false;
                    meterDisplay.pHOn = false;
                    meterDisplay.measuringOn = false;
                    meterDisplay.clearOn = true;
                    meterDisplay.setOn = false;
                    meterDisplay.buffersOn = true;
                    updateMeter();
                } else if (setupClicks >= 2) {
                    game.nextStep();
                    meterDisplay.setOn = true;
                    meterDisplay.clearOn = false;
                    meterDisplay.measuringNumbersOn = [true, true, true, true, true];
                    updateMeter();
                }
            } else {
                // Fail game
                failGame("clicked the Setup button", "");
            }
        }
    });

    // Enter button
    $("#meterButton4").click(function () {
        if (game.props.mode != 1 || game.getCurrentStep().id == "enterButton") {
            if (game.getCurrentStep().id == "enterButton") {
                meterDisplay.sOn = true;
                meterDisplay.tempOn = true;
                meterDisplay.pHOn = true;
                meterDisplay.measuringOn = true;
                meterDisplay.clearOn = false;
                meterDisplay.setOn = false;
                meterDisplay.buffersOn = false;
                meterDisplay.measuringNumbersOn = [false, false, false, false, false];
                updateMeter();
                game.nextStep();
            } else {
                // Fail game
                failGame("clicked the Enter button", "");
            }
        }
    });

    for (var i = 1; i <= 4; i++) {
        initSmallJarEvent(i);
    }

    $(window).keypress(function (e) {
        if (e.which == 32) {
            //game.getCurrentStep().complete();
        }
    });

    // Input pH submit button
    $("#inputPHSubmit").click(function () {
        if (game.getCurrentStep().id == "readMeter") {
            var entry = $("#inputPHInput").val();
            if (Math.abs(entry - meterDisplay.pH) < .0001) {
                game.nextStep();
            } else if (game.props.mode > 1) {
                // Fail game
                failGame("entered a pH of " + entry, "enter a pH of " + meterDisplay.pH);
            }
        }
    });

    for (var i = 1; i <= 4; i++) {
        initMeterButtonHover(i);
    }
    
    $("#stopClickBox").click(function(evt) {
        evt.stopPropagation();
        $("#electrode").click();
    })

    loadStartMenu();
}

function initMeterButtonHover(i) {
    $("#meterButton" + i).hover(function () {
        $("#meterLabel" + i).removeClass("anim_quickFadeOut");
        $("#meterLabel" + i).addClass("anim_quickFadeIn");
    }, function () {
        $("#meterLabel" + i).removeClass("anim_quickFadeIn");
        $("#meterLabel" + i).addClass("anim_quickFadeOut");
    });
}

function spinElement(id) {
    $(id).addClass("anim_littleSpin");
    setTimeout(function () {
        $(id).removeClass("anim_littleSpin");
    }, 1000);
}

function initSmallJarEvent(i) {
    $("#smallJar" + i).click(function () {
        smallJarClicked(i);
    });
}

function smallJarClicked(i) {
    if (buffersActive) {
        if (i >= 2) {
            // Take buffer
            tryTakeSmallJar(i);
        }
    } else {
        tryTakeSmallJar(i);
    }
}

function newStudentData(netID) {
    // New student data object
    studentData = {
        "netID": netID,
        "gameRecord": [],
        "highScores": [0, 0, 0],
        "unlocks": [false, false, false]
    };
}

/*
    Post data to the server!
    ALL HAIL KING SERVER
*/
function postData() {
    var str = JSON.stringify(studentData);
    var str2 = JSON.stringify(stats);
    $.ajax({
        type: "POST",
        url: "writer.php",
        data: {
            'studentData': str,
            'stats': str2
        }
    }).done(function (msg) {
        console.log("Data Saved");
    }).fail(function () {
        console.log("There was an error with the server :(");
    });
}

function isAdmin(name) {
    return isAdminVar;
}

function initEndOptionHover(id) {
    $("#endOption" + id).hover(function () {
        // Mouse over cell
        $("#endOptionDesc" + id).removeClass("anim_exitEndOptionDesc");
        $("#endOptionDesc" + id).addClass("anim_enterEndOptionDesc");

    }, function () {
        // Leave cell
        $("#endOptionDesc" + id).removeClass("anim_enterEndOptionDesc");
        $("#endOptionDesc" + id).addClass("anim_exitEndOptionDesc");
    });
}

// Better than parseInt() in that it detects the first integer in a string even if it starts with something that is not a number.  Still returns NaN if no integers are found.
function betterParseInt(s) {
    var str = s + "";
    while (isNaN(parseInt(str)) && str.length > 0) {
        str = str.substring(1, str.length);
    }
    return parseInt(str);
}

function getAllData() {
    $.ajax({
        url: "info_allScores.php",
        dataType: "json"
    }).done(function (data) {
        allData = data;
        continueLoading();
    }).fail(function () {

    });
}

function enableClicks(bool) {
    if (bool) {
        $("body").css("pointer-events", "auto");
    } else {
        $("body").css("pointer-events", "none");
    }
}

function resetGameState() {
    $("#holeBGClear").removeClass("anim_openElectrodeHole");
    $("#holeBGClear").removeClass("anim_closeElectrodeHole");
    $("#inputPHInput").val("");
    $(".activeIcon").removeClass("activeIcon");
    $(".completeIcon").removeClass("completeIcon");
    $("#electrode").removeClass("anim_electrodeUp");
    $("#electrode").removeClass("anim_electrodeDown");
    setWirePos(0, 0);
    $("#jar").css("opacity", 1);
    bufferSelected = -1;
    resetBufferData();
    setBufferColors();
    meterDisplay = JSON.parse(JSON.stringify(DEFAULT_METER_DISPLAY));
    updateMeter();
    $("#smallJar1").css("opacity", 0);
    for (var i = 2; i <= 4; i++) {
        $("#smallJar" + i).css("opacity", 1);
    }
    $("#droplets").empty();
    $("#wasteContainer").removeClass("anim_wasteContainerIn");
    $("#wasteContainer").removeClass("anim_wasteContainerOut");
    $("#inputPHBox").removeClass("anim_inputPHIn");
    $("#inputPHInput").val("");
}
