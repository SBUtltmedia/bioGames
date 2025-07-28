function loadSteps() {

    var bufferText = [
        {
            "id": "liftElectrode",
            "shortText": "Lift Electrode",
            "longText": "Click the electrode to lift it from the solution.",
            "feedbackText": "lift the electrode from the solution"
        },
        {
            "id": "rinseElectrode",
            "shortText": "Rinse Electrode",
            "longText": "Click the bottle of water to rinse the electrode.",
            "feedbackText": "rinse the electrode"
        },
        {
            "id": "wipeElectrode",
            "shortText": "Blot Electrode",
            "longText": "Click the box of wipes to blot the electrode.",
            "feedbackText": "blot the electrode with a wipe"
        },
        {
            "id": "selectBuffer",
            "shortText": "Select Buffer",
            "longText": "Click the buffer you would like to use.",
            "feedbackText": "select a buffer"
        },
        {
            "id": "lowerElectrode",
            "shortText": "Lower Electrode",
            "longText": "Lower the electrode into the solution.",
            "feedbackText": "lower the electrode"
        },
        {
            "id": "stirSolution",
            "shortText": "Swirl Solution",
            "longText": "Gently swirl the solution.",
            "feedbackText": "swirl the solution"
        },
        {
            "id": "standardize",
            "shortText": "Standardize",
            "longText": "Press the Standardize button to calibrate the pH meter.",
            "feedbackText": "press the standardize button"
        },
    ];

    var measureText = bufferText.slice();
    measureText[3] = {
        "id": "selectSolution",
        "shortText": "Select Solution",
        "longText": "Select the solution that you would like to use.",
        "feedbackText": "select a solution"
    };
    measureText[6] = {
        "id": "readMeter",
        "shortText": "Read pH Meter",
        "longText": "Read the pH meter once it stabilizes.",
        "feedbackText": "read the pH meter"
    };

    var stepText = [
        {
            "id": "setup",
            "shortText": "Initial Setup",
            "steps": [
                {
                    "id": "closeElectrodeHole",
                    "shortText": "Twist Electrode",
                    "longText": "Click the light-blue part of the electrode to open the pH probe.",
                    "feedbackText": "click the light-blue part of the electrode"
                },
                {
                    "id": "setupButton",
                    "shortText": "Setup Button",
                    "longText": "Click the Setup button twice.",
                    "feedbackText": "click the Setup button twice"
                },
                {
                    "id": "enterButton",
                    "shortText": "Enter Button",
                    "longText": "Click the Enter button.",
                    "feedbackText": "click the Enter button"
                }
            ]
        },
        {
            "id": "prep1",
            "shortText": "Prepare Buffer 1",
            "steps": []
        },
        {
            "id": "prep2",
            "shortText": "Prepare Buffer 2",
            "steps": []
        },
        {
            "id": "prep3",
            "shortText": "Prepare Buffer 3",
            "steps": []
        },
        {
            "id": "measure",
            "shortText": "Measure pH",
            "steps": []
        }
    ];

    for (var i = 1; i < 4; i++) {
        stepText[i].steps = bufferText.slice();
    }
    stepText[4].steps = measureText.slice();
    var stepCount = -1;
    var groupCount = -1;
    for (i in stepText) {
        groupCount++;
        var newGroup = new StepGroup(stepText[i].id, stepText[i].shortText, "#group" + groupCount, "#groupIcon" + groupCount);
        game.addGroup(newGroup);
        for (j in stepText[i].steps) {
            var cur = stepText[i].steps[j];
            stepCount++;
            var newStep = new Step(cur.id, cur.shortText, cur.longText, cur.feedback, "#step" + stepCount, "#icon" + stepCount);
            game.addStep(newStep);
            newGroup.addStep(newStep);
        }
    }
    game.linkSteps();
    updateSteps();
}