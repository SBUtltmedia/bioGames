//var boxSize = 1;
//var totalVelocity;
//var moleculeArray = [];
//var gelWidth = 300;
//var gelHeight = 10;
//var gelTop = 40;
//var charge = .0023;
//var velocitySpread = .0001;
//var opacity = 1;
//var edgeWidth=.01;



function Slot({
    molecules, gelLeft, gelWidth, gelHeight, gelTop, charge, velocitySpread, opacity, edgeWidth
}) {
    gelWidth = gelWidth || 30;
    gelHeight = gelHeight || 2;
    gelTop = gelTop || 40;
    charge = charge || .0023;
    velocitySpread = velocitySpread || .0001;
    opacity = opacity || 1;
    edgeWidth = edgeWidth || .01;






    console.log(gelLeft)
    var moleculeArray = [];
    molecules.forEach(function (currentMol) {

        var totalMols = Math.floor(currentMol.quantity/5);
        while (totalMols--) {

            var left = Math.random() * gelWidth + gelLeft;
            if (left < (gelWidth * edgeWidth + gelLeft) || left > gelWidth + gelLeft - (gelWidth * edgeWidth)) {
                var edgeSpread = 5 * (Math.random() - 1);
            } else {
                var edgeSpread = 0;
            }

            var top = Math.random() * gelHeight + gelTop + edgeSpread;
            var velocity = currentMol.weight * charge + Math.random() * velocitySpread;
            moleculeArray.push({
                "left": left,
                "top": top,
                "weight": currentMol.weight,
                "velocity": velocity
            })

        }

    });





    this.update = function () {


        var totalMols = moleculeArray.length;

        while (totalMols--) {
            ctx.lineWidth = "0";

            ctx.fillStyle = "rgba(0,0,0,.02)";

            ctx.fillRect(moleculeArray[totalMols].left, gelTop + moleculeArray[totalMols].top, 5, 5);

            moleculeArray[totalMols].top += moleculeArray[totalMols].velocity;
            //console.log(moleculeArray[totalMols].velocity)
        }
        //console.log(moleculeArray[totalMols+1].top)



    }



}