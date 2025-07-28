function Game(props) {
    //postData();
    this.props = props;
    this.hintsEnabled = true;
    this.steps = [];
    this.groups = [];
    this.addStep = function (step) {
        this.steps.push(step);
    }
    this.addGroup = function (group) {
        this.groups.push(group);
    }
    this.linkSteps = function () {
        for (var i = 0; i < this.steps.length - 1; i++) {
            this.steps[i].successor = this.steps[i + 1];
        }
        this.makeStepObjects();
    }
    this.makeStepObjects = function () {
        //
        // Make group objects
        $("#steps").empty();
        for (var i = 0; i < this.groups.length; i++) {

            var group=$('<div/>', {id:'group' + i,class:"group" })
            var groupPanel=$('<div/>', {id:'groupPanel'+ i,class:"groupPanel" })
            var groupIconBG=$('<div/>', {class:"icon_bg" })
            var groupText=$('<div/>', {id:'groupText'+ i,class:"stepText" })
            var groupIcon=$('<div/>', {id:'groupIcon'+ i,class:"icon clickToSpin" })

            groupPanel.append(groupText);
                  group.append(groupIconBG)
              group.append(groupIcon)
            group.append(groupPanel)



               $("#steps").append(group)
        }
        // Make step objects
        for (var i = 0; i < this.steps.length; i++) {

            var currentStep=$('<div/>', {id:'step' + i, class:"step" })
            var currentPanel = $('<div/>', {id:'panel' + i, class:"stepPanel" })
            var currentStepText = $('<div/>', {id:'stepText' + i, class:"stepText fs-18" })
            var iconBG = $('<div/>', {class:"icon_bg" })
            var currentIcon = $('<div/>', {id:'icon' + i, class:"icon clickToSpin" })


            currentStep.append(currentPanel)
            currentStep.append(iconBG)
            currentStep.append(currentIcon)
            currentPanel.append(currentStepText)

                $("#steps").append(currentStep)

/*
            $("#steps").append("<div id='step" + i + "' class='step'></div>");
            $("#step" + i).append("<div id='panel" + i + "' class='stepPanel'></div>");
            $("#panel" + i).append("<div id='stepText" + i + "' class='stepText fs-18'></div>");
            $("#step" + i).append("<div class='icon_bg'></div>");
            $("#step" + i).append("<div id='icon" + i + "' class='icon clickToSpin'></div>");
*/
        }

        $(".clickToSpin").click(function (event) {
            var id = "#" + $(this).attr("id");
            spinElement(id);
        });
        resizeWindow();
    }
    this.getSteps = function () {
        return this.steps;
    }
    this.getGroups = function () {
        return this.groups;
    }
    this.getGroupStep = function (i, j) {
        return this.groups[i].steps[j];
    }
    this.getCurrentStep = function () {
        var currentStep = "none";
        for (var i = 0; i < this.steps.length; i++) {
            if (this.steps[i].state == 1) {
                currentStep = this.steps[i];
                break;
            }
        }
        return currentStep;
    }
    this.getPreviousStep = function () {
        var previousStep = "none";
        for (var i = 0; i < this.steps.length; i++) {
            if (this.steps[i].state == 1) {
                previousStep = this.steps[i - 1];
                break;
            }
        }
        return previousStep;
    }
    this.getNextStep = function () {
        var currentStep = "none";
        for (var i = 0; i < this.steps.length; i++) {
            if (this.steps[i].state == 1) {
                currentStep = this.steps[i];
                break;
            }
        }
        return currentStep;
    }
    this.setCurrentStep = function (stepName) {
        for (var i = 0; i < this.steps.length; i++) {
            if (this.steps[i].id == "stepName") {
                this.steps[i].state = 1;
            }
            else {
                this.steps[i].state = 0;
            }
        }
    }
    this.isGuided = function () {
        return this.props.mode == 1;
    }
    this.isManual = function () {
            return this.props.mode == 2;
        }
        // Expands/collapses the appropriate step objects
    this.updateStepExpansion = function () {
        // Assign a base to each of the steps
        var currentLine = 0;
        for (var i = 0; i < this.getGroups().length; i++) {
            // For each group...
            var currentGroup = this.getGroups()[i];
            currentGroup.animateToPosition(currentLine);
            if (currentGroup.state != 1) {
                // Either inactive or complete; collapse it
                for (var j = 0; j < currentGroup.steps.length; j++) {
                    var currentStep = currentGroup.steps[j];
                    currentStep.animateToPosition(currentLine);
                }
                // New line
                currentLine++;
            }
            else {
                // Active; expand it
                for (var j = 0; j < currentGroup.steps.length; j++) {
                    var currentStep = currentGroup.steps[j];
                    currentLine++;
                    currentStep.animateToPosition(currentLine);
                }
                currentLine++;
            }
        }
    }
    this.getStep = function (id) {
        for (var i = 0; i < this.getSteps().length; i++) {
            if (this.getSteps()[i].id == id) {
                return this.getSteps()[i];
            }
        }
    }
    this.showHints = function () {
        return this.hintsEnabled;
    }
    this.start = function () {
        //onsole.log(hash)
        this.steps[0].activate();
        if (testMode) {
            jumpToStep(hash)
            console.log(testMode)

        }
    }
    this.nextStep = function () {
        this.getCurrentStep().complete();
    }
}

