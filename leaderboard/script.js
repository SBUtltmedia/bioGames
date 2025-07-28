var challenges;
var icons;
var TOTAL_ICONS = 7;
var currentZoom = 0;

var rawData = {};
var allData = {};
var totalScores = {};
var gameScores = {};
var completionData = {};
var highScoreArray = [];

// Showing challenges?
var showingChallenges = false;

var games = ["spect", "cylinder", "microPipette", "vernier", "centrifuge", "pH"];
var gameNames = {
    "spect": "spectrophotometer",
    "cylinder": "graduated cylinder",
    "microPipette": "micropipettor",
    "vernier": "vernier caliper",
    "centrifuge": "centrifuge",
    "pH": "pH meter"
};
var dataObtained = [false, false, false, false, false, false];

var netID = "";
var isAdminVar;

var currentUser = "";
var currentGame = "";

var currentPage = 0;
var numScores = 0;
var numPages = 0;

// Tutorial state
var tutorialState = "";
var tutorialLock = [];

var stealth = ["japalmeri"];

var stepCooldown = false;

var stats = {
    "tutorialCleared": false
}

var filters = {
    "all": []
};

var filterNames = {
    "all": "All",
    "consultants": "TLT Consultants"
}

// Tutorial data and text and lock info and blink info
var tutorialData = {
    "start1": {
        "left": 75,
        "top": 5,
        "mainText": "Welcome to the Stony Brook Online Lab leaderboards!",
        "clickText": "(Click to continue)",
        "tutorialLock": ["gameZoom", "rankZoom", "userX"],
        "blink": []
    },
    "start2": {
        "left": 75,
        "top": 5,
        "mainText": "Click on one of the game icons to see the challenges for that game.",
        "clickText": "",
        "tutorialLock": ["rankZoom", "userX"],
        "blink": [".activeGameIcon"]
    },
    "challenge1": {
        "left": 2.5,
        "top": 35,
        "mainText": "Here are the challenges for the %game game.",
        "clickText": "(Click to continue)",
        "tutorialLock": ["return", "gameLink"],
        "blink": []
    },
    "challenge2a": {
        "left": 2.5,
        "top": 35,
        "mainText": "It looks like you've completed all of the challenges. Incredible!",
        "clickText": "(Click to continue)",
        "tutorialLock": ["return", "gameLink"],
        "blink": []
    },
    "challenge2b": {
        "left": 2.5,
        "top": 35,
        "mainText": "Hover over a challenge with a \"!\" symbol to see how to achieve it.",
        "clickText": "",
        "tutorialLock": ["return", "gameLink"],
        "blink": []
    },
    "challenge3": {
        "left": 2.5,
        "top": 35,
        "mainText": "To play this game, normally you would click the %game icon on the right.  Try it now.",
        "clickText": "",
        "tutorialLock": ["return"],
        "blink": ["#playButton"]
    },
    "challenge4": {
        "left": 2.5,
        "top": 35,
        "mainText": "Great! Now, return to the main menu by clicking the return button in the top right corner.",
        "clickText": "",
        "tutorialLock": ["gameLink"],
        "blink": ["#returnButton"]
    },
    "main1": {
        "left": 75,
        "top": 5,
        "mainText": "The green number shows how many challenges you have completed across all of the games.",
        "clickText": "(Click to continue)",
        "tutorialLock": ["gameZoom", "rankZoom", "userX"],
        "blink": []
    },
    "main2": {
        "left": 75,
        "top": 5,
        "mainText": "Click the green hexagon in the center to see how your score compares to other students'.",
        "clickText": "",
        "tutorialLock": ["gameZoom", "userX"],
        "blink": ["#bigCell0"]
    },
    "rank1": {
        "left": 5,
        "top": 45,
        "mainText": "Here, you can see all students' scores and ranks.",
        "clickText": "(Click to continue)",
        "tutorialLock": ["return", "spy"],
        "blink": []
    },
    "rank2": {
        "left": 5,
        "top": 45,
        "mainText": "Click the eye icon next to a student's name to view the challenges they've completed.",
        "clickText": "",
        "tutorialLock": ["return"],
        "blink": [".highScoreView"]
    },
    "spy1": {
        "left": 2.5,
        "top": 42.5,
        "mainText": "Feel free to click around to see this student's completed challenges.",
        "clickText": "(Click to continue)",
        "tutorialLock": ["gameZoom", "rankZoom", "userX"],
        "blink": []
    },
    "spy2": {
        "left": 2.5,
        "top": 42.5,
        "mainText": "To return to your own challenges, click the red X button near the top left corner.",
        "clickText": "",
        "tutorialLock": [],
        "blink": ["#returnUserX"]
    },
    "end1": {
        "left": 75,
        "top": 5,
        "mainText": "That's it for the tutorial.  Good luck completing the challenges!",
        "clickText": "(Click to finish)",
        "tutorialLock": [],
        "blink": []
    }
}

