// All students' data
var allData = [];

// Showing challenges?
var showingChallenges = false;

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
        resizeWindow();
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

function prepChallenges() {
    // Initialize challenges
    challenges = new Challenges();
    challenges.init();
    // Load challenge data
    var challengeData = [
        {
            "id": "practiceWin",
            "title": "No Pressure",
            "desc": "Complete Practice mode.",
            "flavor": "",
            "level": 0
        },
        {
            "id": "challengeWin",
            "title": "Success",
            "desc": "Complete Challenge mode.",
            "flavor": "",
            "level": 1
        },
        {
            "id": "challengeSpeed",
            "title": "Speed Reader II",
            "desc": "Complete Challenge mode in under 75 seconds.",
            "flavor": "",
            "level": 2
        },
        {
            "id": "practiceSpeed",
            "title": "Speed Reader",
            "desc": "Complete Practice mode in under 60 seconds.",
            "flavor": "",
            "level": 1
        },
        {
            "id": "noMedalPractice",
            "title": "Consolation Prize",
            "desc": "Complete Practice mode without earning a medal.",
            "flavor": "",
            "level": 2
        },
        {
            "id": "perfectPractice",
            "title": "Perfection",
            "desc": "Complete Practice mode without making a mistake.",
            "flavor": "",
            "level": 1
        },
        {
            "id": "perfectChallenge",
            "title": "Perfection II",
            "desc": "Complete Challenge mode without making a mistake.",
            "flavor": "",
            "level": 2
        },
        {
            "id": "challengePlusWin",
            "title": "Great Success",
            "desc": "Complete Challenge+ mode.",
            "flavor": "",
            "level": 2
        },
        {
            "id": "challengePlusSpeed",
            "title": "Speed Reader III",
            "desc": "Complete Challenge+ mode in under 90 seconds.",
            "flavor": "",
            "level": 3
        },
        {
            "id": "read50",
            "title": "Read 50",
            "desc": "Read the volume of 50 cylinders.",
            "flavor": "",
            "level": 4
        },
        {
            "id": "read20",
            "title": "Read 20",
            "desc": "Read the volume of 20 cylinders.",
            "flavor": "",
            "level": 3
        },
        {
            "id": "wins2",
            "title": "Second Win",
            "desc": "Complete the game twice.",
            "flavor": "",
            "level": 2
        },
        {
            "id": "wins5",
            "title": "Pentathlon",
            "desc": "Complete the game 5 times.",
            "flavor": "",
            "level": 3
        },
        {
            "id": "sameCylinder",
            "title": "Familiarity",
            "desc": "Read the same cylinder type 5 times in a single game.",
            "flavor": "",
            "level": 4
        },
        {
            "id": "allCylinders",
            "title": "One of Each",
            "desc": "Read each of the 7 cylinder types at least once in a single game.",
            "flavor": "",
            "level": 3
        },
        {
            "id": "allBronze",
            "title": "Bronze Medalist",
            "desc": "Earn a bronze medal or better in all of the modes.",
            "flavor": "",
            "level": 2
        },
        {
            "id": "allSilver",
            "title": "Silver Medalist",
            "desc": "Earn a silver medal or better in all of the modes.",
            "flavor": "",
            "level": 3
        },
        {
            "id": "allGold",
            "title": "Gold Medalist",
            "desc": "Earn a gold medal in all of the modes.",
            "flavor": "",
            "level": 4
        },
        {
            "id": "perfectChallengePlus",
            "title": "Perfection III",
            "desc": "Complete Challenge+ mode without making a mistake.",
            "flavor": "",
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
            if (allData[j].stats.challengeStates && allData[j].stats.challengeStates[i] == true || (allData[j].name == netID && stats.challengeStates[i])) {
                count++;
            }
        }
        challenges.list[i].completionCount = count;
    }

    // Update challenges
    challenges.update();
    // // console.log(challenges);
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
            // Win a game in Practice
            if (stats.practiceWins > 0) {
                proc = true;
            }
        }
        if (i == 1) {
            // Win a game in Challenge
            if (stats.challengeWins > 0) {
                proc = true;
            }
        }
        if (i == 2) {
            // Challenge speed
            if (challengeSpeed) {
                proc = true;
            }
        }
        if (i == 3) {
            // Practice speed
            if (practiceSpeed) {
                proc = true;
            }
        }
        if (i == 4) {
            // No-medal Practice mode
            if (noMedalPractice) {
                proc = true;
            }
        }
        if (i == 5) {
            // Perfect score in Practice
            if (studentData.highScores[0] == 5) {
                proc = true;
            }
        }
        if (i == 6) {
            // Perfect score in Challenge
            if (studentData.highScores[1] == 100) {
                proc = true;
            }
        }
        if (i == 7) {
            // Win a game in Challenge+
            if (stats.challengePlusWins > 0) {
                proc = true;
            }
        }
        if (i == 8) {
            // Challenge+ speed
            if (challengePlusSpeed) {
                proc = true;
            }
        }
        if (i == 9) {
            // Read 50
            if (stats.readCylinders >= 50) {
                proc = true;
            }
        }
        if (i == 10) {
            // Read 20
            if (stats.readCylinders >= 20) {
                proc = true;
            }
        }
        if (i == 11) {
            // 2 wins
            if (stats.practiceWins + stats.challengeWins + stats.challengePlusWins >= 2) {
                proc = true;
            }
        }
        if (i == 12) {
            // 5 wins
            if (stats.practiceWins + stats.challengeWins + stats.challengePlusWins >= 5) {
                proc = true;
            }
        }
        if (i == 13) {
            // Same cylinder 5 times
            for (var j = 0; j < 7; j++) {
                if (cylinderTypes[j] >= 5) {
                    proc = true;
                }
            }
        }
        if (i == 14) {
            // All 7 cylinders
            proc = true;
            for (var j = 0; j < 7; j++) {
                if (cylinderTypes[j] == 0) {
                    proc = false;
                }
            }
        }
        if (i == 15) {
            // All bronze medals or better
            if (studentData.highScores[0] > 0 && studentData.highScores[0] <= 10 && studentData.highScores[1] >= 80 && studentData.highScores[2] >= 80) {
                proc = true;
            }
        }
        if (i == 16) {
            // All silver medals or better
            if (studentData.highScores[0] > 0 && studentData.highScores[0] <= 7 && studentData.highScores[1] >= 90 && studentData.highScores[2] >= 90) {
                proc = true;
            }
        }
        if (i == 17) {
            // All gold medals
            if (studentData.highScores[0] == 5 && studentData.highScores[1] == 100 && studentData.highScores[2] == 100) {
                proc = true;
            }
        }
        if (i == 18) {
            // Perfect score in Challenge+
            if (studentData.highScores[2] == 100) {
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

function showChallengeScreen() {
    showingChallenges = true;
    $("#overlayBox").removeClass("anim_toLeft");
    $("#overlayBox").removeClass("snapToLeft");
    $("#overlayBox").addClass("anim_toRight");
}

function hideChallengeScreen() {
    showingChallenges = false;
    $("#overlayBox").removeClass("anim_toRight");
    $("#overlayBox").addClass("anim_toLeft");
}

function showChallengeScreenInstant() {
    showingChallenges = true;
    $("#overlayBox").removeClass("anim_toLeft");
    $("#overlayBox").removeClass("anim_toRight");
    $("#overlayBox").addClass("snapToRight");
}

function setCurrentChallenge(id) {
    if (id != 100) {
        // Icon
        var challenge = challenges.getChallenge(id);
        var cell = $("#currentState")
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
        if (challenge.isKnown() || challenge.isComplete()) {
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
        if (challenge.isComplete()) {
            // Flavor text
            // $("#currentFlavor").text(challenge.flavor);
            $("#currentFlavor").text("Completed by " + (Math.floor((challenge.completionCount / allData.length) * 1000) / 10) + "% of players (" + challenge.completionCount + " / " + allData.length + ").");
        } else {
            // Flavor text
            $("#currentFlavor").text("");
        }
    } else {
        var cell = $("#currentState");
        cell.removeClass("unknownIcon");
        cell.removeClass("knownIcon");
        cell.addClass("finishedIcon");
        $("#currentTitle").text("Leaderboard");
        $("#currentDesc").text("View challenges and statistics for other lab games.");
        $("#currentFlavor").text("");
    }

}
