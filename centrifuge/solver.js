function getBestSolution(puzzle) {
    var puzzleMod = [[], [], [], []];
    var solution = [];
    // Turn into four groups of six
    for (var i = 0; i < puzzle.length; i++) {
        var cur = puzzle[i];
        var group = cur % 4;
        var pos = (cur - group) / 4;
        puzzleMod[group].push(pos);
    }

    // For each group...
    for (var i = 0; i < 4; i++) {
        var list = puzzleMod[i];
        var count = puzzleMod[i].length;
        var newList = [];
        switch (count) {
        case 0:
            // Do nothing
            break;
        case 1:
            // Add opposite
            newList = newList.concat(pair(list[0]));
            break;
        case 2:
            // If opposites, just add those
            if ((list[0] - list[1] + 6) % 3 == 0) {
                newList = newList.concat(pair(list[0]));
            }
            // Otherwise, if triangular, add the third point
            else if ((list[0] - list[1] + 6) % 2 == 0) {
                newList = newList.concat(tri(list[0]));
            }
            // Otherwise add both pairs
            else {
                newList = newList.concat(pair(list[0]));
                newList = newList.concat(pair(list[1]));
            }
            break;
        case 3:
            // If triangular, add the 3 points
            if ((list[0] - list[1] + 2) % 2 == 0 && (list[1] - list[2] + 2) % 2 == 0) {
                newList = newList.concat(tri(list[0]));
            }
            // If two form a pair, add two pairs
            else if ((list[0] - list[1] + 6) % 3 == 0) {
                newList = newList.concat(pair(list[0]));
                newList = newList.concat(pair(list[2]));
            } else if ((list[0] - list[2] + 6) % 3 == 0) {
                newList = newList.concat(pair(list[1]));
                newList = newList.concat(pair(list[2]));
            } else if ((list[1] - list[2] + 6) % 3 == 0) {
                newList = newList.concat(pair(list[0]));
                newList = newList.concat(pair(list[1]));
            }
            // Otherwise, add all points
            else {
                newList = newList.concat(hex());
            }
            break;
        case 4:
            // If two pairs, add them
            var inv = invert(list);
            if ((inv[0] - inv[1] + 6) % 3 == 0) {
                newList = newList.concat(pair(list[0]));
                newList = newList.concat(pair(list[1]));
            }
            // Otherwise, add all
            else {
                newList = newList.concat(hex());
            }
            break;
        case 5:
            // Add all
            newList = newList.concat(hex());
            break;
        case 6:
            // Add all
            newList = newList.concat(hex());
            break;
        }
        for (var j = 0; j < newList.length; j++) {
            solution.push(4 * newList[j] + i);
        }
    }
    solution = solution.sort(function (a, b) {
        return a - b;
    });
    return solution;

    function pair(n) {
        var out = [];
        out.push(n);
        out.push((n + 3) % 6);
        return out;
    }

    function tri(n) {
        var out = [];
        out.push(n);
        out.push((n + 2) % 6);
        out.push((n + 4) % 6);
        return out;
    }

    function hex() {
        return [0, 1, 2, 3, 4, 5];
    }

    function invert(l) {
        var out = [0, 1, 2, 3, 4, 5];
        for (var i = l.length - 1; i >= 0; i--) {
            out.splice(l[i], 1);
        }
        return out;
    }
}

function solveCurrentPuzzle() {
    var puzzle = [];
    for (var i=0; i<24; i++) {
        if (wellStates[i]) {
            puzzle.push(i);
        }
    }
    var solution = getBestSolution(puzzle);
    for (var i=0; i<solution.length; i++) {
        wellStates[solution[i]] = true;
    }
    updateTubeDisplay();
}

//console.log(getBestSolution([1, 9]));