$(function () {
    resizeWindow();
    $.ajax({
        url: "info.php",
        dataType: "json"
    }).done(function (data) {
        // Get user data
        netID = data.name;
        firstName = data.firstname;
        currentUser = netID;
        if (netID == "japalmeri") {
            isAdminVar = true;
        }
        var getStats = data.stats;
        if (Object.keys(getStats).length == 0) {
            // New file
            postData();
        } else {
            stats = getStats;
        }
        // Special Case
        if (netID == "pgraziosi" || netID == "japalmeri") firstName = "Jim";
        if (netID == "pstdenis") firstName = "Denis"; // lol
        // Get all data
        for (var i = 0; i < games.length; i++) {
            getAllData(games[i], i);
        }
    }).fail(function () {
        $("#loading").css({
            "opacity": 0,
            "z-index": -1000000
        });
        startTutorial();
        continueLoading();
    });

});

function loadFilters() {
    $.ajax({
        url: "filters/consultants.txt",
        dataType: "text"
    }).done(function (data) {
        filters["consultants"] = data.split("\n");
        for (var i = 0; i < filters["consultants"].length; i++) {
            filters["consultants"][i] = filters["consultants"][i].trim();
        }
        prepFilters();
        continueLoading();
    }).fail(function () {
        continueLoading();
    });
}

function prepFilters() {
    for (var f in Object.keys(filters)) {
        var f2 = Object.keys(filters)[f];
        $("#filterSelect").append("<option value='" + f2 + "'>" + filterNames[f2] + "</option>");
    }
}

