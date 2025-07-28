var slotMols =[[{"weight":284,"quantity":444},{"weight":229,"quantity":267},{"weight":200,"quantity":170},{"weight":53,"quantity":148},{"weight":15,"quantity":77},{"weight":89,"quantity":739},{"weight":143,"quantity":814},{"weight":66,"quantity":925},{"weight":155,"quantity":490},{"weight":162,"quantity":647},{"weight":199,"quantity":610},{"weight":35,"quantity":204},{"weight":17,"quantity":860},{"weight":16,"quantity":187}],[{"weight":139,"quantity":650},{"weight":96,"quantity":437},{"weight":167,"quantity":151},{"weight":99,"quantity":216},{"weight":85,"quantity":51},{"weight":170,"quantity":871},{"weight":255,"quantity":213},{"weight":234,"quantity":140},{"weight":264,"quantity":885},{"weight":201,"quantity":434},{"weight":116,"quantity":900},{"weight":299,"quantity":710},{"weight":126,"quantity":252}],[{"weight":38,"quantity":291},{"weight":231,"quantity":529},{"weight":26,"quantity":460},{"weight":253,"quantity":656},{"weight":81,"quantity":957},{"weight":241,"quantity":552},{"weight":88,"quantity":986},{"weight":165,"quantity":967},{"weight":226,"quantity":1000},{"weight":24,"quantity":50},{"weight":60,"quantity":135},{"weight":175,"quantity":407},{"weight":159,"quantity":26}],[{"weight":213,"quantity":513},{"weight":269,"quantity":288},{"weight":70,"quantity":429},{"weight":174,"quantity":709},{"weight":105,"quantity":508},{"weight":26,"quantity":638},{"weight":60,"quantity":977},{"weight":249,"quantity":220},{"weight":122,"quantity":456},{"weight":84,"quantity":417},{"weight":119,"quantity":481},{"weight":207,"quantity":821},{"weight":241,"quantity":480}],[{"weight":107,"quantity":972},{"weight":296,"quantity":70},{"weight":195,"quantity":760},{"weight":32,"quantity":865},{"weight":301,"quantity":861},{"weight":299,"quantity":22},{"weight":13,"quantity":804},{"weight":239,"quantity":377},{"weight":288,"quantity":161},{"weight":251,"quantity":877},{"weight":82,"quantity":372},{"weight":24,"quantity":593},{"weight":278,"quantity":879},{"weight":138,"quantity":194}],[{"weight":219,"quantity":484},{"weight":91,"quantity":670},{"weight":212,"quantity":307},{"weight":182,"quantity":530},{"weight":29,"quantity":400},{"weight":110,"quantity":235},{"weight":244,"quantity":379},{"weight":198,"quantity":753},{"weight":173,"quantity":588},{"weight":300,"quantity":888},{"weight":188,"quantity":154},{"weight":298,"quantity":773},{"weight":61,"quantity":68},{"weight":150,"quantity":767},{"weight":126,"quantity":106}],[{"weight":282,"quantity":258},{"weight":185,"quantity":609},{"weight":91,"quantity":76},{"weight":274,"quantity":590},{"weight":280,"quantity":290},{"weight":170,"quantity":839},{"weight":273,"quantity":680},{"weight":187,"quantity":588},{"weight":268,"quantity":730},{"weight":292,"quantity":382}],[{"weight":188,"quantity":479},{"weight":73,"quantity":88},{"weight":41,"quantity":326},{"weight":283,"quantity":969},{"weight":300,"quantity":290},{"weight":99,"quantity":106},{"weight":171,"quantity":254},{"weight":236,"quantity":927},{"weight":274,"quantity":457},{"weight":46,"quantity":658},{"weight":194,"quantity":627},{"weight":125,"quantity":110},{"weight":242,"quantity":521},{"weight":18,"quantity":97}],[{"weight":67,"quantity":586},{"weight":146,"quantity":960},{"weight":93,"quantity":451},{"weight":176,"quantity":426},{"weight":255,"quantity":610},{"weight":111,"quantity":744},{"weight":100,"quantity":424},{"weight":139,"quantity":206},{"weight":134,"quantity":366},{"weight":181,"quantity":61},{"weight":302,"quantity":226},{"weight":185,"quantity":19},{"weight":65,"quantity":226},{"weight":285,"quantity":128},{"weight":177,"quantity":281}],[{"weight":259,"quantity":684},{"weight":260,"quantity":203},{"weight":63,"quantity":998},{"weight":43,"quantity":838},{"weight":92,"quantity":412},{"weight":66,"quantity":754},{"weight":291,"quantity":609},{"weight":180,"quantity":261},{"weight":90,"quantity":655},{"weight":110,"quantity":872},{"weight":160,"quantity":55},{"weight":199,"quantity":530}]]
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
var slots=[];
slotMols.forEach(function(thisSlot,i){
    var gleft=i*50;
   
 slots.push(new Slot({"molecules":thisSlot,"gelLeft":gleft}))   
    
})


function step(timestamp) {
    totalVelocity = 0;
    ctx.clearRect(0, 0, c.width, c.height);
    if (!start) start = timestamp;
    var progress = timestamp - start;



  slots.forEach(function(thisSlot,i){
thisSlot.update();
  });

        window.requestAnimationFrame(step);
}