function Step(cur, div, iconDiv) {
    for (var key in cur) {
        this[key] = cur[key]
    }
    this.div = div;
    this.iconDiv = iconDiv;
    this.predecessor;
    this.successor;
    this.state = 0; // 0 if inactive and not complete, 1 if active and not complete, 2 if complete (cannot be active anymore), 3 if failed
    this.hintTimeout = 0;
    this.hintShowing = false;
    this.position = 0;
    this.isActive = function () {
        return this.state == 1;
    };
    this.isComplete = function () {
        return this.state == 2;
    };
    this.isFailed = function () {
        return this.state == 3;
    }
    this.previous = function () {
        this.predecessor.activate();
    }
    this.complete = function () {
        //console.log(this.id,this.state,this.successor)
        if (this.state == 1) {
            endStep(this);
            this.state = 2;
            //animateCompleteObject(this);
            if (this.successor != null) {
                this.successor.activate();
            }
            else {
                endGame("You Won! Refresh the Page to Play Again.    Your Score Was: "+score);
                setTimeout(function() {
                  score = 0
                }, 100)
//                steps = [0];
            }
            this.prepComplete();
            updateSteps();
        }
    };
    this.activate = function () {
        if (this.state == 0) {
            this.state = 1;
            enableClicks(true);
            animateActivateObject(this, false);
            if (!testMode) {
                startStep(this);
            }
            //            if (testMode) {
            //                jumpToStep(this.id)
            //
            //            }
            // Start timer to show hint
            if (game.isGuided()) {
                this.hintTimeout = setTimeout(function (t) {
                    t.hintShowing = true;
                    $("#box_" + t.id).removeClass("anim_hintFadeOut");
                    $("#box_" + t.id).addClass("anim_hintFadeIn");
                }, 2000, this);
            }
        }
    }
    this.reset = function () {
        this.state = 0;
    };
    this.setPredecessor = function (predecessor) {
        this.predecessor = predecesor;
    };
    this.setSuccessor = function (successor) {
        this.successor = successor;
    };
    this.fail = function () {
        this.state = 3;
        animateFailObject(this);
        setTimeout(function () {
            endGame("lose");
        }, 500);
    }
    this.getFeedbackText = function () {
        return this.feedbackText;
    }
    this.prepComplete = function () {
        // Hide hint
        if (this.hintShowing) {
            $("#box_" + this.id).removeClass("anim_hintFadeIn");
            $("#box_" + this.id).addClass("anim_hintFadeOut");
            setTimeout(function () {
                $("#box_" + this.id).removeClass("anim_hintFadeOut");
            }, 250);
            this.hintShowing = false;
        }
        clearTimeout(this.hintTimeout);
        this.hintTimeout = 0;
    }
    this.animateToPosition = function (line) {
        this.position = line;
        animate(this.div, 250, "css", [{
          'top': (10 * line) + "%"
        }])

    }
}
// Object representing a collapsable group of steps
function StepGroup(id, shortText, div, iconDiv) {
    this.id = id;
    this.shortText = shortText;
    this.div = div;
    this.steps = [];
    this.position = 0;
    this.iconDiv = iconDiv;
    this.state = 0; // 0 = inactive, 1 = active, 2 = complete
    this.addStep = function (newStep) {
        this.steps.push(newStep);
    }
    this.checkState = function () {
        var newState = 2;
        for (var i = 0; i < this.steps.length; i++) {
            if (this.steps[i].state == 1) {
                if (this.state != 1) {
                    this.activate();
                }
                return;
            }
            if (this.steps[i].state == 0) {
                newState = 0;
            }
        }
        if (newState == 2) {
            this.complete();
        }
        this.state = newState;
    }
    this.animateToPosition = function (line) {
        this.position = line;
        animate(this.div, 250, "css", [{
          'top': (10 * line) + "%"
        }])
    }
    this.isActive = function () {
        return this.state == 1;
    };
    this.isComplete = function () {
        return this.state == 2;
    };
    this.isFailed = function () {
        return this.state == 3;
    }
    this.complete = function () {
        if (this.state == 1) {
            this.state = 2;
            animateCompleteObject(this);
        }
    };
    this.activate = function () {
        if (this.state == 0) {
            this.state = 1;
            animateActivateObject(this, true);
        }
    }
    this.fail = function () {
        this.state = 3;
        animateFailObject(this);
    }
    this.reset = function () {
        this.state = 0;
    };
}