function continueLoading() {
    // Continue loading
    prepIcons();
    prepChallenges();
    $(".cellSelected").hover(function (e) {
        // Mouse over cell
        var id = betterParseInt($(e.target).attr('id'));
        setCurrentChallenge(id);
        if (tutorialState == "challenge2b") {
            if (challenges.getChallenge(id).state == 1) {
                showTutorial("challenge3");
            }
        }
        $("#currentChallenge").css({
            "opacity": 1
        });
        // Mark challenge as not new
        challenges.getChallenge(id).setAsNew(false);

    }, function () {
        // Leave cell
        $("#currentChallenge").css({
            "opacity": 0
        });
    });

    $(".cellSelected").click(function (e) {
        // Click cell
        var id = betterParseInt($(e.target).attr('id'));
    });

    $(".bigCellSelected").hover(function (e) {
        // Mouse over cell
        var id = betterParseInt($(e.target).attr('id'));
        if (!isNaN(id)) {
            hoverIcon(id);
            $("#currentGame").css({
                "opacity": 1
            });
        }
    }, function (e) {
        // Leave cell
        var id = betterParseInt($(e.target).attr('id'));
        leaveIcon(id);
        $("#currentGame").css({
            "opacity": 0
        });
    });

    $(".bigCellSelected").click(function (e) {
        // Click game icon
        var id = betterParseInt($(e.target).attr('id'));
        if (id > 0 && id <= games.length) {
            if (!contains(tutorialLock, "gameZoom")) {
                // Set game
                currentGame = games[id - 1];
                loadChallenges(currentGame);
                zoom(id, "in");
                $("#playButton").css("background-image", "url(img/icon_" + currentGame + ".svg)");
                if (tutorialState == "start2") {
                    showTutorial("challenge1");
                }
            }
        } else if (id == 0) {
            if (!contains(tutorialLock, "rankZoom")) {
                zoom(0, "in");
                if (tutorialState == "main2") {
                    showTutorial("rank1");
                }
            }
        }
        // Return button
        if (!contains(tutorialLock, "return")) {
            if ($(e.target).attr('id') == "returnSelected" || $(e.target).attr('id') == "highScoreReturnSelected") {
                zoom(0, "out");
                if (tutorialState == "challenge4") {
                    showTutorial("main1");
                }
            }
        }
        $("#currentGame").css({
            "opacity": 0
        });
        $("#currentChallenge").css({
            "opacity": 0
        });
    });
    // Switch leaderboard page controls :D
    $("#buttonPageFirst").click(function () {
        currentPage = 0;
        updateHighScores(currentPage);
    });
    $("#buttonPageUp").click(function () {
        if (currentPage > 0) {
            currentPage -= 1;
            updateHighScores(currentPage);
        }
    });
    $("#buttonPageDown").click(function () {
        if (currentPage < numPages - 1) {
            currentPage += 1;
            updateHighScores(currentPage);
        }
    });
    $("#buttonPageLast").click(function () {
        currentPage = numPages - 1;
        updateHighScores(currentPage);
    });
    $("#playButton").click(function () {
        if (!contains(tutorialLock, "gameLink")) {
            if (tutorialState == "challenge3") {
                showTutorial("challenge4");
            } else {
                openGame();
            }
        }
    });
    $("#replayTutorialButton").click(function () {
        startTutorial();
    });
    currentGame = "spect";
    loadChallenges("spect");
    // Update scores
    updateNumbers(currentUser);
    $("#loading").css({
        "opacity": 0,
        "z-index": -1000000
    });
    // Tutorial clicks
    $("body").click(function () {
        if (tutorialState == "start1") {
            showTutorial("start2");
        } else if (tutorialState == "challenge1") {
            if (challengeCount() == 19)
                showTutorial("challenge2a");
            else
                showTutorial("challenge2b");
        } else if (tutorialState == "challenge2a") {
            showTutorial("challenge3");
        } else if (tutorialState == "main1") {
            showTutorial("main2");
        } else if (tutorialState == "rank1") {
            showTutorial("rank2");
        } else if (tutorialState == "spy1") {
            showTutorial("spy2");
        } else if (tutorialState == "end1" && !stepCooldown) {
            endTutorial();
        }
    });
    $("#returnUserX").click(function () {
        if (!contains(tutorialLock, "userX") && !stepCooldown) {
            changeUser(netID);
            zoom(0, "out");
            if (tutorialState == "spy2") {
                showTutorial("end1");
            }
        }
    });
    if (!stats.tutorialCleared) {
        startTutorial();
        $("#replayTutorialButton").css({
            'top': "200%"
        });
    } else {
        $("#replayTutorialButton").css({
            'top': "90%"
        });
    }
    $(window).keypress(function (event) {
        if (event.which == 32) {
            //sortHighScores(filters["consultants"]);
        }
    });
    $("#filterSelect").change(function () {
        var newFilter = $("#filterSelect").val();
        sortHighScores(filters[newFilter]);
        currentPage = 0;
        updateHighScores(0);
    });
}

function prepChallenges() {
    // Initialize challenges
    challenges = new Challenges();
    challenges.init();
}

function loadChallenges(game) {
    // Clear challenges
    challenges.clear();
    // Load challenge data
    for (var i = 0; i < challengeData[game].length; i++) {
        var data = challengeData[game][i];
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
        if (allData[game] != undefined) {
            if (allData[game][currentUser] != undefined) {
                if (allData[game][currentUser][i]) {
                    challenges.getChallenge(i).complete();
                }
            }
        }
    }

    // Make the first challenge viewable
    if (challenges.list[0].isUnknown()) {
        challenges.list[0].activate();
    }
    // Update challenges
    challenges.update();
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
    if (num != undefined && completionData[currentGame] != undefined) {
        this.completionCount = completionData[currentGame][num];
    }
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
            this.state = 1;
        }
    }
    this.complete = function () {
        if (this.state < 2) {
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
        });
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
    this.clear = function () {
        this.list = [];
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
    }
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
}

function challengeCount() {
    var total = 0;
    for (var i = 0; i < 19; i++) {
        if (challenges.getChallenge(i).isComplete()) {
            total++;
        }
    }
    return total;
}

