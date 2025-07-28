// Clicky stuff here
var isAdminVar;

var isDragging = false;

var controlsOn = true;

var hintsOn = false;

var targetArrow = {
startX: 0,
	startY: 0,
	isActive: false,
	origin: "none"
};

$(function () {
		// Resize window on page load to ensure proper sizing of elements
setTimeout(()=>resizeWindow(),1000);

		// Create event listeners for menu button clicks
		$("#endOption1").on( "click",function () {
				// When menu button 1 is clicked
				// console.log("Clicked button 1");
				props = {
				"mode": 1
				}
				newGame(props);
				});
		$("#endOption2").on( "click",function () {
				// When menu button 2 is clicked
				// console.log("Clicked button 2");
				if (studentData.unlocks[0] || UNLOCK_EVERYTHING) {
				props = {
				"mode": 2
				}
				newGame(props);
				}
				});
		$("#endOption3").on( "click",function () {
				// When menu button 3 is clicked
				// console.log("Clicked button 3");
				if (studentData.unlocks[1] || UNLOCK_EVERYTHING) {
				props = {
				"mode": 3
				}
				newGame(props);
				}
				});

		$("body").on( "click",function () {

				});

		$("#dataReport").on( "click",function () {
				if (isAdmin(netID)) {
				$.ajax({
url: "info_allScores.php",
dataType: "json"
}).done(function (data) {
	exportScoreCSV(data);
	exportDataCSV(data);
	}).fail(function () {

		});
				}
				});

// Leaderboard link button
$("#viewLeaderboardSelected").on( "click",function () {
		window.open("https://apps.tlt.stonybrook.edu/bio/leaderboard", "_self");
		});

$("#helpButton").on( "click",function () {

		});

$("#returnButton").on( "click",function () {
		if (game.props.mode == 1 && controlsOn) {
		endGame("win");
		} else if (game.props.mode == 3 && controlsOn) {
		//console.log(puzzleSelected);
		if (puzzleSelected != -1) {
		//console.log("return to puzzle select");
		puzzleSelected = -1;
		resetTubes();
		showPuzzleBox();
		setPuzzleModeText();
		} else {
		//console.log("return to menu");
		endGame("win");
		}
		}
		});

$(document).keydown(function (objEvent) {
		if (objEvent.keyCode == 9) { //tab pressed
		objEvent.preventDefault(); // stops its action
		}
		});

$.ajax({
url: "info.php",
dataType: "json"
}).done(function (data) {
	console.log("md");
	netID = data.name;
	firstName = data.firstname;
	getStudentData = data.studentData;
	userNetID = data.name;
	isAdminVar = data.isAdmin;
	// Special Case

	// TODO: data collection
	if (Object.keys(getStudentData).length == 0) {
	// New file
	newStudentData(netID);
	postData();
	continueLoading();
	} else {
	//console.log(data);
	studentData = getStudentData;
	stats = data.stats;
	getAllData();
	}
}).fail(function () {
	UNLOCK_EVERYTHING = true;
	newStudentData();
	continueLoading();
	});
});

