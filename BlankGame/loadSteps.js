function loadSteps() {

    var stepText = [
        {
            "id": "group1",
            "shortText": "Group 1",
            "steps": [
                {
                    "id": "step1",
                    "shortText": "Step 1",
                    "longText": "Complete the first step",
                    "feedbackText": "complete the first step"
                },
                {
                    "id": "step2",
                    "shortText": "Step 2",
                    "longText": "Complete the second step",
                    "feedbackText": "complete the second step"
                },
                {
                    "id": "step3",
                    "shortText": "Step 3",
                    "longText": "Complete the third step",
                    "feedbackText": "complete the third step"
                }
            ]
        },
        {
            "id": "group2",
            "shortText": "Group 2",
            "steps": [
                {
                    "id": "step1",
                    "shortText": "Step 1",
                    "longText": "Complete the first step",
                    "feedbackText": "complete the first step"
                },
                {
                    "id": "step2",
                    "shortText": "Step 2",
                    "longText": "Complete the second step",
                    "feedbackText": "complete the second step"
                },
                {
                    "id": "step3",
                    "shortText": "Step 3",
                    "longText": "Complete the third step",
                    "feedbackText": "complete the third step"
                }
            ]
        }
    ];
    
    processSteps(stepText);
}


// Don't touch this
function processSteps(stepText) {
    var stepCount = -1;
    var groupCount = -1;
    for (i in stepText) {
        groupCount++;
        var newGroup = new StepGroup(stepText[i].id, stepText[i].shortText, "#group" + groupCount, "#groupIcon" + groupCount);
        game.addGroup(newGroup);
        for (j in stepText[i].steps) {
            var cur = stepText[i].steps[j];
            stepCount++;
            var newStep = new Step(cur.id, cur.shortText, cur.longText, cur.feedbackText, "#step" + stepCount, "#icon" + stepCount);
            game.addStep(newStep);
            newGroup.addStep(newStep);
        }
    }
    game.linkSteps();
    updateSteps();
}