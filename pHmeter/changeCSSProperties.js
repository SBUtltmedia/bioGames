// Arrow move animation
function findKeyframesRule(rule) {
    var ss = document.styleSheets;
    for (var i = 0; i < ss.length; ++i) {
        for (var j = 0; j < ss[i].cssRules.length; ++j) {
            if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule)
                return ss[i].cssRules[j];
        }
    }
    return null;
}

function updateArrowAnimation() {
    var keyframes = findKeyframesRule("arrow_move");
    if (keyframes != null) {
        keyframes.deleteRule("from");
        keyframes.deleteRule("to");
        keyframes.appendRule("from { background-position: " + 0 + "px; }");
        keyframes.appendRule("to { background-position: " + .12 * stageHeight + "px; }");
    }
    $("#targetArrowBody").removeClass("anim_arrow_move");
    $("#targetArrowBody").addClass("anim_arrow_move");
}