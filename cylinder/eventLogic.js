// Clicky stuff here
var isAdminVar;
var UNLOCK_EVERYTHING = false;

$(function () {
    // Resize window on page load to ensure proper sizing of elements
    resizeWindow();

    // Create event listeners for menu button clicks
    $("#endOption1").click(function () {
        // When menu button 1 is clicked
        // // console.log("Clicked button 1");
        props = {
            "mode": 1
        }
        newGame(props);
    });
    $("#endOption2").click(function () {
        // When menu button 2 is clicked
        // // console.log("Clicked button 2");
        if (studentData.unlocks[0] || UNLOCK_EVERYTHING) {
            props = {
                "mode": 2
            }
            newGame(props);
        }

    });
    $("#endOption3").click(function () {
        // When menu button 3 is clicked
        // // console.log("Clicked button 3");
        if (studentData.unlocks[1] || UNLOCK_EVERYTHING) {
            props = {
                "mode": 3
            }
            newGame(props);
        }
    });

    $("body").click(function () {
        //zoomCylinder = (zoomCylinder + 1) % cylinders.length;
        //zoom(zoomCylinder);
    });

    $("#okButton").click(function () {
        submitEntry();
    });

    $("#zoomButton").click(function () {
        if (currentZoom == 1) {
            zoom(currentCylinder, 4);
        } else {
            zoom(currentCylinder, 1);
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
        window.open("https://apps.tlt.stonybrook.edu/bio/leaderboard", "_self");
    });

    $(document).keypress(function (e) {
        if (e.which == 13) {
            submitEntry();
        }
        if (e.which == 90) {
            // // console.log(gameData);
        }
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
            // Not a new file
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

function initCylinders(volumes) {
    $("#cylinders").empty();
    cylinders = [];
    var total = volumes.length;
    for (var i = 0; i < total; i++) {
        // Create cylinder object
        cylinders.push(new Cylinder(i, volumes[i], (game.props.mode == 3)));
        var c = cylinders[i];
        // Create cylinder div
        $("#cylinders").append("<div id='cylinder" + i + "' class='cylinder'></div>");
        // Move and resize cylinder
        var h = cylinders[i].height; // Height of cylinder (percentage of parent div)
        var l = (100 * i / total) + ((100 / total) - (h / 5)) / 2;
        var cyl = $("#cylinder" + i);
        cyl.css({
            'height': h + "%",
            'width': (h / 5) + "%",
            'top': (100 - h) + "%",
            'left': l + "%"
        });
        // Add front
        cyl.append("<div id='front" + i + "' class='front'></div>");
        // Add marks
        cyl.append("<div id='marks" + i + "' class='marks'></div>");
        // Set image for marks
        $("#marks" + i).css({
            'background-image': "url(img/marks" + volumes[i] + ".svg)"
        });
        // Add fluid
        cyl.append("<div id='fluid" + i + "' class='fluid'></div>");
        // Set fluid height
        var pct = cylinders[i].fluidPercent;
        $("#fluid" + i).css({
            'top': (94.45 - 75.75 * pct) + "%",
            'height': (75.75 * pct) + "%"
        });
        // Add meniscus
        cyl.append("<div id='meniscus" + i + "' class='meniscus'></div>");
        // Set meniscus height
        if (c.getClass() == "meniscusTall") {
            $("#meniscus" + i).css({
                'top': (91.75 - 75.75 * pct) + "%"
            });
        } else if (c.getClass() == "meniscusMedium") {
            $("#meniscus" + i).css({
                'top': (91.7 - 75.75 * pct) + "%"
            });
        } else if (c.getClass() == "meniscusShort") {
            $("#meniscus" + i).css({
                'top': (91.8 - 75.75 * pct) + "%"
            });
        }
        $("#meniscus" + i).css({
            'opacity': 1
        });
        $("#meniscus" + i).addClass(cylinders[i].getClass());
    }
}

function showHUD() {
    updateHUD();
    $("#hudLeft").removeClass("anim_hudLeftOut");
    $("#hudRight").removeClass("anim_hudRightOut");
    $("#hudLeft").addClass("anim_hudLeftIn");
    $("#hudRight").addClass("anim_hudRightIn");
}

function hideHUD() {
    $("#hudLeft").removeClass("anim_hudLeftIn");
    $("#hudRight").removeClass("anim_hudRightIn");
    $("#hudLeft").addClass("anim_hudLeftOut");
    $("#hudRight").addClass("anim_hudRightOut");
}

function updateHUD() {
    if (game.props.mode == 1 && phase == 0) {
        $("#questionLabel1").text("What volume is represented by one gradation?");
    } else {
        $("#questionLabel1").text("What is the volume of the fluid?");
    }
    if (game.props.mode == 1) {
        $("#scoreLabel1").text("Progress");
        $("#scoreNum").text(((Math.min(5, cylDiff) + Math.min(5, lineDiff)) * 10) + "%");
        $("#progressLabel1").text("Question");
        $("#progressLabel2").text("");
        $("#progressNum").text(completed + 1);
    } else if (game.props.mode >= 2) {
        $("#scoreLabel1").text("Score");
        $("#scoreNum").text(score);
        $("#progressLabel1").text("Completed");
        $("#progressNum").text(completed);
    }
    if (game.props.mode == 1) {
        $("#lives").css({
            'left': "-30%"
        });
    } else if (game.props.mode >= 2) {
        $("#lives").css({
            'left': "0%"
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
    // console.log(str);
    // console.log(str2);
    $.ajax({
        type: "POST",
        url: "writer.php",
        data: {
            'studentData': str,
            'stats': str2
        }
    }).done(function (msg) {

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