function setCurrentChallenge(id) {
    // Icon
    var challenge = challenges.getChallenge(id);
    var cell = $("#currentState");
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
    if (challenge.isKnown() || challenge.isComplete() || isAdminVar == true) {
        // Title
        $("#currentTitle").text(challenge.title);
        // Description
        $("#currentDesc").text(challenge.desc);
    } else {
        // Title
        $("#currentTitle").text("???");
        // Description
        $("#currentDesc").text("???");
    }
    if (challenge.isComplete() || isAdminVar == true) {
        // Flavor text
        var completed = challenge.completionCount;
        var numUsers = Object.keys(allData[currentGame]).length;
        $("#currentFlavor").text("Completed by " + (Math.floor((completed / numUsers) * 1000) / 10) + "% of players (" + completed + " / " + numUsers + ").");
    } else {
        // Flavor text
        $("#currentFlavor").text("");
    }
}

function hoverIcon(id) {
    if (id == 0) {
        // Show individual game scores
        $(".bigCellScore").removeClass("anim_cellScoreFadeOut");
        $(".bigCellScore").addClass("anim_cellScoreFadeIn");
        $("#currentGameScoreText").text(totalScores[currentUser]);
    } else {
        // Game score
        $("#currentFlavor").text("Placeholder");
        if (gameScores[games[id - 1]] != undefined) {
            if (gameScores[games[id - 1]][currentUser] != undefined)
                $("#currentGameScoreText").text(gameScores[games[id - 1]][currentUser]);
            else
                $("#currentGameScoreText").text(0);
        } else {
            $("#currentGameScoreText").text(0);
        }
    }
    // Set field text
    var icon = icons.getIcon(id);
    if (id <= games.length) {
        // Title
        $("#currentGameTitle").text(icon.title);
        // Description
        $("#currentGameDesc").text(icon.desc);
    } else {
        // Title
        $("#currentGameTitle").text("???");
        // Description
        $("#currentGameDesc").text("???");
    }

}

function leaveIcon(id) {
    if (id == 0) {
        // Hide individual game scores
        $(".bigCellScore").removeClass("anim_cellScoreFadeIn");
        $(".bigCellScore").addClass("anim_cellScoreFadeOut");
    }
}

function GameIcon(id, title, desc) {
    this.id = id;
    this.title = title;
    this.desc = desc;
}

function GameIcons() {
    this.list = [];
    this.left = [32.5, 32.5, 61, 61, 32.5, 4, 4];
    this.top = [32.5, 0, 16.25, 48.75, 65, 48.75, 16.25];
    this.init = function () {
        // Load hexagons
        for (var i = 0; i < TOTAL_ICONS; i++) {
            var j = Math.min(i, this.left.length - 1);
            $("#bigHexGrid").append("<div id='bigCell" + i + "' class='bigCell'></div>");
            $("#bigCell" + i).append("<div id='bigCellState" + i + "' class='bigCellState'></div>");
            $("#bigCell" + i).append("<div id='bigCellSelected" + i + "' class='bigCellSelected'></div>");
            if (i > 0) {
                $("#bigCell" + i).append("<div id='bigCellScore" + i + "' class='bigCellScore'></div>");
                $("#bigCellScore" + i).append("<div id='bigCellScoreText" + i + "' class='bigCellScoreText greenText fs-50'>0</div>");
            }
            $("#bigCell" + i).css({
                "left": this.left[j] + "%",
                "top": this.top[j] + "%"
            });
            $("#bigCell" + i).addClass("icon_" + this.list[i].id);
            if (i > 0 && i <= games.length) {
                $("#bigCell" + i).addClass("activeGameIcon");
            }
            if (i <= games.length) {
                $("#bigCell" + i).addClass("pointer");
            }
        }
    }
    this.getIcon = function (i) {
        return this.list[i];
    }
    this.addIcon = function (id, title, desc) {
        this.list.push(new Challenge(id, title, desc));
    }
    this.update = function () {

    }
}

