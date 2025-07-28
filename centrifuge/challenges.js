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
            "id": "practice1",
            "title": "A Good Start",
            "desc": "Balance the centrifuge in Practice mode.",
            "flavor": "",
            "level": 0
        },
        {
            "id": "practice5",
            "title": "Take the Fifth",
            "desc": "In Practice mode, balance the centrifuge using five different numbers of tubes.",
            "flavor": "",
            "level": 1
        },
        {
            "id": "solve1",
            "title": "The Solution",
            "desc": "Solve a puzzle.",
            "flavor": "",
            "level": 2
        },
        {
            "id": "imbalanced",
            "title": "Ready to Rumble",
            "desc": "Start the centrifuge without balancing it.",
            "flavor": "",
            "level": 1
        },
        {
            "id": "balance250",
            "title": "Mass Balance",
            "desc": "Balance 250 tubes.",
            "flavor": "",
            "level": 2
        },
        {
            "id": "challengeLv10",
            "title": "Inner Balance",
            "desc": "Clear level 10 of Challenge mode.",
            "flavor": "",
            "level": 1
        },
        {
            "id": "challengeLv10Efficient",
            "title": "Optimized",
            "desc": "Clear level 10 of Challenge mode using 70 tubes or fewer.",
            "flavor": "",
            "level": 2
        },
        {
            "id": "practice10",
            "title": "Decimation",
            "desc": "In Practice mode, balance the centrifuge using ten different numbers of tubes.",
            "flavor": "",
            "level": 2
        },
        {
            "id": "unlockPuzzles",
            "title": "Lockpick",
            "desc": "Unlock all of the puzzles.",
            "flavor": "",
            "level": 3
        },
        {
            "id": "solvePuzzles",
            "title": "Expert Solver",
            "desc": "Solve all of the puzzles.",
            "flavor": "",
            "level": 4
        },
        {
            "id": "meta",
            "title": "So Meta",
            "desc": "Balance the centrifuge, only using slots which correspond to green numbers.",
            "flavor": "",
            "level": 3
        },
        {
            "id": "practiceWinStreak",
            "title": "Win Streak",
            "desc": "In Practice mode, balance a total of 100 tubes in a row without losing.",
            "flavor": "",
            "level": 2
        },
        {
            "id": "balance500",
            "title": "Mass Balance II",
            "desc": "Balance 500 tubes.",
            "flavor": "",
            "level": 3
        },
        {
            "id": "challengeLv10Efficient",
            "title": "Optimized III",
            "desc": "Clear Challenge mode using 235 tubes or fewer.",
            "flavor": "",
            "level": 4
        },
        {
            "id": "challengeLv20",
            "title": "Finale",
            "desc": "Clear Challenge mode.",
            "flavor": "",
            "level": 3
        },
        {
            "id": "challengeLv15",
            "title": "Third Quarter",
            "desc": "Clear level 15 of Challenge mode.",
            "flavor": "",
            "level": 2
        },
        {
            "id": "challengeLv15Efficient",
            "title": "Optimized II",
            "desc": "Clear level 15 of Challenge mode using 140 tubes or fewer.",
            "flavor": "",
            "level": 3
        },
        {
            "id": "practiceAll",
            "title": "Completionist",
            "desc": "In Practice mode, balance the centrifuge using every number of tubes.",
            "flavor": "",
            "level": 4
        },
        {
            "id": "practice15",
            "title": "0x1111",
            "desc": "In Practice mode, balance the centrifuge using fifteen different numbers of tubes.",
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
            if (allData[j].stats != undefined) {
                if (allData[j].stats.challengeStates && allData[j].stats.challengeStates[i] == true || (allData[j].name == netID && stats.challengeStates[i])) {
                    count++;
                }
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
            // Practice x 1
            if (practiceCompletion() >= 1) {
                proc = true;
            }
        }
        if (i == 1) {
            // Practice x 5
            if (practiceCompletion() >= 5) {
                proc = true;
            }
        }
        if (i == 2) {
            // Solve a puzzle
            if (trueCount(stats.puzzleCompletion) >= 1) {
                proc = true;
            }
        }
        if (i == 3) {
            // Lose the game
            if (gameLost) {
                proc = true;
            }
        }
        if (i == 4) {
            // Balance 250
            if (stats.tubesBalanced >= 250) {
                proc = true;
            }
        }
        if (i == 5) {
            // Challenge mode Lv. 10
            if (studentData.highScores[1] >= 10) {
                proc = true;
            }
        }
        if (i == 6) {
            // Challenge mode Lv. 10, optimal
            if (optimal[0]) {
                proc = true;
            }
        }
        if (i == 7) {
            // Practice x 10
            if (practiceCompletion() >= 10) {
                proc = true;
            }
        }
        if (i == 8) {
            // Unlock all puzzle sets
            if (trueCount(stats.puzzleUnlocks) == 4) {
                proc = true;
            }
        }
        if (i == 9) {
            // Solve all puzzles
            if (trueCount(stats.puzzleCompletion) >= 12) {
                proc = true;
            }
        }
        if (i == 10) {
            // So Meta
            if (practiceMeta) {
                proc = true;
            }
        }
        if (i == 11) {
            // Practice win streak
            if (practiceWinStreak) {
                proc = true;
            }
        }
        if (i == 12) {
            // Balance 500
            if (stats.tubesBalanced >= 500) {
                proc = true;
            }
        }
        if (i == 13) {
            // Challenge mode Lv. 20, optimal
            if (optimal[2]) {
                proc = true;
            }
        }
        if (i == 14) {
            // Challenge mode Lv. 20
            if (studentData.highScores[1] >= 20) {
                proc = true;
            }
        }
        if (i == 15) {
            // Challenge mode Lv. 15
            if (studentData.highScores[1] >= 15) {
                proc = true;
            }
        }
        if (i == 16) {
            // Challenge mode Lv. 15, optimal
            if (optimal[1]) {
                proc = true;
            }
        }
        if (i == 17) {
            // Practice x 21
            if (practiceCompletion() >= 21) {
                proc = true;
            }
        }
        if (i == 18) {
            // Practice x 15
            if (practiceCompletion() >= 15) {
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
    $("#overlayBox").removeClass("snapToRight");
    $("#overlayBox").addClass("anim_toRight");
}

function hideChallengeScreen() {
    showingChallenges = false;
    $("#overlayBox").removeClass("snapToRight");
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