function continueLoading() {
	for (var i = 1; i <= 3; i++) {
		initEndOptionHover(i);
	}
	$("#challengeButton").on( "click",function () {
			if (showingChallenges) {
			hideChallengeScreen();
			} else {
			showChallengeScreen();
			}
			});
	//console.log(stats);
	// Prep challenges
	prepChallenges();

	$(".cellSelected").hover(function (e) {
			// Mouse over cell
			var id = betterParseInt($(e.target).attr('id'));
			if ($(e.target).attr('id') == "viewLeaderboardSelected") {
			id = 100;
			}
			setCurrentChallenge(id);
			$("#currentChallenge").css({
					"opacity": 1
					});
			if (id != 100) {
			// Mark challenge as not new
			challenges.getChallenge(id).setAsNew(false);
			}

			}, function () {
			// Leave cell
			$("#currentChallenge").css({
					"opacity": 0
					});
			});
	initCentrifuge();
	// Pick up a tube
	$("#tube_icon").mousedown(function () {
			if (controlsOn) {
			targetArrow.origin = -1;
			if (tubesLeft > 0) {
			//console.log("pick up");
			isDragging = true;
			tubesLeft--;
			} else if (totalTubes == -1) {
			//console.log("pick up");
			isDragging = true;
			}
			updateTubeDisplay();
			}
			});

	// Pick up a tube
	$(".centrifuge_well_cover").mousedown(function (event) {
			if (controlsOn) {
			var id = betterParseInt(event.target.getAttribute("id"));
			targetArrow.origin = id;
			if (wellStates[id] && !lockedWells[id]) {
			//console.log("pick up " + id);
			isDragging = true;
			wellStates[id] = false;
			}
			updateTubeDisplay();
			}
			});

	$(".centrifuge_well_cover").on( "dblclick",function (event) {
			if (controlsOn && !(game.props.mode == 3 && puzzleSelected == -1)) {
			var id = betterParseInt(event.target.getAttribute("id"));
			if (!wellStates[id] && !bannedWells[id]) {
			if (tubesLeft > 0) {
			//console.log("added " + id);
			tubesLeft--;
			wellStates[id] = true;
			} else if (totalTubes == -1) {
			//console.log("added " + id);
			wellStates[id] = true;
			}
			}
			updateTubeDisplay();
			}
			});

	$(".centrifuge_well_cover").mouseenter(function () {
			if (controlsOn && hintsOn) {
			var id = betterParseInt(event.target.getAttribute("id"));
			//console.log(id);
			showHint(id);
			}
			});
	$(".centrifuge_well_cover").mouseleave(function () {
			hideHints();
			});

	// Drop tube
	$(window).mouseup(function (event) {
			if (controlsOn) {
			if (isDragging) {
			isDragging = false;
			if (event.target.getAttribute("class") != null) {
			if (event.target.getAttribute("class").split(" ")[0] == "centrifuge_well_cover") {
			var id = betterParseInt(event.target.getAttribute("id"));
			if (wellStates[id] == false && !bannedWells[id]) {
			//console.log("drop " + id);
			wellStates[id] = true;
			} else {
			//console.log("already full");
			if (totalTubes > 0)
			tubesLeft++;
			}
			} else {
			//console.log("dropped out");
			if (totalTubes > 0)
			tubesLeft++;
			}
			} else {
				//console.log("dropped out");
				if (totalTubes > 0)
					tubesLeft++;
			}
			}
			updateTubeDisplay();
			}
	});
	$(window).mousemove(function (event) {
			if (controlsOn) {
			var imgSize = .05 * stageHeight;
			if (isDragging) {
			$("#mousedrag").css('opacity', 1);
			} else {
			$("#mousedrag").css('opacity', 0);
			}
			$("#mousedrag").css({
					'left': (event.pageX - imgSize / 2) + "px",
					'top': (event.pageY - imgSize / 2) + "px",
					'width': imgSize + "px",
					'height': imgSize + "px"
					});
			}
			});
	$("#start_button").on( "click",function () {
			if (controlsOn) {
			if (spinIntervalID == -1) {
			if (game.props.mode == 1) {
			// Practice mode: must use all of the tubes
			if (tubesLeft == 0) {
			// Spin!
			spinCentrifuge();
			} else {
			// Can't spin yet
			}
			} else if (game.props.mode >= 2) {
			// Other modes: infinite tubes (can always spin)
			spinCentrifuge();
			}
			}
			}
			});
	$("#reset_button").on( "click",function () {
			if (controlsOn) {
			resetTubes();
			if (game.props.mode == 3) {
			loadPuzzle(puzzleSelected);
			}
			}
			});
	$("body").keypress(function (event) {
			if (event.which == 115) {
			// cheater!
			// solveCurrentPuzzle();
			}
			});
	initTargetArrow();
	updateTubeDisplay();
	loadStartMenu();
}

