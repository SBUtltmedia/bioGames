// Clicky stuff here
var isAdminVar;
$(function () {
    // Resize window on page load to ensure proper sizing of elements
    resizeWindow();

    // Create event listeners for menu button clicks
    $("#endOption1").click(function () {
        // When menu button 1 is clicked
        // console.log("Clicked button 1");
        props = {
            "mode": 1
        }
        newGame(props);
    });
    $("#endOption2").click(function () {
        // When menu button 2 is clicked
        // console.log("Clicked button 2");
        if (studentData.unlocks[0] || UNLOCK_EVERYTHING) {
            props = {
                "mode": 2
            }
            newGame(props);
        }

    });
    $("#endOption3").click(function () {
        // When menu button 3 is clicked
        // console.log("Clicked button 3");
        if (studentData.unlocks[1] || UNLOCK_EVERYTHING) {
            props = {
                "mode": 3
            }
            newGame(props);
        }
    });

    $("body").click(function () {

    });

    $("#okButton").click(function () {
        submitEntry();
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

    $("#caliperClickBox").click(function () {
        $("#clickZoomText").removeClass("anim_clickZoomEnter");
        $("#clickZoomText").addClass("anim_clickZoomExit");
        if (currentZoom == 1) {
            zoom(3, (caliperDisplay / 12.5), .415);
        } else if (currentZoom == 3) {
            zoom(1, .5, .5);
        }
    });

    $("#viewLeaderboardSelected").click(function () {
        window.open("https://apps.tlt.stonybrook.edu/bio/leaderboard", "_self");
    });

    $(document).keypress(function (e) {
        if (e.which == 13) {
            submitEntry();
        }
        if (e.which == 32) {
            //            var x = 3.71;
            //            setCaliper(x);
            //            zoom(5, (caliperDisplay / 12.5), .45);
        }
    });

    $(document).keydown(function (objEvent) {
        if (objEvent.keyCode == 9) { //tab pressed
            objEvent.preventDefault(); // stops its action
        }
    });
    for (var i = 0; i < 10; i++) {
        $("#progressChecks").append("<div id='progressCheck" + i + "' class='progressCheck'><div id='progressCheckState" + i + "' class='progressCheckState'></div></div>");
        $("#progressCheck" + i).css("left", (i * 10) + "%");
    }

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
    console.log(stats);
    // Prep challenges
    prepChallenges();

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
    loadStartMenu();
}

function exportScoreCSV(data) {
    // Create the CSV file
    var out = '"NetID","Practice: Fewest questions","Challenge: Highest score","Challenge+: Highest score"\n';
    for (var i = 0; i < data.length; i++) {
        var sd = data[i].studentData;
        var str = sd.netID + "," + sd.highScores[0] + "," + sd.highScores[1] + "," + sd.highScores[2] + "\n";
        out += str;
    }
    out = "data:text/csv;charset=utf-8," + out;
    // Make a file
    output = encodeURI(out);
    // Download file
    link = document.createElement('a');
    link.setAttribute('href', output);
    link.setAttribute('download', "CylinderScores.csv");
    link.click();
}

function exportDataCSV(data) {
    // Get maximum number of questions from the user data
    var max = 0;
    for (var i = 0; i < data.length; i++) {
        var sd = data[i].studentData;
        for (var j = 0; j < sd.gameRecord.length; j++) {
            if (sd.gameRecord[j].questions.length > max) {
                max = sd.gameRecord[j].questions.length;
            }
        }
    }
    // Create the CSV file
    // Constant part of header (not questions)
    var out = '"NetID","Mode","Score","Start Time","End Time","Elapsed Time,",';
    for (var i = 1; i <= max; i++) {
        out += '"Q' + i + ' Cylinder","Q' + i + ' Gradation","A' + i + ' Gradation",,,,,"Q' + i + ' Volume","A' + i + ' Volume",,,,';
        if (i < max) {
            out += ",";
        }
    }
    out += "\n";
    // For each user
    for (var i = 0; i < data.length; i++) {
        var sd = data[i].studentData;
        // For each game that the user has played
        for (var j = 0; j < sd.gameRecord.length; j++) {
            var record = sd.gameRecord[j];
            var str = "";
            // Name
            str += sd.netID + ",";
            // Mode
            str += record.mode + ",";
            // Score
            str += record.score + ",";
            // Start time
            str += record.startTime + ",";
            // End time
            str += record.endTime + ",";
            // Elapsed time
            str += record.elapsedTime + ",";
            // For each question, print data
            for (var k = 0; k < max; k++) {
                if (k < record.questions.length) {
                    // Question exists
                    var q = record.questions[k];
                    // Cylinder capacity
                    str += q.capacity + ",";
                    // Gradation
                    str += q.gradation + ",";
                    // Gradation answers
                    for (var l = 0; l < 5; l++) {
                        // If the answer exists
                        if (l < q.gradAnswers.length) {
                            str += q.gradAnswers[l] + ",";
                        } else {
                            if (l == 0 && record.mode == "Challenge") {
                                str += "N/A,"
                            } else {
                                str += ",";
                            }
                        }
                    }
                    // Volume
                    str += q.volume + ",";
                    // Volume answers
                    for (var l = 0; l < 5; l++) {
                        // If the answer exists
                        if (l < q.volAnswers.length) {
                            str += q.volAnswers[l] + ",";
                        } else {
                            str += ",";
                        }
                    }
                } else {
                    str += ",";
                }
            }
            out += "\n";
            out += str;
        }

    }
    out = "data:text/csv;charset=utf-8," + out;
    // Make a file
    output = encodeURI(out);
    // Download file
    link = document.createElement('a');
    link.setAttribute('href', output);
    link.setAttribute('download', "CylinderData.csv");
    link.click();
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
    $("#clickZoomText").removeClass("anim_clickZoomExit");
    $("#clickZoomText").addClass("anim_clickZoomEnter");
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
    $("#clickZoomText").removeClass("anim_clickZoomEnter");
    $("#clickZoomText").addClass("anim_clickZoomExit");
    if (game.props.mode == 1) {
        $("#hintBox").removeClass("anim_enterHintBox");
        $("#hintBox").addClass("anim_exitHintBox");
    }
}

function updateHUD() {
    if (game.props.mode == 1) {
        if (phase == 0) {
            $("#entryLabel1").text("Read the zero on the vernier scale to the nearest tenth of a centimeter.");
        } else if (phase == 1) {
            $("#entryLabel1").text("Which of the vernier scale lines matches a line on the fixed scale?");
        } else if (phase == 2) {
            $("#entryLabel1").text("Type the length of the object below, in centimeters.");
        }
    } else {
        $("#entryLabel1").text("Type the length of the object below, in centimeters.");
    }
    if (game.props.mode == 1) {
        $("#scoreLabel1").text("Progress");
        $("#scoreNum").text(((Math.min(5, cylDiff) + Math.min(5, lineDiff)) * 10) + "%");
        $("#progressLabel1").text("Progress");
        $("#progressLabel2").text("");
        $("#progressNum").text(completed + 1);
    } else if (game.props.mode >= 2) {
        $("#scoreLabel1").text("Score");
        $("#scoreNum").text(score);
        $("#progressLabel1").text("Completed");
        $("#progressNum").text(completed);
    }
    if (game.props.mode == 1) {
        $("#score").css({
            'opacity': "0"
        });
        $("#lives").css({
            'opacity': "0"
        });
    } else if (game.props.mode >= 2) {
        $("#score").css({
            'opacity': "1"
        });
        $("#lives").css({
            'opacity': "1"
        });
    }
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
    /*   if (name == "japalmeri" || name == "moneal") {
        return true;
    }
*/
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