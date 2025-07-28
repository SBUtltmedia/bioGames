var microTubeEnum = ["untouched", "opened", "closed", "flicked", "tapped", "returned", "exposed"]
const tipTrayRows = 8,
  tipTrayCols = 12;

var criteriaPassed;
var idArray = ["#s0Tube", "#tubeContentMixing3"]

function stateInit() {
  state["microtubeState"] = Array(6).fill(microTubeEnum[0])
  state["tipTray"] = Array(tipTrayRows * tipTrayCols).fill(0)
  state["TipPosition"] = false
  state["wellPosition"] = Array(7).fill(0)
  state["voltage"] = 0
  state["volume"] = 0
  $("#micropipet2").append($('#pipetteTip1'));
  animate("#pipetteTip1", 0, "addClass", "opClass")
}


function updateVoltage(amount) {
  voltage += amount;

}
var rotateObj = [{
  "text-indent": -120
}, {
  duration: 500,
  step: function(now) {
    $(this).attr("transform", 'rotate('+now+')');
  }
}]
var reverseRotateObj=[{
  "text-indent": 0
}, {
  duration: 500,
  step: function(now) {
    $(this).attr("transform", 'rotate('+now+')');
  }
}]

function zeroTime(def) {

  return def.replace(/ [\d\.]+s/g, " .001s")

}