function initTargetArrow() {
	$("body").mousedown(function (event) {
			if (!targetArrow.isActive) {
			// Starting the click/drag
			targetArrow.isActive = true;
			targetArrow.startX = event.pageX - stageLeft;
			targetArrow.startY = event.pageY - stageTop;
			}
			});
	$(window).mousemove(function (event) {
			if (targetArrow.isActive && isDragging) {
			// Snap to origin
			if (targetArrow.origin == -1) {
			targetArrow.startX = $("#tube_icon").offset().left + $("#tube_icon").width() / 2 - stageLeft;
			targetArrow.startY = $("#tube_icon").offset().top + $("#tube_icon").height() / 2 - stageTop;
			}
			else if (0 <= targetArrow.origin && targetArrow.origin < 24) {
			targetArrow.startX = $("#centrifuge_well" + targetArrow.origin).offset().left + $("#centrifuge_well" + targetArrow.origin).width() / 2 - stageLeft;
			targetArrow.startY = $("#centrifuge_well" + targetArrow.origin).offset().top + $("#centrifuge_well" + targetArrow.origin).height() / 2 - stageTop;
			}
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
	$(window).mouseup(function (event) {
			if (targetArrow.isActive) {
			targetArrow.isActive = false;
			targetArrow.startX = 0;
			targetArrow.startY = 0;
			$(".targetArrow").css({
					'opacity': 0
					});
			}
			});
}

function exportScoreCSV(data) {
	// Create the CSV file
	var out = '"NetID","Practice: Fewest questions","Challenge: Highest score","Challenge+: Highest score"\n';
	for (var i = 0; i < data.length; i++) {

		var sd = data[i].studentData;
		if(sd){
			var str = sd.netID + "," + sd.highScores[0] + "," + sd.highScores[1] + "," + sd.highScores[2] + "\n";
			out += str;
		}
		else{
			console.log(data[i])
		}
	}
	out = "data:text/csv;charset=utf-8," + out;
	// Make a file
	output = encodeURI(out);
	// Download file
	link = document.createElement('a');
	link.setAttribute('href', output);
	link.setAttribute('download', "centrifuge.csv");
	link.trigger( "click" );
}

function initCentrifuge() {
	for (var i = 0; i < 24; i++) {
		$("#centrifuge_wells").append("<div id='centrifuge_well" + i + "' class='centrifuge_well'></div>");
		$("#centrifuge_well" + i).append("<div id='centrifuge_well_number" + i + "' class='centrifuge_well_number text fs-30'>" + (i + 1) + "</div>");
		$("#centrifuge_well" + i).append("<div id='centrifuge_well_marker" + i + "' class='centrifuge_well_marker'></div>");
		$("#centrifuge_well" + i).append("<div id='centrifuge_well_cover" + i + "' class='centrifuge_well_cover'></div>");
		$("#centrifuge_well" + i).append("<div id='centrifuge_well_hint" + i + "' class='centrifuge_well_hint'></div>");
		$("#centrifuge_explode").append("<div id='centrifuge_explode_tube" + i + "' class='centrifuge_explode_tube'></div>")
			var r = 33;
		var c = 45.5;
		var x = r * Math.cos(i * Math.PI / 12) + c;
		var y = r * Math.sin(i * Math.PI / 12) + c;
		$("#centrifuge_well" + i).css({
				'left': x + "%",
				'top': y + "%"
				});
		resetExplodeTubePosition(i);
	}
	for (var i = 0; i < stats.practiceWinDetails.length; i++) {
		$("#box_left1").append("<div id='tube_count_button" + i + "' class='tube_count_button'></div>");
		$("#tube_count_button" + i).append("<div id='tube_count_button_number" + i + "' class='tube_count_button_number text fs-30'>" + (i + 2) + "</div>");
		var pos = getNumberButtonCoords(i);
		$("#tube_count_button" + i).css({
				'left': pos.x + "%",
				'top': pos.y + "%"
				});
		initNumberButton(i);
	}
	for (var i = 0; i < 4; i++) {
		$("#box_right2").append("<div id='puzzleSetBox" + i + "' class='puzzleSetBox'></div>");
		$("#puzzleSetBox" + i).css("top", (10 + 20 * i) + "%");
		$("#puzzleSetBox" + i).append("<div id='puzzleSetBoxText" + i + "' class='puzzleSetBoxText text fs-50'>0" + (i + 1) + "</div>");
		$("#puzzleSetBox" + i).append("<div id='puzzleSetBoxLock" + i + "' class='puzzleSetBoxLock text fs-28'></div>");
		initPuzzleSetUnlockHandler(i);
	}
	for (var i = 0; i < 12; i++) {
		var x = i % 3;
		var y = Math.floor(i / 3);
		$("#box_right2").append("<div id='puzzleButton" + i + "' class='puzzleButton'></div>");
		$("#puzzleButton" + i).append("<div id='puzzleButtonNumber" + i + "' class='puzzleButtonNumber text fs-24'>" + (y + 1) + "-" + (x + 1) + "</div>");
		var pos = getPuzzleButtonCoords(i);
		$("#puzzleButton" + i).css({
				'left': pos.x + "%",
				'top': pos.y + "%"
				});
		initPuzzleButton(i);
	}
	resizeWindow();
}

function resetExplodeTubePosition(i) {
	var r = 42;
	var cx = 45;
	var cy = 40.5;
	var x = r * Math.cos(i * Math.PI / 12) + cx;
	var y = r * Math.sin(i * Math.PI / 12) + cy;
	$("#centrifuge_explode_tube" + i).css({
			'left': x + "%",
			'top': y + "%",
			'transform': "rotate(" + 15 * (i + 6 % 24) + "deg)"
			});
}

function explodeTubes() {
	// Animate radius from 42 to 140.
	for (var i = 0; i < 24; i++) {
		if (wellStates[i]) {
			resetExplodeTubePosition(i);
			var r = 140;
			var cx = 45;
			var cy = 40.5;
			var x = r * Math.cos(i * Math.PI / 12) + cx;
			var y = r * Math.sin(i * Math.PI / 12) + cy;
			$("#centrifuge_explode_tube" + i).css({
					'opacity': 1
					});
			$("#centrifuge_explode_tube" + i).animate({
					'left': x + "%",
					'top': y + "%"
					}, 150);
			setTimeout(function (id) {
					$("#centrifuge_explode_tube" + id).css({
							'opacity': 0
							});
					}, 250, i);
		}
	}
}

function initNumberButton(i) {
	$("#tube_count_button" + i).on( "click",function () {
			if (controlsOn) {
			totalTubes = i + 2;
			resetTubes();
			}
			});
}

function initPuzzleButton(i) {
	$("#puzzleButton" + i).on( "click",function () {
			if (controlsOn) {
			loadPuzzle(i);
			}
			});
}

function showHint(id) {
	$(".centrifuge_well_hint").css("opacity", 0);
	var show = [0, 8, 12, 16];
	for (var i = 0; i < 4; i++) {
		$("#centrifuge_well_hint" + ((id + show[i]) % 24)).css("opacity", 1);
	}
}

function hideHints() {
	$(".centrifuge_well_hint").css("opacity", 0);
}

function initPuzzleSetUnlockHandler(i) {
	$("#puzzleSetBox" + i).on( "click",function () {
			//unlockPuzzleSet(i);
			});
}

function unlockPuzzleSet(i, t) {
	setTimeout(function () {
			if (!stats.puzzleUnlocks[i]) {
			console.log("ffd");
			stats.puzzleUnlocks[i] = true;
			$("#puzzleSetBox" + i).addClass("anim_puzzleSetUnlock");
			postData();
			}
			}, t);
}

function exportDataCSV(data) {
		var out = "NetID,"
		for (i=0;i<=20;i++)
		{
			out+=`Tube ${i+2} win,tries,time,`
		}
		out+='\n';
	// Get maximum number of questions from the user data
	for (var i = 0; i < data.length; i++) {
		var sd = data[i].stats
		if(sd && sd.practiceWinDetails){
		var practiceWinDetails= sd.practiceWinDetails||new Array(21).fill(false);
		var practiceTryCount= sd.practiceTryCount||new Array(21).fill(0);
		var practiceWinTimes= sd.practiceWinTimes||new Array(21).fill(false);

		out+=`${data[i].studentData.netID},`;
		for (var j = 0; j < practiceWinDetails.length; j++){
			var time=0;
			if (practiceWinTimes[j]) {
			time=	new Date(practiceWinTimes[j]).toString()
			}
		out+=`${practiceWinDetails[j]},${practiceTryCount[j]},${time},`
	}
			out+='\n';
	}

	// Create the CSV file
	// Constant part of header (not questions)
}

	out = "data:text/csv;charset=utf-8," + out;
	// Make a file
	output = encodeURI(out);
	// Download file
	link = document.createElement('a');
	link.setAttribute('href', output);
	link.setAttribute('download', "AllData.csv");
	link.trigger( "click" );;

}
function newStudentData(netID) {
	// New student data object
	studentData = {
		"netID": netID,
		"gameRecord": [],
		"highScores": [0, 0, 0],
		"unlocks": [false, false, false]
	};
}

function showHUD() {
	$("#hudBottom").removeClass("anim_hudBottomOut");
	$("#hudTop").removeClass("anim_hudTopOut");
	$("#hudBottom").addClass("anim_hudBottomIn");
	$("#hudTop").addClass("anim_hudTopIn");
	if (game.props.mode == 1) {
		$("#hintBox").removeClass("anim_exitHintBox");
		$("#hintBox").addClass("anim_enterHintBox");
	}
}

function hideHUD() {
	$("#hudBottom").removeClass("anim_hudBottomIn");
	$("#hudTop").removeClass("anim_hudTopIn");
	$("#hudBottom").addClass("anim_hudBottomOut");
	$("#hudTop").addClass("anim_hudTopOut");
	if (game.props.mode == 1) {
		$("#hintBox").removeClass("anim_enterHintBox");
		$("#hintBox").addClass("anim_exitHintBox");
	}
}

/*
   Post data to the server!
   ALL HAIL KING SERVER
   */
function postData() {
	var str = JSON.stringify(studentData);
	var str2 = JSON.stringify(stats);
	$.ajax({
type: "POST",
url: "writer.php",
data: {
'studentData': str,
'stats': str2
}
}).done(function (msg) {
	alert("Data Saved");
	}).fail(function () {
		//alert("There was an error with the server :(");
		});
}

function isAdmin(name) {
	/*   if (name == "japalmeri" || name == "moneal") {
	     return true;
	     }
	     */
	return isAdminVar;
}

function initEndOptionHover(id) {
	$("#endOption" + id).hover(function () {
			// Mouse over cell
			$("#endOptionDesc" + id).removeClass("anim_exitEndOptionDesc");
			$("#endOptionDesc" + id).addClass("anim_enterEndOptionDesc");

			}, function () {
			// Leave cell
			$("#endOptionDesc" + id).removeClass("anim_enterEndOptionDesc");
			$("#endOptionDesc" + id).addClass("anim_exitEndOptionDesc");
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
}).done(function (data) {
	allData = data;
	continueLoading();
	}).fail(function () {

		});
}
