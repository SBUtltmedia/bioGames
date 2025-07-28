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