function prepIcons() {
    // Initialize challenges
    icons = new GameIcons();
    // Load challenge data
    var iconData = [
        {
            "id": "global",
            "title": "Leaderboards",
            "desc": "Compare your total score to other students' scores."
        },
        {
            "id": "spect",
            "title": "Spectrophotometer",
            "desc": "Challenges for the spectrophotometer game."
        },
        {
            "id": "cylinder",
            "title": "Graduated Cylinder",
            "desc": "Challenges for the graduated cylinder game."
        },
        {
            "id": "microPipette",
            "title": "Pipettor",
            "desc": "Challenges for the pipettor game."
        },
        {
            "id": "vernier",
            "title": "Vernier Caliper",
            "desc": "Challenges for the vernier caliper game."
        },
        {
            "id": "centrifuge",
            "title": "Centrifuge",
            "desc": "Challenges for the centrifuge game."
        },
        {
            "id": "pH",
            "title": "pH Meter",
            "desc": "Challenges for the pH meter game."
        }
    ];
    for (var i = 0; i < iconData.length; i++) {
        var data = iconData[i];
        icons.addIcon(data.id, data.title, data.desc);
    }
    for (var i = iconData.length; i < 7; i++) {
        icons.addIcon("unknown", "Icon " + i);
    }
    icons.init();
    // Special case: append score to global icon
    $("#bigCell0").append("<div id='globalScoreText' class='currentUserScore fs-100'>0</div>");
    resizeWindow();
}

// Better than parseInt() in that it detects the first integer in a string even if it starts with something that is not a number.  Still returns NaN if no integers are found.
function betterParseInt(s) {
    var str = s + "";
    while (isNaN(parseInt(str)) && str.length > 0) {
        str = str.substring(1, str.length);
    }
    return parseInt(str);
}

// Zoom into a challenge grid
function zoom(id, dir) {
    var hexOpacity;
    var challengeOpacity;
    var challengeZIndex;
    var highScoreOpacity;
    var highScoreZIndex;
    var width = 100;
    var height = 100;
    var top = 0;
    var left = 0;
    var centerXCoords = [.5, .5, .67, .67, .5, .33, .33];
    var centerYCoords = [.5, .24, .37, .63, .76, .63, .37];
    var challengeLefts = ["100%", "40%", "57%", "57%", "40%", "23%", "23%"];
    var challengeTops = ["100%", "14%", "27%", "53%", "66%", "53%", "27%"];
    if (dir == "in") {
        hexOpacity = 0;
        if (id > 0) {
            challengeOpacity = 1;
            challengeZIndex = 10000;
        } else if (id == 0) {
            highScoreOpacity = 1;
            highScoreZIndex = 10000;
        }
        currentZoom = id;
        // Zoom in
        if (id >= 0) {
            var centerX = centerXCoords[id];
            var centerY = centerYCoords[id];
            height = 500;
            width = height;
            top = -1 * centerY * height + 50;
            left = -1 * centerX * width + 50;
            $("#challengeScreen").css({
                "left": challengeLefts[id],
                "top": challengeTops[id]
            });
        }
    } else if (dir == "out") {
        hexOpacity = 1;
        challengeOpacity = 0;
        challengeZIndex = -10000;
        highScoreOpacity = 0;
        highScoreZIndex = -10000;
        currentZoom = 0;
        var centerX = .5;
        var centerY = .5;
        height = 100;
        width = height;
        top = 0;
        left = 0;
    }
    $("#mainChallengeScreen").animate({
        'width': width + "%",
        'height': height + "%",
        'top': top + "%",
        'left': left + "%"
    }, 250);
    $("#bigHexGrid").animate({
        'opacity': hexOpacity
    }, 250);
    $("#challengeScreen").animate({
        'opacity': challengeOpacity
    }, 250);
    $("#highScoreScreen").animate({
        'opacity': highScoreOpacity
    }, 250);
    setTimeout(function () {
        $("#challengeScreen").css("z-index", challengeZIndex);
    }, 250);
    setTimeout(function () {
        $("#highScoreScreen").css("z-index", highScoreZIndex);
    }, 250);
}

// Get all of the data
function getAllData(game, i) {
    $.ajax({
        url: "../" + game + "/info_allScores.php",
        dataType: "json"
    }).done(function (data) {
        rawData[game] = data;
        dataObtained[i] = true;
        processData();
    }).fail(function () {
        console.log("Could not get data :(");
        processData();
    });
}

