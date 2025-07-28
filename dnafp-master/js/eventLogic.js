// Clicky stuff here
var isAdminVar;
var hash = location.hash.split("#")[1];

if (hash) {
  testMode = true;
}
var criteriaPassed;
var sideTipMoveSpeed = 0.6;
var directionsForSideTipMovement = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1]
]
var gameStarted = false;
var start = new Date;
var score = 0;
var voltage = 0;
var answer = Math.floor(Math.random() * 5 + 3);
var tip = 0;
var timeInWell;
var wellTop = [55, 57.9, 60.3, 62.6, 65, 67.1, 69.3]
var tipBoxTop = [1, 2, 3, 4, 5, 6, 7]

var microtubeAnimation = [{
  target: "Tube",
  name: "anim_moveTube"
}, {
  name: "anim_rotateCap"
}, {
  target: "Cap",
  name: "anim_closeCap"
}, {
  target: "Tube",
  name: "anim_flickTube"
}, {
  target: "Tube",
  name: "anim_tapTube"
}, {
  target: "Tube",
  name: "anim_tubeDown"
}]
//var loadingDyeAnimation = [{
//    target: "Tube"
//    , name: "anim_moveLoadingDye1"
//}, {
//    target: "Cap"
//    , name: "anim_rotateCap"
//}, {
//    target: "Cap"
//    , name: "anim_closeCap"
//}, {
//    target: "Tube"
//    , name: "anim_returnLoadingDye1"
//}]
var pipetteAnimation = [{
  name: "anim_pipetToTube1"
}, {
  name: "anim_pipetToTube2"
}, {
  name: "anim_pipetToTube3"
}, {
  name: "anim_pipetToTube4"
}, {
  name: "anim_pipetToTube5"
}, {
  name: "anim_pipetToTube6"
}]
var tipAnimation = [{
  name: "anim_tipToTube1"
}, {
  name: "anim_tipToTube2"
}, {
  name: "anim_tipToTube3"
}, {
  name: "anim_tipToTube4"
}, {
  name: "anim_tipToTube5"
}, {
  name: "anim_tipToTube6"
}]
var destinationTube = [{
  name: "s0"
}, {
  name: "s1"
}, {
  name: "s2"
}, {
  name: "s3"
}, {
  name: "s4"
}, {
  name: "s5"
}]
//var flickAnimation = [{
//        name: "anim_flickTube"
//}]
//var microtubeState = [0, 0, 0, 0, 0, 0];
var state = {
  firstStep: 23,
  buttonPress: [0, 0, 0, 0, 0, 0],
  microtubeState: [0, 0, 0, 0, 0, 0],
  TipPosition: false,
};
var tubeClicks = [0, 0, 0, 0, 0, 0];
//var loadingDyeState = [0];
var pipetteState = [0, 0, 0];
var tips = [18.2, 19, 19.8, 20.6, 21.4, 22.2, 23, 24.8, 25.6, 26.4, 26.8, 27.3]
//var breach = false;
var breach = false;
$(function() {

  loadSVG();
  $('#pipetteTip1').load("img/tip.svg");
  $('#graduatedCylinder').load("img/graduatedCylinder.svg");
  $('#gelWell').droppable({
    tolerance: "touch"
  });
  loadTubes();


  // var sCap = $.get("img/csCap.svg", function(data) {
  //   console.log(data);
  //   $('#s0Cap').css("background", "url('data:image/svg+xml;utf8,"+data+"')");
  // })


  //
  //    $.get("img/gelWithLane.svg", function (data) {
  //        console.log(data)
  //        $("#gelFinalTop").html(new XMLSerializer().serializeToString(data.documentElement));
  //    })

  enableOptionButtons();
  // Resize window on page load to ensure proper sizing of elements
  resizeWindow();
  //makePipetteTipAnimation();
  // Create event listeners for menu button clicks and start game
  $.ajax({
    url: "info.php",
    dataType: "json"
  }).done(function(data) {
    netID = data.name;
    firstName = data.firstname;
    getStudentData = data.studentData;
    userNetID = data.name;
    isAdminVar = data.isAdmin;
    // Special Case
    studentData = getStudentData;
    stats = data.stats;
    getAllData();
    enableOptionButtons();
  }).fail(function() {
    newStudentData();
    continueLoading();

  });
});


