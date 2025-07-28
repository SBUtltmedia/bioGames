// Clicky stuff here
var isAdminVar;

var gameStarted = false;

$(function () {
    // Resize window on page load to ensure proper sizing of elements
    resizeWindow();

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

function spinElement(id) {
    $(id).addClass("anim_littleSpin");
    setTimeout(function () {
        $(id).removeClass("anim_littleSpin");
    }, 1000);
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