function animate(selector, delay, method, param, callback = () => {}) {

  var animateDur = 400;
  if (testMode) {
    delay = 0
    animateDur = 0;
  }


  // if ($(selector + ':visible').length == 0) {
  //     setTimeout(function () {
  //         $(selector).show();
  //         $(selector).removeClass("opClass");
  //         $(selector).css("visibility", "visible");
  //     }, delay)
  // }

  if (method == "css")

  {
    setTimeout(function() {
      $(selector).css(...param);
      callback();
    }, delay)

    //$(selector).delay(delay).playKeyframe(param, function () {});
  }


  if (method == "keyframe")

  {
    if (testMode) {
      var endState = findKeyFrameDef(param.split("_")[1])

      $(selector).css(endState)
      callback();
    }

    //$(selector).attr("style","")
    else {
      setTimeout(function() {
        //          console.log(param)
        //          console.log(animdefs[param])
        $(selector).playKeyframe(animdefs[param], function() {});
        callback();
      }, delay)
    }
    //$(selector).delay(delay).playKeyframe(param, function () {});
  }

  if (method == "addClass")

  {
    setTimeout(function() {
      $(selector).addClass(param);
      callback();
    }, delay)
  }

  if (method == "removeClass") {
    setTimeout(function() {
      $(selector).removeClass(param);
      callback();
    }, delay)
  }


  if (method == "attr")

  {
    setTimeout(function() {
      $(selector).attr(param[0], param[1]);
      callback();
    }, delay)
  }

  if (method == "animate")

  {
    if (testMode) {
      $(selector).css(...param)
    } else {
      setTimeout(function() {
        $(selector).animate(...param, function() {

          // if ($(selector).css("opacity") == 0) {
          //     $(selector).css("display", "none")
          //
          // }
          callback();
        });
      }, delay)
    }
    //$(selector).delay(delay).playKeyframe(param, function () {});
  } else if (typeof(method) == "function") {
    if (method.name == "zoom" && testMode) {
      zoomInstant(param[0], param[1], param[2])
      callback()
    } else {
      $(selector).delay(delay).queue(function() {
        method(...param, testMode)
        $(this).dequeue();
        callback();
      })
    }


  }
}
var clicked = "0";
var helperFunctions = {
  //step 0
  "liftEnzyme": function() {
    animate("#enzTube", 0, "keyframe", "anim_moveEnz")
  }, //step 1
  "openEnzyme": function() {
    animate("#enzTube svg .Cap", 0, "animate", rotateObj)
    state["firstStep"] = 45;
    animate("#svgfluid", 0, "animate", [{
      "y": 100
    }])
  },
  "openEnzymePost": function() {
    animate("#micropipet2", 1000, "keyframe", "anim_PrepPipet")
    animate("html", 3000, zoom, [25, 46, 9.5, 1000])
    animate("#volumeButton,#volumeInput", 3400, "removeClass", "opClass")
  }, //step 2

  "setVolume": function() {
    state["volume"] = $("#volumeInput").val();
  },
  "setVolumePost": function() {
    animate("#volumeButton,#volumeInput", 1, "addClass", "opClass")
    animate("#view", 0, zoom, [25, 46, 1, 1000])
    animate("#micropipet2", 1100, "keyframe", "anim_lowerPipet")
  },



  "takeEnzyme": function(evt) {
    var selectedTip = evt.currentTarget.id.split("tip")[1];

    var tipNum = betterParseInt(evt.target.id);
    console.log(tipNum)
    var tipLeft = tips[(tipNum - 1)];
    console.log(evt.target.id);
    // in event
    makePipetteTipAnimation(tipLeft);
    animate("#micropipet2", 0, "keyframe", "anim_addTip1")
    animate("#tip" + selectedTip, 0, "keyframe", "anim_hideTip1")
    animate("#pipetteTip1, #pipetteTip1 *", 600, "removeClass", "opClass")


  }, //step 3
  //step 4
  "openTube": function(evt) {


    state["microtubeState"][0] = microTubeEnum[1];


    animate("#s0Tube", 0, "keyframe", "anim_moveTube")
    animate("#s0Tube svg .Cap", 0, "animate", rotateObj)


  }, //step 5
  "addEnzyme": function() {
    $("#s0Tube").css("z-index", "5")
    animate("#micropipet2", 0, "keyframe", "anim_pipetToTube1")
    animate("#svgfluid", 10, "animate", [{
      "y": 35.6
    }])
    animate("#enzTube", 1500, "keyframe", "anim_moveEnzBack")
    animate("#enzTube svg .Cap", 1000, "animate", reverseRotateObj)


  }, //step 6
  "mixContents": function() {
    animate("#view", 0, zoom, [35, 66, 12, 1050])
    for (i = 1; i < 4; i++) {
      animate("#svgfluid", 1000 * i + 500, "animate", [{
        "y": 70
      }, {
        duration: 500,
        step: function(now) {
          $(this).attr("y", now);
        }
      }]);
      animate("#svgfluid", 1000 * (i + 1), "animate", [{
        "y": 35.6
      }, {
        duration: 500,
        step: function(now) {
          $(this).attr("y", now);
        }
      }]);
    };
    animate("#svgfluid", 4500, "animate", [{
      "y": 100
    }])
  },

  "mixContentsPost": function() {

    animate("#view", 5000, zoom, [35, 66, 1, 1000]);


  }, //step 7

  "replaceTip": function() {
    animate("#micropipet2", 0, "keyframe", "anim_pipetToBin")
    animate("#pipetteTip1", 2300, "keyframe", "anim_tipToBin")
    animate("#pipetteTip1", 2700, "attr", ["style", ""])
    animate("#pipetteTip1", 2700, "addClass", "opClass")



    animate("#micropipet2", 3000, "keyframe", "anim_pipetBacktoNormal")
  },
  "closeTube": function() {
    animate("#s0Tube svg .Cap", 0, "animate", reverseRotateObj)
    $("#s0Tube").css("z-index", "0")
    state["microtubeState"][0] = microTubeEnum[2];
  },
  "flickTube": function() {
    animate("#s0Tube", 0, "keyframe", "anim_flickTube");
    state["microtubeState"][0] = microTubeEnum[3];
  },
  "tapTube": function() {
    animate("#s0Tube", 0, "keyframe", "anim_tapTube")
    state["microtubeState"][0] = microTubeEnum[4];
  },
  "tubeRack": function() {
    animate("#s0Tube", 0, "keyframe", "anim_tubeDown")
    for (i = 0; i <= 5; i++) {
      animate("#s" + i + "Tube", 1500, "keyframe", "anim_tube" + i + "ToBath");
    }
    animate("#tubeBlock", 1500, "keyframe", "anim_moveBlock");
    //animate(".pressButton", 2000, "removeClass", "opClass")

    state["microtubeState"][0] = microTubeEnum[5];
    for (i = 0; i <= 5; i++) {
      animate("#s" + i + "Tube", 0, "addClass", "microTube");
    }

  }, //step 12
  "tubeRackPost": function() {
    animate("html", 0, zoom, [35, 65, 4, 1000]);
  },
  "pressTube": function(evt) {
    var tubeId = evt.currentTarget.id.charAt(1);
    console.log(tubeId)
    if (testMode) {
      //animate(".pressButton", 0, "addClass", "opClass");
      for (i = 0; i <= 5; i++) {
        animate("#s" + i + "Tube", 0, "keyframe", "anim_pressTube" + i);
      }
    }
    animate("#s" + tubeId + "Tube", 0, "keyframe", "anim_pressTube" + tubeId);
    //animate("#pressButton_" + tubeId, 50, "addClass", "opClass")
    state["microtubeState"][tubeId] = microTubeEnum[6]
  }, //step 13
  "pressTubePost": function() {
    animate("html", 0, zoom, [35, 65, 1, 1000]);
  },
  "removeLid": function(evt) {
    var top1 = document.getElementsByClassName("topView")
    animate("#waterBathLid", 0, "keyframe", "anim_removeLid")

  }, //step 14
  "checkTemp": function() {
    //        criteriaPassed = true;
    animate("#view", 0, zoom, [65, 21, 10, 1000])
    animate("#view", 3500, zoom, [65, 21, 1, 1000]);
  }, //step 15
  "insertRack": function() {
    animate("#tubeBlock", 0, "keyframe", "anim_insertRack")
    for (i = 0; i <= 5; i++) {
      //animate("#s" + i + "Tube", 0, "addClass", "microTube");
      animate("#s" + i + "Tube", 0, "keyframe", "anim_insertTube" + i);

    }
    animate("#tubeBlock, .microTube", 1750, "addClass", "opClass");


  }, //step 16
  "closeLid": function() {
    animate("#waterBathLid", 0, "keyframe", "anim_replaceLid")
    animate("#view", 1000, zoom, [65, 36, 5, 1500])
    animate("#timerButton,#timer", 1000, "removeClass", "opClass");

  }, //step 17
  "setTimer": function() {
    state["time"] = $("#timer").val();
  },
  "setTimerPost": function() {

    animate("#timer,#timerButton", 1, "addClass", "opClass");
    animate("#view", 0, zoom, [65, 36, 1, 1000]);
    animate("#bothDays *, #bothDays, #day1 *", 0, "attr", ["style", ""])
    animate("#pipetteTip1", 0, "addClass", "opClass")

    animate(".openButton", 0, "addClass", "opClass")

    animate("#day1", 1000, "addClass", "opClass");
    animate("#day2, #tubeBlock, .microTube, #gelSideView", 2000, "removeClass", "opClass")
    animate("#graduatedCylinder, #waterBathNoLid, #waterBathLid, #shelf1, #stainedGel, #stainingTraySide", 0, "addClass", "opClass")

    state["microtubeState"] = Array(6).fill(microTubeEnum[0])

  }, //step 18
  "prepPipet1": function(evt) {
    animate("#volumeButton,#volumeInput", 2400, "removeClass", "opClass");
    animate("#micropipet2", 0, "keyframe", "anim_PrepPipet")
    animate("#view", 2000, zoom, [25, 46, 9.5, 1000])
  },

  "setDyeVolume": function() {
    state["volume"] = $("#volumeInput").val();
  },

  "setDyeVolumePost": function() {
    updateScore(10);
    animate("#volumeButton,#volumeInput", 1, "addClass", "opClass");
    animate("#view", 0, zoom, [25, 46, 1, 1000])

  }, //step 21

  "openDye": function(evt) {
    animate("#loadDye", 0, "keyframe", "anim_moveLoadingDye")
    animate("#loadDye svg .Cap", 0, "animate", rotateObj)
    animate("#svgfluid", 0, "animate", [{
      "y": 100
    }])

  }, //step 19
  "openDyePost": function() {
  },
  "takeDye": function(evt) {
    var tippNum = betterParseInt(evt.target.id);
    var tippLeft = tips[(tippNum - 1)];
    // in event
    makePipetteTippAnimation(tippLeft);
    animate("#micropipet2", 0, "keyframe", "anim_addTipp1")
    animate("#" + evt.target.id, 0, "keyframe", "anim_hideTipp1")
    animate("#pipetteTip1", 700, "removeClass", "opClass")
    $("#holder").css('z-index', '3');
  }, //step 20

  "openTube1": function(evt) {
    helperFunctions.openTube(evt)
    animate("#svgfluid", 10, "animate", [{
      "y": 50
    }])
  }, //step 22
  "addDye": function() {
    animate("#micropipet2", 0, "keyframe", "anim_addDyeToTube")
    animate("#loadDye svg .Cap", 700, "animate", reverseRotateObj)
    animate("#loadDye", 1000, "keyframe", "anim_moveLoadingDyeback")
    $("#s0Tube").css("z-index", "5")

  }, //step 23
  "mixContents1": function() {
    helperFunctions.mixContents()
  },
  "mixContents1Post": function() {
    helperFunctions.mixContentsPost()
  }, //step 24
  "replaceTip1": function() {
    helperFunctions.replaceTip()
  }, //step 25
  "closeTube1": function(evt) {
    helperFunctions.closeTube(evt)
  }, //step 26
  "flickTube1": function(evt) {
    helperFunctions.flickTube(evt)
  }, //step 27
  "tapTube1": function() {
    helperFunctions.tapTube()
  }, //step 28
  "tubeRack1": function() {
    animate("#s0Tube", 0, "keyframe", "anim_tubeDown")
    for (i = 0; i <= 5; i++) {
      animate("#s" + i + "Tube", 1000, "keyframe", "anim_tube" + i + "ToBath");
    }
    animate("#tubeBlock", 1000, "keyframe", "anim_moveBlock");
    state["microtubeState"][0] = microTubeEnum[5];
  }, //step 29
  "openTubes": function(evt) {
    var tubeId = evt.currentTarget.id.charAt(1);
    if (testMode) {
      for (i = 0; i <= 5; i++) {
        animate("#s"+i+"Tube svg .Cap", 0, "animate", rotateObj)
      }
    }
    animate("#s"+tubeId+"Tube svg .Cap", 0, "animate", rotateObj)
    state["microtubeState"][tubeId] = microTubeEnum[6]
  }, //step 29

  "removeComb": function() {
    animate("#gelComb", 0, "keyframe", "anim_removeComb")
    animate("#gelComb", 1000, "addClass", "opClass")
  }, //step 30

  "toTop": function() {
    animate("#day2, #day2 *", 0, "addClass", "opClass");
    animate("#day1", 0, "addClass", "opClass");
    animate("#bothDays, #bothDays *", 0, "addClass", "opClass");
    animate("#topView, #topView *", 0, "removeClass", "opClass");
    animate("#sideView, #gelFinalTop, #gelVoltageCover, #micropipetTopView, #stainingTray, #zoomOutButton2, #lidBox", 0, "addClass", "opClass")
    animate(".bands, .laneFill", 0, "addClass", "opClass");
    $("#sideView").append($('#pipetteTip1'));

  }, //step 31
  "orientGel": function() {
    animate("#arrowDown,#arrowUp", 0, "addClass", "opClass")
    animate("#micropipetTopView, #gelFinalTop", 0, "removeClass", "opClass")

  }, //step 32, 37, 42
  "addTipTop": function(evt) {
    // if (evt.currentTarget.classList.contains("st3") == false) {
    //   console.log(selector.classList)
    // }
    var totalRows = 8;
    var totalCols = 16;

    var tip = state["tipTray"].indexOf(0)
    console.log(tip)
    var nextColumn = tip % tipTrayCols
    var nextRow = Math.floor(tip / tipTrayCols);
    var nextSelector = "tip" + nextColumn + "_" + nextRow
    if (testMode) {
      var [column, row] = [nextColumn, nextRow]
      var currentSelector = nextSelector
    } else {
      var currentSelector = evt.currentTarget.id;
      var [column, row] = currentSelector.split("tip")[1].split("_")
    }

    var selectorTip = "#" + currentSelector + " ellipse,#" + currentSelector + " circle";
    while ($(selectorTip).hasClass("st3")) {
      selectorTip = "#" + nextSelector + " ellipse,#" + nextSelector + " circle";
      [column, row] = [nextColumn, nextRow]
      nextColumn++
      nextSelector = "tip" + nextColumn + "_" + nextRow
    }


    animate(selectorTip, 500, "attr", ["class", "st3"])
    console.log(selectorTip)
    var topMost = 56.6,
      leftMost = 31.2,
      rowHeight = 1.1,
      colWidth = .78
    var microPipetTopViewLeft = leftMost + (colWidth * column)
    var microPipetTopViewTop = topMost + (rowHeight * row)
    animate("#micropipetTopView", 0, "animate", [{ //TopMost left:31.2%, 56.6% left= +=.78%,, top= +=1.1%
      "left": microPipetTopViewLeft + '%',
      "top": microPipetTopViewTop + '%'
    }]);
    state["tipTray"][column + (row * tipTrayRows)] = 1;;
    console.log(column+(row * tipTrayRows))
  }, //step 33

  "takeMicTube": function(evt) {
    state["tubePicked"] = parseInt(evt.currentTarget.id.split("_")[1]);
  }, //step 34
  "takeMicTubePost": function() {
    var tubePickedIndex = state["tubePicked"]
    var tubeTopPosition = 17.5
    var tubeTopAdd = 4.5
    var tubeTop = tubeTopPosition + tubeTopAdd * tubePickedIndex

    animate("#micropipetTopView", 0, "animate", [{
      "left": '36.7%',
      "top": tubeTop + '%'
    }]);
    animate("html", 1000, zoom, [10, 74, 6, 1000])
  }, //step 34

  "toLane": function(evt) {
    state["lanePicked"] = parseInt(evt.currentTarget.id.split("_")[1]);
  },
  "toLanePost": function() {
    var laneIndex = state["lanePicked"]
    var laneLeftPosition = 10.3
    var laneLeftAdd = 1.4
    var laneLeft = laneLeftPosition + laneLeftAdd * laneIndex
    animate("#micropipetTopView", 0, "animate", [{
      "left": laneLeft + '%', //+=1.4%
      "top": '71.6%',
    }]);

    animate("html", 1000, zoom, [10, 74, 1, 500]) //zoomout
    animate(".side", 1200, "removeClass", "opClass")
    animate("#pipetteTip1 *, #pipetteTip1", 0, "removeClass", "opClass")
    animate("#pipetteTip1", 0, "css", [{
      "width": "15%",
      "height": "121%",
      "left": "42%",
      "top": "-80%",
      "z-index": 100
    }])
    animate("#svgfluid", 0, "animate", [{
      y: "40"
    }])
    $('#pipetteTip1').draggable({
      disabled: false,
      revert: true
    });


  }, //step 35,40
  "insertTip": function(evt) {
    var sideViewWidth = parseFloat($('#sideView').css("width"));
    var sideViewHeight = parseFloat($('#sideView').css("height"));
    var currentBot = parseFloat($('#pipetteTip1').css("bottom")) / sideViewHeight * 100;
    var currentLeft = parseFloat($('#pipetteTip1').css("left")) / sideViewWidth * 100;
    state["TipPosition"] = false
    // console.log(currentBot, currentLeft)
    if (currentBot < 53.5) {
      if (currentBot < 12 || currentLeft > 67.8 || currentLeft < 19.5) {
        message("Make sure the tip is not breaching the wall!")
      } else if (currentBot > 40) {
        message("Make sure the tip stays deep enough within the well!")
      } else if (currentBot < 15) {

        message("Your tip is going too deep into the well. Don't risk it to breach the wall!")
      } else {
        state["TipPosition"] = true
        $('#pipetteTip1').draggable({
          disabled: true,
          revert: false
        });
      }
      if (state["TipPosition"] == false) {
        $('#pipetteTip1').css("top", "-80%")
        $('#pipetteTip1').css("left", "42%")
      }
    }
  }, //step 36

  "insertTipPost": function() {
    animate("#svgfluid", 0, "animate", [{
      y: "100"
    }])
    animate("#gelWellBoundary", 400, "css", [{
      "background-image": "radial-gradient(blue, #5555ff, #5555ff)"
    }])

    animate(".side", 3000, "addClass", "opClass")
    animate("#gelWellBoundary", 3400, "css", [{
      "background-image": "radial-gradient(rgba(59,128,194,.86), rgba(59,128,194,.86), rgba(59,128,194,.86))"
    }])
    var well = state["wellPosition"].indexOf(0)
    console.log(well)
    var currentWell = "#well_" + well
    animate(currentWell, 0, "css", [{
      "fill": "#5555ff"
    }])
    state["wellPosition"][well] = 1;
    // setTimeout(function () {
    //     $('#pipetteTip1').css("top", "-80%")
    //     $('#pipetteTip1').css("left", "42%")
    // }, 5000)
  },

  "disposeTip": function() {
    animate("#micropipetTopView", 0, "animate", [{
      "left": '35%',
      "top": '76%'
    }]);
  }, //step 72

//To Day3

  "clickLid": function() {
    animate("#lidSide, #micropipetTopView", 0, "addClass", "opClass")
    animate("#lidBox", 0, "removeClass", "opClass")
    animate(".gelVoltage", 1000, "removeClass", "opClass")
    animate("#gelVoltageCover, #voltage", 1000, "removeClass", "opClass")
    animate("#tipBoxTop, #wasteBinTop", 0, "addClass", "opClass")
  }, //step 73
  "setVoltage": function(evt) {
    console.log("fds")
    state["voltage"] = $("#voltage").val()

  },
  "setVoltagePost": function() {
    animate("#gelVoltageCover", 1000, "addClass", "opClass")
    animate("#stainingTray", 0, "removeClass", "opClass")

  }, //step 74
  "removeGelLid": function() {
    animate("#lidBox", 0, "addClass", "opClass")
    animate("#lidSide", 0, "removeClass", "opClass")

  }, //step 75
  "removeGel": function() {
    animate("#gelFinalTop", 0, "animate", [{
      top: '73.5%',
      left: '30.1%',
    }])

  }, //step 76
  "nudgeGel": function() {
    animate("#day1, #bothDays, #bothDays *, #day1 *", 2000, "attr", ["style", ""])
    animate("#gelFinalTop", 0, "animate", [{
      top: '58.5%',
      left: '30.6%',
    }])
    animate("#topView, #topView *", 2000, "addClass", "opClass")
    animate("#graduatedCylinder, #stainingTraySide", 2000, "removeClass", "opClass")
    animate("#waterBathNoLid, #waterBathLid, #gelComb, #wasteBasket, #shelf1, #loadDyeCap", 2000, "addClass", "opClass")
    animate("#bothDays, #day2, .day3, .day3 *, .microTube, .microTube *, #graduatedCylinder, #stainingTraySide", 2000, "removeClass", "opClass")
    animate("#stainedGel", 2000, "css", [{
      opacity: 0 //left it with opacity, because of slowFadeIn animation
    }])

  }, //step 77
  "stainGel": function() {
    animate("#graduatedCylinder", 0, "keyframe", "anim_pourStain")
    animate("#svgcylfluid", 1000, "animate", [{
      "y": -270
    }])

    animate(".bands, .laneFill", 0, "removeClass", "opClass");
    animate("#stainedGel", 600, "keyframe", "anim_slowFadeIn")
    animate("#graduatedCylinder", 2000, "keyframe", "anim_pourStainRev")
  }, //step 78
  "examineGel": function() {
    var contents = $("#gelFinalTop").contents();
    $("#gelFinalTop").empty();
    $("#gel").append(contents);
    loadSVGLogic();
    animate("#gel, #gel *", 0, "removeClass", "opClass")

    $("#gel, #gel *").css({
      opacity: 1.0,
      visibility: "visible",
      display: "block"
    }).animate({
      opacity: 1
    }, 200)

  }, //step 79
  "pickLane": function(evt) {
    var studentAnswer = evt.currentTarget.id.split("_")[1];
    console.log(evt.currentTarget.id);
    console.log(answer);
    console.log($("svg [type = 'text/css']")[1])
    state["lanePickedNumber"] = studentAnswer
  },
  "pickLanePost": function() {
    animate("#day1, #day1 *, #bothDays, #bothDays *", 0, "removeClass", "opClass")
    animate("#day2, #day2 *, #timer, #timerButton, #volumeInput, #volumeButton", 0, "addClass", "opClass")
  }

}
