function initTargetArrow() {
    $("body").mousedown(function (event) {
        if (!targetArrow.isActive) {
            // Starting the click/drag
            // targetArrow.isActive = true;
            targetArrow.startX = event.pageX - stageLeft;
            targetArrow.startY = event.pageY - stageTop;
        }
    });
    $(window).mousemove(function (event) {
        if (targetArrow.isActive) {
            var x1 = targetArrow.startX;
            var y1 = targetArrow.startY;
            var x2 = event.pageX - stageLeft;
            var y2 = event.pageY - stageTop;
            var arrowLength = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            var x, y, w, rot;
            if (arrowLength > 0) {
                // Position arrow
                x = (x1 + x2) / 2;
                y = (y1 + y2) / 2;
                w = arrowLength;
                // Special case for rotation because JavaScript's atan function is annoying
                rot = -1 * (Math.atan((x2 - x1)/(y2 - y1)));
                if (y2 - y1 < 0) {
                    rot = rot + Math.PI;
                }
                // Set width and rotation first
                $("#targetArrowBody").css({
                    'width': w + "px",
                    'transform': "rotate(" + (rot + Math.PI / 2) + "rad)"
                });
                // Compute height of div when rotated so that we can center it correctly
                var compW = $("#targetArrowBody").width();
                var compH = $("#targetArrowBody").height();
                // Set position
                $("#targetArrowBody").css({
                    'left': (x - compW / 2) + "px",
                    'top': (y - compH / 2) + "px",
                    'opacity': 1
                });
                // Rotate arrow head
                $("#targetArrowHead").css({
                    'transform': "rotate(" + (rot + Math.PI) + "rad)"
                });
                var compW2 = $("#targetArrowHead").width();
                var compH2 = $("#targetArrowHead").height();
                // Set position
                $("#targetArrowHead").css({
                    'left': (x2 - compW2 / 2) + "px",
                    'top': (y2 - compH2 / 2) + "px",
                    'opacity': 1
                });
            }
        }
    });
}