function processData() {
    // Check if all of the data is there
    for (var i = 0; i < dataObtained.length; i++) {
        if (!dataObtained[i]) {
            return;
        }
    }
    allData = {};
    totalScores = {};
    var totalChallenges = 0;
    for (var j = 0; j < games.length; j++) {
        var game = games[j];
        allData[game] = {};
        gameScores[game] = {};
        for (var i = 0; i < rawData[game].length; i++) {
            var name = rawData[game][i].name;
            if (rawData[game][i].stats != undefined) {
                allData[game][name] = rawData[game][i].stats.challengeStates;
                // Count completed challenges
                if (totalScores[name] == undefined) {
                    totalScores[name] = 0;
                }
                if (allData[game][name] != undefined) {
                    var score = countTrues(allData[game][name]);
                    gameScores[game][name] = score;
                    totalScores[name] += score;
                    totalChallenges += score;
                }
            }
        }
    }
    //console.log("Total challenges: " + totalChallenges);
    // Sort high scores based on empty array (i.e. no filter) and compute tied ranks
    sortHighScores([]);

    // Get completion percentage for each challenge
    for (var g in games) {
        var game = games[g];
        completionData[game] = [];
        var objKeys = Object.keys(allData[game]);
        for (var i = 0; i < 19; i++) {
            var count = 0;
            for (var j = 0; j < objKeys.length; j++) {
                if (allData[game][objKeys[j]] != undefined) {
                    if (allData[game][objKeys[j]][i] == true) {
                        count++;
                    }
                }
            }
            completionData[game][i] = count;
        }
    }
    prepAllHighScores();
    loadFilters();

}

function sortHighScores(filter) {
    // Sort high scores
    highScoreArray = [];
    for (var user in totalScores) {
        if ((filter.length == 0 || contains(filter, user)) && !contains(stealth, user)) {
            highScoreArray.push([user, totalScores[user], 0]);
        }
    }
    highScoreArray.sort(function (a, b) {
        return b[1] - a[1];
    });
    // Compute tied ranks
    var curRank = -1;
    var curScore = -1;
    for (var i = 0; i < highScoreArray.length; i++) {
        if (highScoreArray[i][1] != curScore) {
            highScoreArray[i][2] = i;
            curRank = i;
            curScore = highScoreArray[i][1];
        } else {
            highScoreArray[i][2] = curRank;
        }
    }
    numScores = highScoreArray.length;
    numPages = Math.ceil(numScores / 10);
    updateHighScores(currentPage);
}

function updateNumbers(name) {
    // Name
    $("#userNameText").text(netID);
    $("#returnUserNameText").text(name);
    // Display score data
    $(".userScore").text(totalScores[netID]);
    $(".currentUserScore").text(totalScores[name]);
    for (var i = 0; i < games.length; i++) {
        if (gameScores[games[i]][name] != undefined)
            $("#bigCellScoreText" + (i + 1)).text(gameScores[games[i]][name]);
        else
            $("#bigCellScoreText" + (i + 1)).text(0);
    }
}

function countTrues(l) {
    var count = 0;
    for (var i = 0; i < l.length; i++) {
        if (l[i])
            count++;
    }
    return count;
}

function prepAllHighScores() {
    for (var i = 0; i < 10; i++) {
        prepHighScores(i);
    }
}

function prepHighScores(id) {
    // html string!
    var htmlString = "<div id='highScoreInfo%' class='highScoreInfo'><div id='highScoreRank%' class='highScoreRank'><div id='highScoreRankLabel%' class='highScoreRankLabel fs-10'>Rank</div><div id='highScoreRankText%' class='highScoreRankText fs-24'>1</div><div id='highScoreRankLowerText%' class='highScoreRankLowerText fs-10'>of 99</div></div><div id='highScore%' class='highScore'><div id='highScoreText%' class='highScoreText fs-28'>114</div></div><div id='highScoreName%' class='highScoreName fs-32'><div id='highScoreNameText%' class='highScoreNameText fs-28'></div></div><div id='highScoreView%' class='highScoreView pointer'></div></div>\n";
    htmlString = htmlString.replace(/%/g, id);
    $("#highScoreView").append(htmlString);
    $("#highScoreInfo" + id).css("top", (8 * id + 10) + "%");
    $("#highScoreInfo" + id).click(function () {
        if (!contains(tutorialLock, "spy")) {
            changeUserView(id);
            zoom(0, "out");
            if (tutorialState == "rank2") {
                showTutorial("spy1");
            }
        }
    });
    updateHighScores(currentPage);
}

