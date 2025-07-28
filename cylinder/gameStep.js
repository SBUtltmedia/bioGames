function Game(props) {
    this.props = props;
    this.hintsEnabled = false;
    this.steps = [];
    this.addStep = function (step) {
        this.steps.push(step);
    }
    this.linkSteps = function () {
        for (var i = 0; i < this.steps.length - 1; i++) {
            this.steps[i].successor = this.steps[i + 1];
        }
        this.makeStepObjects();
    }
    this.makeStepObjects = function () {
        // // console.log("Making steps");
        for (var i = 0; i < this.steps.length; i++) {
            $("#steps").append("<div id='step" + i + "' class='step'></div>");
            $("#step" + i).append("<div class='icon_bg'></div>");
            $("#step" + i).append("<div id='icon" + i + "' class='icon'></div>");
            $("#step" + i).append("<div id='panel" + i + "' class='panel'></div>");
            $("#panel" + i).append("<div id='stepText" + i + "' class='stepText fs-18'></div>");
            $("#step" + i).css({
                'top': (10 * i) + "%"
            });
            // Event listener
            $("#step" + i).click({
                id: i
            }, function (event) {
                stepClicked(event.data.id);
            });
        }
        resizeWindow();
    }
    this.getSteps = function () {
        return this.steps;
    }
    this.getCurrentStep = function () {
        for (var i = 0; i < this.getSteps().length; i++) {
            if (this.getSteps()[i].state == 1)
                return this.getSteps()[i];
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
        this.steps[0].activate();
    }
}

function Step(id, shortText, longText, feedbackText) {
    this.id = id;
    this.shortText = shortText;
    this.longText = longText;
    this.feedbackText = feedbackText;
    this.successor;
    this.state = 0; // 0 if inactive and not complete, 1 if active and not complete, 2 if complete (cannot be active anymore), 3 if failed
    this.hintTimeout = 0;
    this.hintShowing = false;
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
            endStep(this);
            this.state = 2;
            animateCompleteStep(this);
            if (this.successor != null) {
                this.successor.activate();
            }
            this.prepComplete();
            updateSteps();
        }
    };
    this.activate = function () {
        if (this.state == 0) {
            this.state = 1;
            animateActivateStep(this);
            startStep(this);
            // Start timer to show hint
            if (game.showHints()) {
                this.hintTimeout = setTimeout(function (t) {
                    t.hintShowing = true;
                    $("#box_" + t.id).removeClass("anim_hintFadeOut")
                    $("#box_" + t.id).addClass("anim_hintFadeIn")
                }, 2000, this);
            }
        }
    }
    this.reset = function () {
        this.state = 0;
    };
    this.setSuccessor = function (successor) {
        this.successor = successor;
    };
    this.fail = function () {
        this.state = 3;
        animateFailStep(this);
        updateSteps();
        setTimeout(function () {
            endGame("lose");
        }, 1000);
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
}

function updateSteps() {
    for (var i = 0; i < game.getSteps().length; i++) {
        if (i < game.getSteps().length) {
            var step = game.getSteps()[i];
            if (game.showHints()) {
                $("#stepText" + i).text(step.shortText);
            } else {
                if (step.isComplete() || step.isFailed()) {
                    $("#stepText" + i).text(step.shortText);
                } else {
                    $("#stepText" + i).text("? ? ? ? ?");
                }
            }
        }
    }
}

function enterStepObjects() {
    for (var i = 0; i < game.getSteps().length; i++) {
        setTimeout(function (id) {
            $("#step" + id).removeClass("anim_exitStepObject")
            $("#step" + id).addClass("anim_enterStepObject")
        }, 400 * i / game.getSteps().length, i);
    }
}

function exitStepObjects() {
    for (var i = 9; i >= 0; i--) {
        setTimeout(function (id) {
            $("#step" + id).removeClass("anim_enterStepObject")
            $("#step" + id).addClass("anim_exitStepObject")
        }, 400 * i / game.getSteps().length, i);
    }
}

function animateActivateStep(step) {
    var id = game.getSteps().indexOf(step);
    $("#icon" + id).addClass("inactiveIcon");
    $("#icon" + id).addClass("anim_stepExit");
    setTimeout(function () {
        $("#icon" + id).removeClass("anim_stepExit");
        $("#icon" + id).removeClass("inactiveIcon");
        $("#icon" + id).addClass("anim_stepEnter");
        $("#icon" + id).addClass("activeIcon");
    }, 125);
    setTimeout(function () {
        $("#icon" + id).removeClass("anim_stepEnter");
    }, 500);
}

function animateCompleteStep(step) {
    var id = game.getSteps().indexOf(step);
    $("#icon" + id).removeClass("inactiveIcon");
    $("#icon" + id).addClass("activeIcon");
    $("#icon" + id).addClass("anim_stepExit");
    setTimeout(function () {
        $("#icon" + id).removeClass("anim_stepExit");
        $("#icon" + id).removeClass("activeIcon");
        $("#icon" + id).addClass("anim_stepEnterBig");
        $("#icon" + id).addClass("completeIcon");
    }, 125);
    setTimeout(function () {
        $("#icon" + id).removeClass("anim_stepEnterBig");
    }, 500);
}

function animateFailStep(step) {
    var id = game.getSteps().indexOf(step);
    $("#icon" + id).removeClass("inactiveIcon");
    $("#icon" + id).addClass("activeIcon");
    $("#icon" + id).addClass("anim_stepExit");
    setTimeout(function () {
        $("#icon" + id).removeClass("anim_stepExit");
        $("#icon" + id).removeClass("activeIcon");
        $("#icon" + id).addClass("anim_stepEnterBig");
        $("#icon" + id).addClass("failIcon");
    }, 125);
    setTimeout(function () {
        $("#icon" + id).removeClass("anim_stepEnterBig");
    }, 500);
}

function stepClicked(id) {
    if (skipEnabled) {
        game.getSteps()[id].complete();
    }
}