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
                "left": this.left[j] + "%"
                , "top": this.top[j] + "%"
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
            }
            else if (challenge.isKnown()) {
                cell.addClass("knownIcon");
            }
            else if (challenge.isComplete()) {
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
            }
            else {
                temp.push(outer - 1);
            }
        }
        if (num >= 7 && num <= 18) {
            if (num % 2 == 0) {
                if (num == 18) {
                    temp.push(7);
                    temp.push(1);
                }
                else {
                    temp.push(num + 1);
                    temp.push((num - 6) / 2 + 1);
                }
                temp.push(num - 1);
                temp.push((num - 8) / 2 + 1);
            }
            else {
                temp.push(num + 1);
                if (num == 7) {
                    temp.push(18);
                }
                else {
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
            "id": "challenge0"
            , "title": "Coming Soon!"
            , "desc": "Challenges for this game are coming soon."
            , "flavor": ""
            , "level": 0
        }
        , {
            "id": "challenge1"
            , "title": "Challenge 1"
            , "desc": "Description 1"
            , "flavor": ""
            , "level": 1
        }
        , {
            "id": "challenge2"
            , "title": "Challenge 2"
            , "desc": "Description 2"
            , "flavor": ""
            , "level": 2
        }
        , {
            "id": "challenge3"
            , "title": "Challenge 3"
            , "desc": "Description 3"
            , "flavor": ""
            , "level": 1
        }
        , {
            "id": "challenge4"
            , "title": "Challenge 4"
            , "desc": "Description 4"
            , "flavor": ""
            , "level": 2
        }
        , {
            "id": "challenge5"
            , "title": "Challenge 5"
            , "desc": "Description 5"
            , "flavor": ""
            , "level": 1
        }
        , {
            "id": "challenge6"
            , "title": "Challenge 6"
            , "desc": "Description 6"
            , "flavor": ""
            , "level": 2
        }
        , {
            "id": "challenge7"
            , "title": "Challenge 7"
            , "desc": "Description 7"
            , "flavor": ""
            , "level": 2
        }
        , {
            "id": "challenge8"
            , "title": "Challenge 8"
            , "desc": "Description 8"
            , "flavor": ""
            , "level": 3
        }
        , {
            "id": "challenge9"
            , "title": "Challenge 9"
            , "desc": "Description 9"
            , "flavor": ""
            , "level": 4
        }
        , {
            "id": "challenge10"
            , "title": "Challenge 10"
            , "desc": "Description 10"
            , "flavor": ""
            , "level": 3
        }
        , {
            "id": "challenge11"
            , "title": "Challenge 11"
            , "desc": "Description 11"
            , "flavor": ""
            , "level": 2
        }
        , {
            "id": "challenge12"
            , "title": "Challenge 12"
            , "desc": "Description 12"
            , "flavor": ""
            , "level": 3
        }
        , {
            "id": "challenge13"
            , "title": "Challenge 13"
            , "desc": "Description 13"
            , "flavor": ""
            , "level": 4
        }
        , {
            "id": "challenge14"
            , "title": "Challenge 14"
            , "desc": "Description 14"
            , "flavor": ""
            , "level": 3
        }
        , {
            "id": "challenge15"
            , "title": "Challenge 15"
            , "desc": "Description 15"
            , "flavor": ""
            , "level": 2
        }
        , {
            "id": "challenge16"
            , "title": "Challenge 16"
            , "desc": "Description 16"
            , "flavor": ""
            , "level": 3
        }
        , {
            "id": "challenge17"
            , "title": "Challenge 17"
            , "desc": "Description 17"
            , "flavor": ""
            , "level": 4
        }
        , {
            "id": "challenge18"
            , "title": "Challenge 18"
            , "desc": "Description 18"
            , "flavor": ""
            , "level": 3
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
    // TODO: enable challenges later
    //    for (var i = 0; i < 19; i++) {
    //        challenges.list[i].initAdjacent();
    //        if (stats.challengeStates[i]) {
    //            challenges.getChallenge(i).complete();
    //        }
    //    }
    // Make the first challenge viewable
    if (challenges.list[0].isUnknown()) {
        challenges.list[0].activate();
    }
    // Get completion percentage for each challenge
    for (var i = 0; i < 19; i++) {
        var count = 0;
        for (var j = 0; j < allData.length; j++) {
            if (allData[j].stats.challengeStates[i] == true || (allData[j].name == netID && stats.challengeStates[i])) {
                count++;
            }
        }
        challenges.list[i].completionCount = count;
    }
    // Update challenges
    challenges.update();
    // // 
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
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 1) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 2) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 3) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 4) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 5) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 6) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 7) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 8) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 9) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 10) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 11) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 12) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 13) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 14) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 15) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 16) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 17) {
            // Challenge
            if (false) {
                proc = true;
            }
        }
        if (i == 18) {
            // Challenge
            if (false) {
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

function showHideOverlay() {
    var func = ["removeClass", "addClass"];
    //var $("#overlayBox")
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
        }
        else if (challenge.isKnown()) {
            cell.addClass("knownIcon");
        }
        else if (challenge.isComplete()) {
            cell.addClass("finishedIcon");
        }
        if (challenge.isKnown() || challenge.isComplete()) {
            // Title
            $("#currentTitle").text(challenge.title);
            // Description
            $("#currentDesc").text(challenge.desc);
        }
        else {
            // Title
            $("#currentTitle").text("???");
            // Description
            $("#currentDesc").text("???");
        }
        if (challenge.isComplete()) {
            // Flavor text
            // $("#currentFlavor").text(challenge.flavor);
            $("#currentFlavor").text("Completed by " + (Math.floor((challenge.completionCount / allData.length) * 1000) / 10) + "% of players (" + challenge.completionCount + " / " + allData.length + ").");
        }
        else {
            // Flavor text
            $("#currentFlavor").text("");
        }
    }
    else {
        var cell = $("#currentState");
        cell.removeClass("unknownIcon");
        cell.removeClass("knownIcon");
        cell.addClass("finishedIcon");
        $("#currentTitle").text("Leaderboard");
        $("#currentDesc").text("View challenges and statistics for other lab games.");
        $("#currentFlavor").text("");
    }
}