function updateSteps() {
    // Group status
    for (var i = 0; i < game.groups.length; i++) {
        game.groups[i].checkState();
    }
    // Step text
    // Steps
    for (var i = 0; i < game.getSteps().length; i++) {
        var step = game.getSteps()[i];
        if (game.isGuided()) {
            $("#stepText" + i).text(step.shortText);
        }
        else {
            if (step.isComplete() || step.isFailed()) {
                $("#stepText" + i).text(step.shortText);
            }
            else {
                $("#stepText" + i).text("? ? ? ? ?");
            }
        }
    }
    // Groups
    for (var i = 0; i < game.groups.length; i++) {
        var group = game.groups[i];
        if (game.isGuided()) {
            $("#groupText" + i).text(group.shortText);
        }
        else {
            if (group.isComplete() || group.isFailed()) {
                $("#groupText" + i).text(group.shortText);
            }
            else {
                $("#groupText" + i).text("? ? ? ? ?");
            }
        }
    }
    // Position
    game.updateStepExpansion();
}

function enterStepObjects() {
  //animate("#waterBathLid", 0, "keyframe", animdefs["anim_removeLid"])
    for (var i = 0; i < game.groups.length; i++) {
        var cur = game.groups[i];
        setTimeout(function (cur) {
            //$(cur.div).removeClass("anim_exitStepObject");
            $(cur.div).addClass("anim_enterStepObject");
        }, 0 * cur.position, cur);
    }
    for (var i = 0; i < game.steps.length; i++) {
        var cur = game.steps[i];
        setTimeout(function (cur) {
            $(cur.div).removeClass("anim_exitStepObject");
            $(cur.div).addClass("anim_enterStepObject");
        }, 0 * cur.position, cur);
    }
}

function exitStepObjects() {
    for (var i = game.groups.length - 1; i >= 0; i--) {
        var cur = game.groups[i];
        setTimeout(function (cur) {
            $(cur.div).removeClass("anim_enterStepObject");
            $(cur.div).addClass("anim_exitStepObject");
        }, 0 * cur.position, cur);
    }
    for (var i = game.steps.length - 1; i >= 0; i--) {
        var cur = game.steps[i];
        setTimeout(function (cur) {
            $(cur.div).removeClass("anim_enterStepObject");
            $(cur.div).addClass("anim_exitStepObject");
        }, 0 * cur.position, cur);
    }
}

function animateActivateObject(obj, isGroup) {
    var div = obj.iconDiv;
    $(div).addClass("inactiveIcon");
    $(div).addClass("anim_stepExit");
    setTimeout(function () {
        $(div).removeClass("anim_stepExit");
        $(div).removeClass("inactiveIcon");
        $(div).addClass("anim_stepEnter");
        if (isGroup) {
            $(div).addClass("activeGroupIcon");
        }
        else {
            $(div).addClass("activeIcon");
        }
    }, 125);
    setTimeout(function () {
        $(div).removeClass("anim_stepEnter");
    }, 500);
}

function animateCompleteObject(obj) {
    var div = obj.iconDiv;
    $(div).removeClass("inactiveIcon");
    $(div).addClass("activeIcon");
    $(div).addClass("anim_stepExit");
    setTimeout(function () {
        $(div).removeClass("anim_stepExit");
        $(div).removeClass("activeIcon");
        $(div).addClass("anim_stepEnterBig");
        $(div).addClass("completeIcon");
    }, 125);
    setTimeout(function () {
        $(div).removeClass("anim_stepEnterBig");
    }, 500);
}

function animateFailObject(obj) {
    var div = obj.iconDiv;
    $(div).removeClass("inactiveIcon");
    $(div).addClass("activeIcon");
    $(div).addClass("anim_stepExit");
    setTimeout(function () {
        $(div).removeClass("anim_stepExit");
        $(div).removeClass("activeIcon");
        $(div).addClass("anim_stepEnterBig");
        $(div).addClass("failIcon");
    }, 125);
    setTimeout(function () {
        $(div).removeClass("anim_stepEnterBig");
    }, 500);
}
