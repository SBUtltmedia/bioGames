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
    resizeWindow();
    resetBufferData();
    setBufferColors();

    // Create event listeners for menu button clicks
    $("#endOption1").click(function () {
        if (!gameStarted) {
            gameStarted = true;
            // When menu button 1 is clicked
            // console.log("Clicked button 1");
            props = {
                "mode": 1
            }
            newGame(props);
        }
    });
    $("#endOption2").click(function () {
        if (!gameStarted) {
            gameStarted = true;
            // When menu button 2 is clicked
            // console.log("Clicked button 2");
            if (studentData.unlocks[0] || UNLOCK_EVERYTHING) {
                props = {
                    "mode": 2
                }
                newGame(props);
            }
        }
    });
    $("#endOption3").click(function () {
        if (!gameStarted) {
            gameStarted = true;
            // When menu button 3 is clicked
            // console.log("Clicked button 3");
            if (studentData.unlocks[1] || UNLOCK_EVERYTHING) {
                props = {
                    "mode": 3
                }
                newGame(props);
            }
        }
    });

    $("body").click(function () {

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
        window.open("https://apps.tlt.stonybrook.edu/leaderboard");
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
        // TODO: remove
        getStudentData = {};
        if (Object.keys(getStudentData).length == 0) {
            // New file
            newStudentData(netID);
            postData();
            continueLoading();
        } else {
            console.log(data);
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

    //    $("#electrode").mousedown(function (e) {
    //        targetArrow.origin = "electrode";
    //        targetArrow.startX = e.pageX - stageLeft;
    //        targetArrow.startY = e.pageY - stageTop;
    //        targetArrow.isActive = true;
    //    });
    //
    //    $(window).mouseup(function (event) {
    //        if (targetArrow.isActive) {
    //            if (targetArrow.origin == "electrode") {
    //                if (event.pageY > targetArrow.startY) {
    //                    tryElectrodeDown();
    //                } else if (event.pageY < targetArrow.startY) {
    //                    tryElectrodeUp();
    //                }
    //            }
    //            targetArrow.isActive = false;
    //            targetArrow.startX = 0;
    //            targetArrow.startY = 0;
    //            $(".targetArrow").css({
    //                'opacity': 0
    //            });
    //        }
    //    });

    $("#electrode").click(function () {
        if (!electrodeLifted) {
            tryElectrodeUp();
        } else {
            tryElectrodeDown();
        }
    });
    
    $("#electrodeClickArea").click(function() {
        tryOpenElectrodeHole();
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
                endGame("lose");
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
                endGame("lose");
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
                endGame("lose");
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

    loadStartMenu();
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

function showHUD() {
    updateHUD();
    $("#hudBottom").removeClass("anim_hudBottomOut");
    $("#hudTop").removeClass("anim_hudTopOut");
    $("#hudBottom").addClass("anim_hudBottomIn");
    $("#hudTop").addClass("anim_hudTopIn");
    if (game.props.mode == 1) {
        $("#hintBox").removeClass("anim_exitHintBox");
        $("#hintBox").addClass("anim_enterHintBox");
    }
}

function hideHUD() {
    $("#hudBottom").removeClass("anim_hudBottomIn");
    $("#hudTop").removeClass("anim_hudTopIn");
    $("#hudBottom").addClass("anim_hudBottomOut");
    $("#hudTop").addClass("anim_hudTopOut");
    if (game.props.mode == 1) {
        $("#hintBox").removeClass("anim_enterHintBox");
        $("#hintBox").addClass("anim_exitHintBox");
    }
}

function updateHUD() {

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
        //alert("Data Saved");
    }).fail(function () {
        //alert("There was an error with the server :(");
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