function loadTubes() {
  var j = 0;
  for (var i = 0; i < 6; i++) {

    $(`#s${i}Tube`).load("img/csTube.svg", function() {
        $(`#s${j}Tube svg .tubeColor`).addClass(`s${j}TubeColor`)
        j++;
    });
  }
  $(`#enzTube`).load("img/csTube.svg", function() {
      $(`#enzTube svg .tubeColor`).addClass(`clearTube`)
  });
  $(`#loadDye`).load("img/csTube.svg", function() {
      $(`#loadDye svg .tubeColor`).addClass(`clearTube`)
      $(`#loadDye svg .tubeFluid`).addClass(`dyeFluid`)
  });
}

function enableOptionButtons() {
  $("#endOption1").click(function() {
    if (!gameStarted) {
      gameStarted = true;
      // When menu button 1 is clicked
      props = {
        "mode": 1
      }
      newGame(props);
    }
  });

}

function getDate() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  if (s < 10) {
    s = "0" + s;
  }
  $("h1").text(h + " : " + m + " : " + s);
  setTimeout(function() {
    getDate()
  }, 500);
};
//Monitor game score
function updateScore(amount) {
  score += amount;
}

function tipSelect(number) {
  tip += number;
}

function continueLoading() {
  initEndOptionHover(1);
  itemHover(1);

  $("#headerText").bind("DOMSubtreeModified", function() {
    $("#headerText").animate({
      opacity: '0.3'
    });
    $("#headerText").delay(50).animate({
      opacity: '1.0'
    });
    animate("#headerText", 50, "removeClass", "opClass")
  });

  var volumeButton = document.getElementById("volumeButton");
  /*    $(".tip").on("click",function (evt) {
          var tipNum = betterParseInt(evt.target.id);
          var tipLeft = tips[(tipNum - 1)];
          makePipetteTipAnimation(tipLeft);
      });*/

  //
  //Back button in progress
  //

  var current = window.location.href.split("#")[0]



  var answerButton = document.getElementById("answerButton");
  $("#arrowUp").click(function() {
    message("Incorrect. Please ensure the wells of the gel are on the cathode (-) side.")
    updateScore(-10);
  });

  ['#pressButton_0',
    '#pressButton_1',
    '#pressButton_2',
    '#pressButton_3',
    '#pressButton_4',
    '#pressButton_5',
    '#zoomOutButton',
    '#zoomOutButton1',
    '#volumeButton',
    '#volumeInput',
    '.side',
    '#timerButton',
    '#timer',
    '#powerSupply',
    '#powerSupplyUp',
    '#powerSupplyDown',
    '#voltage',
    '#gelSideView',
    '#arrowUp',
    '#arrowDown',
    '#labBenchTop',
    '#gelTopView',
    '#powerSupplyTop',
    '#lidSide',
    '#gelTrayTop',
    '#gelFinalTop',
    '#micropipetTopView',
    '#wasteBinTop',
    '#lidBox',
    '#lidBase',
    '#zoomOutButton2',
    '#zoomOutButton3',
    '#emptyGraduatedCylinder',
    '#stainedGelContainer',
    '#stainingTray',
    '#tipBoxTop',
    '#gelVoltageCover',
    '#volumeButton1',
    '#volumeInput1',
    '#tip',
    '#pipetteTip1',
    '#gel',
    '#answerButton',
    '#answerInput',
    '#tubeContentMixing4',
    '#volumeButton2',
    '#zoomOutButton1a',
    '.holderTop',
    '.day2',
    '.topView'
  ].forEach(function(item) {

    $(item).addClass("opClass")

  })
  loadStartMenu();
}

function itemLabel() {}

function spinElement(id) {
  $(id).addClass("anim_littleSpin");
  setTimeout(function() {
    $(id).removeClass("anim_littleSpin");
  }, 1000);
}

function newStudentData(netID) {
  // New student data object
  studentData = {
    "netID": netID,
    "gameRecord": [],
    "highScores ": [0, 0, 0],
    "unlocks": [false, false, false]
  };
}
/*
    Post data to the server!
    ALL HAIL KING SERVER
*/
function postData() {
  str = JSON.stringify(["finished"]);
  // var str = JSON.stringify(studentData);
  // var str2 = JSON.stringify(stats);
  $.ajax({
    type: "POST",
    url: "writer.php",
    data: {
      'studentData': score
      //    , 'stats': str2
    }
  }).done(function(msg) {}).fail(function() {});
}