function changeUserView(id) {
    var userID = 10 * currentPage + id;
    currentUser = highScoreArray[userID][0];
    updateHighScores(currentPage);
    updateNumbers(currentUser);
    if (currentUser == netID) {
        $("#returnUser").removeClass("anim_showReturnUserPanel");
        $("#returnUser").addClass("anim_hideReturnUserPanel");
    } else {
        $("#returnUser").removeClass("anim_hideReturnUserPanel");
        $("#returnUser").addClass("anim_showReturnUserPanel");
    }
}

function changeUser(user) {
    currentUser = user;
    updateHighScores(currentPage);
    updateNumbers(currentUser);
    if (currentUser == netID) {
        $("#returnUser").removeClass("anim_showReturnUserPanel");
        $("#returnUser").addClass("anim_hideReturnUserPanel");
    } else {
        $("#returnUser").removeClass("anim_hideReturnUserPanel");
        $("#returnUser").addClass("anim_showReturnUserPanel");
    }
}

function updateHighScores(page) {
    // Update high scores
    $("#highScorePageText").text(page + 1);
    $("#highScorePageLowerText").text("of " + numPages);
    for (var i = 0; i < 10; i++) {
        var id = i + 10 * page;
        if (id < numScores) {
            $("#highScoreRankText" + i).text(highScoreArray[id][2] + 1);
            $("#highScoreText" + i).text(highScoreArray[id][1]);
            $("#highScoreNameText" + i).text(highScoreArray[id][0]);
            $("#highScoreInfo" + i).css("opacity", 1);
            $("#highScoreRankLowerText" + i).text("of " + numScores);
            $("#highScoreView" + i).css("background-image", (currentUser == highScoreArray[id][0] ? "url(img/view_hexagon.svg)" : "url(img/view_hexagon_off.svg)"));
        } else {
            $("#highScoreInfo" + i).css("opacity", 0);
        }
    }
    // Current rank
    $("#highScoreRankTextMain").text("?");
    for (var i = 0; i < highScoreArray.length; i++) {
        if (highScoreArray[i][0] == currentUser) {
            $("#highScoreRankTextMain").text((highScoreArray[i][2] + 1) + "");
        }
    }
    $("#highScoreRankLowerTextMain").text("of " + numScores);

}

function openGame() {
    window.open("https://apps.tlt.stonybrook.edu/bio/" + currentGame, "_self");
    window.focus();
}

function showTutorial(str) {
    if (!stepCooldown) {
        // Prevent advancement for .25 seconds
        stepCooldown = true;
        setTimeout(function () {
            stepCooldown = false;
        }, 250);
        // Set tutorial state
        tutorialState = str;
        var props = tutorialData[str];
        var left = props.left;
        var top = props.top;
        var mainText = props.mainText.replace("%game", gameNames[currentGame]);
        var clickText = props.clickText;
        tutorialLock = props.tutorialLock;
        var blink = props.blink;
        // Position bubble
        $("#tutorial").css({
            'left': left + "%",
            'top': top + "%",
            'opacity': 1,
            'z-index': 100000
        });
        // Set tutorial bubble text
        $("#tutorialText").text(mainText);
        $("#tutorialClickText").text(clickText);
        // Blink animation
        $(".anim_tutorialBlink").removeClass("anim_tutorialBlink");
        for (var i = 0; i < blink.length; i++) {
            $(blink[i]).addClass("anim_tutorialBlink");
        }
    }
}

function startTutorial() {
    $("#replayTutorialButton").css({
        'top': "200%"
    });
    showTutorial("start1");
}

function hideTutorial() {
    tutorialState = "";
    $("#tutorial").css({
        'opacity': 0,
        'z-index': -10000
    });
}

function endTutorial() {
    hideTutorial();
    if (!stats.tutorialCleared) {
        stats.tutorialCleared = true;
        postData();
    }
    $("#replayTutorialButton").css({
        'top': "90%"
    });
}

function contains(l, e) {
    for (var i = 0; i < l.length; i++) {
        if (l[i] == e) {
            return true;
        }
    }
    return false;
}

/*
    Post data to the server!
    ALL HAIL KING SERVER
*/
function postData() {
    var str = JSON.stringify(stats);
    $.ajax({
        type: "POST",
        url: "writer.php",
        data: {
            'stats': str
        }
    }).done(function (msg) {
        //alert("Data Saved: " + msg);
    }).fail(function () {
        //alert("There was an error with the server :(");
    });
}