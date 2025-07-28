var molecules = [{
    "quantity": 4000,
    "weight": 23
}, {
    "quantity": 7450,
    "weight": 95
}, {
    "quantity": 3240,
    "weight": 200
}, {
    "quantity": 8640,
    "weight": 275
}, {
    "quantity": 3450,
    "weight": 300
}]
var start = null;
var c; 
var ctx; 

$( document ).ready(function() {
c= document.getElementById("myCanvas");
    ctx= c.getContext("2d");
    c.style.webkitFilter = "blur(1px)";
    window.requestAnimationFrame(step);
});



var boxSize = 1;
var totalVelocity;
var moleculeArray = [];
var gelWidth = 300;
var gelHeight = 10;
var gelTop = 40;
var charge = .0023;
var velocitySpread = .0001;
var opacity = 1;
var edgeWidth=.01;


molecules.forEach(function (currentMol) {

    var totalMols = currentMol.quantity
    while (totalMols--) {

        var left = Math.random() * gelWidth;
        if(left<(gelWidth*edgeWidth)||left>gelWidth-(gelWidth*edgeWidth))
        {
       var  edgeSpread=.1*(Math.random()-1);    
            }
        else
                  {
       var  edgeSpread=0;    
            }
            
        var top = Math.random() * gelHeight + gelTop;
        var velocity = currentMol.weight * charge + Math.random() * velocitySpread+edgeSpread;
        moleculeArray.push({
            "left": left,
            "top": top,
            "weight": currentMol.weight,
            "velocity": velocity
        })

    }
    //








    //ctx.fillStyle = rgba;









})


function step(timestamp) {
    totalVelocity = 0;
    ctx.clearRect(0, 0, c.width, c.height);
    if (!start) start = timestamp;
    var progress = timestamp - start;



    var totalMols = moleculeArray.length;

    while (totalMols--) {
        ctx.lineWidth = "0";
  
        ctx.fillStyle = "rgba(0,0,0,.02)";
       
        ctx.fillRect(moleculeArray[totalMols].left, gelTop + moleculeArray[totalMols].top, 5, 5);

        moleculeArray[totalMols].top += moleculeArray[totalMols].velocity;
        totalVelocity += moleculeArray[totalMols].velocity;
        //console.log(moleculeArray[totalMols].velocity)
    }
    //console.log(moleculeArray[totalMols+1].top)

    window.requestAnimationFrame(step);

}