function isAdmin(name) {
  return isAdminVar;
}

function initEndOptionHover(id) {
  $("#endOption" + id).hover(function() {
    // Mouse over cell
    $("#endOptionDesc" + id).removeClass("anim_exitEndOptionDesc");
    $("#endOptionDesc" + id).addClass("anim_enterEndOptionDesc");
  }, function() {
    // Leave cell
    $("#endOptionDesc" + id).removeClass("anim_enterEndOptionDesc");
    $("#endOptionDesc" + id).addClass("anim_exitEndOptionDesc");
  });
}

function itemHover(evt) {
  var id = betterParseInt(evt.target.id)
  $("#itemLabel" + id).hover(function() {
    // Mouse over cell
    $("#itemButton" + id).removeClass("anim_exitEndOptionDesc");
    $("#itemButton" + id).addClass("anim_enterEndOptionDesc");
  }, function() {
    // Leave cell
    $("#itemButton" + id).removeClass("anim_enterEndOptionDesc");
    $("#itemButton" + id).addClass("anim_exitEndOptionDesc");
  });
}
// Better than parseInt() in that it detects the first integer in a string even if it starts with something that is not a number.  Still returns NaN if no integers are found.
function betterParseInt(s) {
  var str = s + "";
  while (isNaN(parseInt(str)) && str.length > 0) {
    str = str.substring(1, str.length);
  }
  return parseInt(str);
}

function getAllData() {
  $.ajax({
    url: "info_allScores.php",
    dataType: "json"
  }).done(function(data) {
    allData = data;
    continueLoading();
  }).fail(function() {});
}

function enableClicks(bool) {
  if (bool) {
    $("body").css("pointer-events", "auto");
  } else {
    $("body").css("pointer-events", "none");
  }
}


function makePipetteTipAnimation(tipLocation) {




  $.keyframe.define({
    name: 'addTip1',
    '0%': {
      left: '27.5%',
      top: '40%',
    },
    '14%': {
      left: tipLocation + "%",
      top: '44%',
    },
    '20%': {
      left: tipLocation + "%",
      top: '47.6%',
    },
    '25%': {
      left: tipLocation + "%",
      top: '42%',
    },
    '90%': {
      left: '86.4%',
      top: '28%',
    },
    '100%': {
      left: '86.4%',
      top: '28%',
    },
  })
}

function makePipetteTippAnimation(tipLocation) {

  $.keyframe.define([{
    name: 'addTipp1',
    '0%': {
      left: '24.5%',
      top: '38%',
    },
    '14%': {
      left: tipLocation + "%",
      top: '44%',
    },
    '20%': {
      left: tipLocation + "%",
      top: '47.6%',
    },
    '25%': {
      left: tipLocation + "%",
      top: '42%',
    },
    '90%': {
      left: '22.9%',
      top: '1%',
      transform: "scale(0.8)"
    },
    '100%': {
      left: '22.9%',
      top: '5.4%',
    },
  }, ])
}

function setLane(laneNum, weightArray) {
  weightArray.forEach(function(val, idx) {
    $("#gel svg #Lane" + laneNum + " #weight" + idx).attr('transform', 'translate(0 ' + val[0] + ') scale(1, ' + val[1] + ')');
  })
}
for (var i = 1; i <= 20; i++) {
  itemHover(i);
}

function itemHover(i) {
  $("#itemLabel" + i).hover(function() {
    $("#itemLabel" + i).removeClass("anim_quickFadeOut");
    $("#itemLabel" + i).addClass("anim_quickFadeIn");
  }, function() {
    $("#itemLabel" + i).removeClass("anim_quickFadeIn");
    $("#itemLabel" + i).addClass("anim_quickFadeOut");
  });
}

function displayVoltageCover() {
  $("#gelVoltageCover").animate({
    opacity: '1.0'
  });
  $("#powerSupplyUp").animate({
    opacity: '1.0'
  });
  $("#powerSupplyDown").animate({
    opacity: '1.0'
  });
  $("#gelVoltageCover").css('zIndex', '5000');
}
