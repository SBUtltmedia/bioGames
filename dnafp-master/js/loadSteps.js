function loadSteps() {

    var stepText = [
        {
            "id": "group1"
            , "shortText": "Transfer the enzyme mix"
            , "steps": [
                {
                    "id": "liftEnzyme"
                    , "shortText": "Enzyme mix"
                    , "longText": "Remove the tube containing enzyme mix from the ice"
                    , "bottomText": "Hover over the tube containing the enzyme mix"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": "#enzTube"
                        , "eventType": "mouseenter"
                        , "eventFunction": helperFunctions.liftEnzyme
                        , "postEventFunction": helperFunctions.liftEnzymePost
                    }
                }

                , {
                    "id": "openEnzyme"
                    , "shortText": "Open enzyme mix"
                    , "longText": "Open the enzyme mix"
                    , "bottomText": "Click on the tube containing the enzyme mix to open it"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": "#enzTube"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.openEnzyme
                        , "postEventFunction": helperFunctions.openEnzymePost
                    }
                }

                , {
                   "id": "setVolume"
                   , "shortText": "Enter volume"
                   , "longText": "Set the volume for the micropipette to 10µl"
                   , "bottomText": "Enter the correct volume (in µl) of fluid to remove"
                   , "feedbackText": "complete the second step"
                   , "logic": {
                       "eventSelector": "#volumeInputForm"
                       , "eventType": "submit"
                       , "eventFunction": helperFunctions.setVolume
                       , "postEventFunction": helperFunctions.setVolumePost
                       , "criteria": {
                           "variable": "volume"
                           , "value": 10
                           , "messageWrong": "Incorrect, please enter the approriate volume!"
                       }
                   }
               }

                , {
                    "id": "takeEnzyme"
                    , "shortText": "Use micropipette"
                    , "longText": "Add a tip to the micropipette"
                    , "bottomText": "Click on any tip to place it on the micropipette"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": ".tip"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.takeEnzyme
                    }
                }

                , {
                    "id": "openTube"
                    , "shortText": "Open reaction tube"
                    , "longText": "Open the crime scene DNA reaction tube (green tube)"
                    , "bottomText": "Click on the green reaction tube to open it"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#s0Tube"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.openTube
                        , "criteria": {
                            "variable": "microtubeState"
                            , "value": [microTubeEnum[1], microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0]]
                        }
                    }
                }
                , {
                    "id": "addEnzyme"
                        //                    , "shortText": "Add enzyme mix"
                        //                    , "longText": "Click on the micropipette to add the enzyme mix to the reaction tube"

                    , "shortText": "Add enzyme mix"
                    , "longText": "Pipet 10 µl of enzyme mix into the very bottom of the tube"
                    , "bottomText": "Click on the micropipette to take up the enzyme mix"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#micropipet2"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.addEnzyme
                    }
                }
                , {
                    "id": "mixContents"
                    , "shortText": "Mix the Contents"
                    , "longText": "Pipet up and down carefully to mix well"
                    , "bottomText": "Click on the micropipette to mix the contents"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#micropipet2"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.mixContents
                        , "postEventFunction": helperFunctions.mixContentsPost
                    }
                }
                , {
                    "id": "replaceTip"
                    , "shortText": "Replace tip"
                    , "longText": "Discard the tip and return the micropipette to the rack"
                    , "bottomText": "Click on the waste bin to eject the tip"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#wasteBasket"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.replaceTip
                    }
                }
                ]
        }
        , {
            "id": "group2"
            , "shortText": "Consolidate contents"
            , "steps": [
                {
                    "id": "closeTube"
                    , "shortText": "Close tube cap"
                    , "longText": "Close the crime scene DNA reaction tube cap"
                    , "bottomText": "Click on the green reaction tube to close the cap"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": "#s0Tube"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.closeTube
                        , "criteria": {
                            "variable": "microtubeState"
                            ,  "value": [microTubeEnum[2], microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0]]
                        }
                    }
                }
                , {
                    "id": "flickTube"
                    , "shortText": "Gently flick tube"
                    , "longText": "Gently flick the tube"
                    , "bottomText": "Click on the tube to gently flick it"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": "#s0Tube"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.flickTube
                        , "criteria": {
                            "variable": "microtubeState"
                            , "value": [microTubeEnum[3], microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0]]
                        }
                    }
                }
                , {
                    "id": "tapTube"
                    , "shortText": "Tap tube on lab bench"
                    , "longText": "Tap the tube on the lab bench, ensuring all contents are at the bottom"
                    , "bottomText": "Click on the tube to tap it on the lab bench"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#s0Tube"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.tapTube
                        //, "postEventFunction": helperFunctions.afterTapTube
                        , "criteria": {
                            "variable": "microtubeState"
                            , "value": [microTubeEnum[4], microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0]]
                        }
                    }
                }
            ]
        }, {
            "id": "group3"
            , "shortText": "Incubate the samples"
            , "steps": [
                {
                    "id": "tubeRack"
                    , "shortText": "Tubes in floating rack"
                    , "longText": "Place the tubes back in the floating rack"
                    , "bottomText": "Click on the tube to return it back to the rack"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": "#s0Tube"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.tubeRack
                        , "postEventFunction": helperFunctions.tubeRackPost
                        , "criteria": {
                            "variable": "microtubeState"
                            ,  "value": [microTubeEnum[5], microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0]]
                        }
                    }
                }
                , {
                    "id": "pressTube"
                    , "shortText": "Expose tube bottoms"
                    , "longText": "Press each tube down to expose bottoms to the water"
                    , "bottomText": "Click on each tube to press it down"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": ".microTube"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.pressTube
                        , "postEventFunction": helperFunctions.pressTubePost
                        , "criteria": {
                            "variable": "microtubeState"
                            , "value": [microTubeEnum[6],microTubeEnum[6],microTubeEnum[6],microTubeEnum[6],microTubeEnum[6],microTubeEnum[6]]
                        }
                    }
                }
                , {
                    "id": "removeLid"
                    , "shortText": "Remove lid"
                    , "longText": "Remove the water bath lid"
                    , "bottomText": "Click on the water bath lid to remove it"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#waterBathLid"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.removeLid
                    }
                }, {
                    "id": "checkTemp"
                    , "shortText": "Check temperature"
                    , "longText": "Check if the thermometer is at 37 degrees Celsius"
                    , "bottomText": "Click on the thermometer to check it"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#waterBathNoLid"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.checkTemp
                    }
                }, {
                    "id": "insertRack"
                    , "shortText": "Insert floating rack"
                    , "longText": "Place the floating rack of microtubes in the incubator"
                    , "bottomText": "Click on the floating rack"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#tubeBlock"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.insertRack
                    }
                }, {
                    "id": "closeLid"
                    , "shortText": "Close incubator"
                    , "longText": "Close the lid of the incubator"
                    , "bottomText": "Click on the lid to close the incubator"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#waterBathLid"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.closeLid
                    }
                }, {
                    "id": "setTimer"
                    , "shortText": "Set timer"
                    , "longText": "Incubate the tubes for 45 min at 37°C"
                    , "bottomText": "Enter the time in the timer"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#timerForm"
                        , "eventType": "submit"
                        , "eventFunction": helperFunctions.setTimer
                        , "postEventFunction": helperFunctions.setTimerPost
                        , "criteria": {
                            "variable": "time"
                            , "value": 45
                        }
                    }
                }
            ]
        }, {
            "id": "group4"
            , "shortText": "Add Loading Dye"
            , "steps": [
              {
                    "id": "prepPipet1"
                    , "shortText": "Prepare micropipet"
                    , "longText": "Pick up the micropipette"
                    , "bottomText": "Click to pick up the micropipette"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": "#micropipet2"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.prepPipet1
                    }
              },  {
                    "id": "setDyeVolume"
                    , "shortText": "Enter volume"
                    , "longText": "Set the volume for the micropipette to 5µl"
                    , "bottomText": "Enter the correct volume (in µl) of fluid to remove"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#volumeInputForm"
                        , "eventType": "submit"
                        , "eventFunction": helperFunctions.setDyeVolume
                        , "postEventFunction": helperFunctions.setDyeVolumePost
                        , "criteria": {
                            "variable": "volume"
                            , "value": 5
                            , "messageWrong": "Incorrect, please enter the approriate volume!"
                        }
                      }
                }, {
                    "id": "openDye"
                    , "shortText": "Open loading dye"
                    , "longText": "Open the loading dye"
                    , "bottomText": "Click on the loading dye tube to open it"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": ".loadingDye"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.openDye
                        , "postEventFunction": helperFunctions.openDyePost
                    }
                }
                , {
                    "id": "takeDye"
                    , "shortText": "Use micropipette"
                    , "longText": "Add a tip to the micropipette"
                    , "bottomText": "Click on a tip to add it to the micropipette"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": ".tip"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.takeDye
                    }
                }
                , {
                    "id": "openTube1"
                    , "shortText": "Open reaction tube"
                    , "longText": "Open the crime scene DNA reaction tube (green tube)"
                    , "bottomText": "Click on the crime scene DNA reaction tube (green tube) to open it"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#s0Tube"
                        , "eventType": "click"
                        , "eventFunction":helperFunctions.openTube1
                        , "criteria": {
                            "variable": "microtubeState"
                            ,  "value": [microTubeEnum[1], microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0]]                        }
                    }
                }
                , {
                    "id": "addDye"
                    , "shortText": "Add enzyme mix"
                    , "longText": "Add the loading dye to the crime scene DNA reaction tube (green tube)"
                    , "bottomText": "Click on the micropipette to add the loading dye"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#micropipet2"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.addDye
                    }
                }, {
                    "id": "mixContents1"
                    , "shortText": "Mix the Contents"
                    , "longText": "Pipet up and down carefully to mix well"
                    , "bottomText": "Click on the micropipette to mix the contents"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#micropipet2"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.mixContents1
                        , "postEventFunction": helperFunctions.mixContents1Post
                    }
                }, {
                    "id": "replaceTip1"
                    , "shortText": "Replace tip"
                    , "longText": "Discard the tip and return the micropipette to the rack"
                    , "bottomText": "Click on the waste bin to eject the tip"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#wasteBasket"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.replaceTip1
                    }
                }
                 , {
                    "id": "closeTube1"
                    , "shortText": "Close tube cap"
                    , "longText": "Close the crime scene DNA reaction tube cap"
                    , "bottomText": "Click on the reaction tube to close the cap"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": "#s0Tube"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.closeTube1
                        , "criteria": {
                            "variable": "microtubeState"
                            ,  "value": [microTubeEnum[2], microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0]]
                        }
                    }
                }
                , {
                    "id": "flickTube1"
                    , "shortText": "Gently flick tube"
                    , "longText": "Gently flick the tube"
                    , "bottomText": "Click on the tube to gently flick it"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": "#s0Tube"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.flickTube1
                        , "criteria": {
                            "variable": "microtubeState"
                            ,  "value": [microTubeEnum[3], microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0]]
                        }
                    }
                }
                , {
                    "id": "tapTube1"
                    , "shortText": "Tap tube on lab bench"
                    , "longText": "Tap the tube on the lab bench, ensuring all contents are at the bottom"
                    , "bottomText": "Click on the tube to tap it on the lab bench"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#s0Tube"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.tapTube1
                        , "criteria": {
                            "variable": "microtubeState"
                            ,  "value": [microTubeEnum[4], microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0]]
                        }
                    }
                }
                , {
                    "id": "tubeRack1"
                    , "shortText": "Tubes in floating rack"
                    , "longText": "Place the tubes back in the floating rack"
                    , "bottomText": "Click on the tube to return it to the rack"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": "#s0Tube"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.tubeRack1
                        , "postEventFunction": helperFunctions.tubeRackPost
                        , "criteria": {
                            "variable": "microtubeState"
                            ,  "value": [microTubeEnum[5], microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0],  microTubeEnum[0]]
                        }
                    }
                }
                , {
                    "id": "openTubes"
                    , "shortText": "Open reaction tubes"
                    , "longText": "Open each tube up"
                    , "bottomText": "Click on each tube to open it"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": ".microTube"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.openTubes
                        , "postEventFunction": helperFunctions.pressTubePost
                        , "criteria": {
                            "variable": "microtubeState"
                            , "value": [microTubeEnum[6],microTubeEnum[6],microTubeEnum[6],microTubeEnum[6],microTubeEnum[6],microTubeEnum[6]]
                        }
                    }
                }
            ]
        }, {
            "id": "group5"
            , "shortText": "Prepare gel"
            , "steps": [
                {
                    "id": "removeComb"
                    , "shortText": "Remove Comb"
                    , "longText": "Remove the comb from the gel to expose the wells"
                    , "bottomText": "Click on the gel comb to remove it"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": "#gelCombHitBox"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.removeComb
                    }
                }
                , {
                    "id": "toTop"
                    , "shortText": "Place gel tray"
                    , "longText": "Place the gel tray in the electrophoresis chamber"
                    , "bottomText": "Click on the gel electrophoresis chamber"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": "#gelSideView"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.toTop
                    }
                }
                , {
                    "id": "orientGel"
                    , "shortText": "Orient gel"
                    , "longText": "Properly orient your gel in the electrophoresis chamber"
                    , "bottomText": "Click on one of the arrows to select the direction you'd like the wells to face"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#arrowDown"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.orientGel
                    }
                }
            ]
        }, {
            "id": "group6"
            , "shortText": "Load HindIII into gel"
            , "steps": [
                {
                    "id": "addTipTop1"
                    , "shortText": "Place tip"
                    , "longText": "Add a tip to the micropipette"
                    , "bottomText": "Click on any tip to add it to the micropipette"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": ".tipTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.addTipTop
                    }
                }
                , {
                    "id": "takeHind"
                    , "shortText": "DNA size marker"
                    , "longText": "Remove 10 uL of HindIII DNA size marker (grey tube)"
                    , "bottomText": "Click the HindIII DNA size marker (grey tube) to draw it up"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": ".tubeTopp"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.takeMicTube
                        , "postEventFunction" : helperFunctions.takeMicTubePost
                        , "criteria": {
                            "variable": "tubePicked",
                            "value": 0,
                            "messageWrong": "Incorrect. Please select the correct tube."
                            }
                    }
                }
                , {
                    "id": "toLane1"
                    , "shortText": "Put in Lane 1"
                    , "longText": "Move the micropipette to the correct well"
                    , "bottomText": "Click on the correct well to move the micropipette."
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": ".wells" //"#well_0"
                        , "eventType": "click" //"click"
                        , "eventFunction": helperFunctions.toLane
                        , "postEventFunction" : helperFunctions.toLanePost
                        , "criteria": {
                            "variable": "lanePicked",
                            "value": 0,
                            "messageWrong": "Incorrect. Please select the correct well."
                            }
                    }
                }
                , {
                    "id": "insertTip1"
                    , "shortText": "Insert tip"
                    , "longText": "Place the tip in the well. Be sure not to breach the walls!"
                    , "bottomText": "Drag around the tip to position it"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#gelWell"
                        , "eventType": "drop"
                        , "eventFunction": helperFunctions.insertTip
                        , "postEventFunction": helperFunctions.insertTipPost
                        , "criteria": {
                            "variable": "TipPosition",
                            "value": true
                        }
                    }
                }
                , {
                    "id": "disposeTip1"
                    , "shortText": "Dispose of tip"
                    , "longText": "Dispose of the used tip"
                    , "bottomText": "Click on the waste bin to dispose of the tip"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#wasteBinTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.disposeTip
                    }
                }

            ]
        }, {
            "id": "group7"
            , "shortText": "Load CS DNA into gel"
            , "steps": [
                {
                    "id": "addTipTop2"
                    , "shortText": "Place tip"
                    , "longText": "Add a tip to the micropipette"
                    , "bottomText": "Click on any tip to add it to the micropipette"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": ".tipTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.addTipTop
                    }
                }
                , {
                    "id": "takeCS"
                    , "shortText": "Crime Suspect DNA"
                    , "longText": "Remove 10 uL of crime suspect DNA (green tube)"
                    , "bottomText": "Click the crime suspect (green tube) to draw it up"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": ".tubeTopp"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.takeMicTube
                        , "postEventFunction" : helperFunctions.takeMicTubePost
                        , "criteria": {
                            "variable": "tubePicked",
                            "value": 1,
                            "messageWrong": "Incorrect. Please select the correct tube."
                            }
                    }
                }
                , {
                    "id": "toLane2"
                    , "shortText": "Put in Lane 2"
                    , "longText": "Move the micropipette to the correct well"
                    , "bottomText": "Click on the correct well to move the micropipette."                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": ".wells" //"#well_0"
                        , "eventType": "click" //"click"
                        , "eventFunction": helperFunctions.toLane
                        , "postEventFunction" : helperFunctions.toLanePost
                        , "criteria": {
                            "variable": "lanePicked",
                            "value": 1,
                            "messageWrong": "Incorrect. Please select the correct well."
                            }
                    }
                }
                , {
                    "id": "insertTip2"
                    , "shortText": "Insert tip"
                    , "longText": "Place the tip in the well. Be sure not to breach the walls!"
                    , "bottomText": "Drag around the tip to position it"                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#gelWell"
                        , "eventType": "drop"
                        , "eventFunction": helperFunctions.insertTip
                        , "postEventFunction": helperFunctions.insertTipPost
                        , "criteria": {
                            "variable": "TipPosition",
                            "value": true
                        }
                    }
                }
                , {
                    "id": "disposeTip2"
                    , "shortText": "Dispose of tip"
                    , "longText": "Dispose of the used tip"
                    , "bottomText": "Click on the waste bin to dispose of the tip"                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#wasteBinTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.disposeTip
                    }
                }
            ]
        }, {
            "id": "group8"
            , "shortText": "Load S1 DNA into gel"
            , "steps": [
                {
                    "id": "addTipTop3"
                    , "shortText": "Place tip"
                    , "longText": "Add a tip to the micropipette"
                    , "bottomText": "Click on any tip to add it to the micropipette"                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": ".tipTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.addTipTop
                    }
                }
                , {
                    "id": "takeS1"
                    , "shortText": "Suspect 1 DNA"
                    , "longText": "Remove 10 uL of suspect 1 (blue tube)"
                    , "bottomText": "Click the suspect 1 DNA (blue tube) to draw it up"                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": ".tubeTopp"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.takeMicTube
                        , "postEventFunction" : helperFunctions.takeMicTubePost
                        , "criteria": {
                            "variable": "tubePicked",
                            "value": 2,
                            "messageWrong": "Incorrect. Please select the correct tube."
                            }
                    }
                }
                , {
                    "id": "toLane3"
                    , "shortText": "Put in Lane 3"
                    , "longText": "Move the micropipette to the correct well"
                    , "bottomText": "Click on the correct well to move the micropipette."                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": ".wells" //"#well_0"
                        , "eventType": "click" //"click"
                        , "eventFunction": helperFunctions.toLane
                        , "postEventFunction" : helperFunctions.toLanePost
                        , "criteria": {
                            "variable": "lanePicked",
                            "value": 2,
                            "messageWrong": "Incorrect. Please select the correct well."
                            }
                    }
                }
                , {
                    "id": "insertTip3"
                    , "shortText": "Insert tip"
                    , "longText": "Place the tip in the well. Be sure not to breach the walls!"
                    , "bottomText": "Drag around the tip to position it"                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#gelWell"
                        , "eventType": "drop"
                        , "eventFunction": helperFunctions.insertTip
                        , "postEventFunction": helperFunctions.insertTipPost
                        , "criteria": {
                            "variable": "TipPosition",
                            "value": true
                        }
                    }
                }
                , {
                    "id": "disposeTip3"
                    , "shortText": "Dispose of tip"
                    , "longText": "Dispose of the used tip"
                    , "bottomText": "Click on the waste bin to dispose of the tip"                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#wasteBinTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.disposeTip
                    }
                }
            ]
        }, {
            "id": "group9"
            , "shortText": "Load S2 DNA into gel"
            , "steps": [
                {
                    "id": "addTipTop4"
                    , "shortText": "Place tip"
                    , "longText": "Add a tip to the micropipette"
                    , "bottomText": "Click on any tip to add it to the micropipette"                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": ".tipTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.addTipTop
                    }
                }
                , {
                    "id": "takeS2"
                    , "shortText": "Suspect 2 DNA"
                    , "longText": "Remove 10 uL of suspect 2 (orange tube)"
                    , "bottomText": "Click the suspect 2 DNA (orange tube) to draw it up"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": ".tubeTopp"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.takeMicTube
                        , "postEventFunction" : helperFunctions.takeMicTubePost
                        , "criteria": {
                            "variable": "tubePicked",
                            "value": 3,
                            "messageWrong": "Incorrect. Please select the correct tube."
                            }
                    }
                }
                , {
                    "id": "toLane4"
                    , "shortText": "Put in Lane 4"
                    , "longText": "Move the micropipette to the correct well"
                    , "bottomText": "Click on the correct well to move the micropipette."
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": ".wells" //"#well_0"
                        , "eventType": "click" //"click"
                        , "eventFunction": helperFunctions.toLane
                        , "postEventFunction" : helperFunctions.toLanePost
                        , "criteria": {
                            "variable": "lanePicked",
                            "value": 3,
                            "messageWrong": "Incorrect. Please select the correct well."
                            }
                    }
                }
                , {
                    "id": "insertTip4"
                    , "shortText": "Insert tip"
                    , "longText": "Place the tip in the well. Be sure not to breach the walls!"
                    , "bottomText": "Drag around the tip to position it"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#gelWell"
                        , "eventType": "drop"
                        , "eventFunction": helperFunctions.insertTip
                        , "postEventFunction": helperFunctions.insertTipPost
                        , "criteria": {
                            "variable": "TipPosition",
                            "value": true
                        }
                    }
                }
                , {
                    "id": "disposeTip4"
                    , "shortText": "Dispose of tip"
                    , "longText": "Dispose of the used tip"
                    , "bottomText": "Click on the waste bin to dispose of the tip"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#wasteBinTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.disposeTip
                    }
                }
            ]
        }, {
            "id": "group10"
            , "shortText": "Load S3 DNA into gel"
            , "steps": [
                {
                    "id": "addTipTop5"
                    , "shortText": "Place tip"
                    , "longText": "Add a tip to the micropipette"
                    , "bottomText": "Click on any tip to add it to the micropipette"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": ".tipTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.addTipTop
                    }
                }
                , {
                    "id": "takeS3"
                    , "shortText": "Suspect 3 DNA"
                    , "longText": "Remove 10 uL of suspect 3 (purple tube)"
                    , "bottomText": "Click the suspect 3 DNA (purple tube) to draw it up"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": ".tubeTopp"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.takeMicTube
                        , "postEventFunction" : helperFunctions.takeMicTubePost
                        , "criteria": {
                            "variable": "tubePicked",
                            "value": 4,
                            "messageWrong": "Incorrect. Please select the correct tube."
                            }
                    }
                }
                , {
                    "id": "toLane5"
                    , "shortText": "Put in Lane 5"
                    , "longText": "Move the micropipette to the correct well"
                    , "bottomText": "Click on the correct well to move the micropipette."
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": ".wells" //"#well_0"
                        , "eventType": "click" //"click"
                        , "eventFunction": helperFunctions.toLane
                        , "postEventFunction" : helperFunctions.toLanePost
                        , "criteria": {
                            "variable": "lanePicked",
                            "value": 4,
                            "messageWrong": "Incorrect. Please select the correct well."
                            }
                    }
                }
                , {
                    "id": "insertTip5"
                    , "shortText": "Insert tip"
                    , "longText": "Place the tip in the well. Be sure not to breach the walls!"
                    , "bottomText": "Drag around the tip to position it"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#gelWell"
                        , "eventType": "drop"
                        , "eventFunction": helperFunctions.insertTip
                        , "postEventFunction": helperFunctions.insertTipPost
                        , "criteria": {
                            "variable": "TipPosition",
                            "value": true
                        }
                    }
                }
                , {
                    "id": "disposeTip5"
                    , "shortText": "Dispose of tip"
                    , "longText": "Dispose of the used tip"
                    , "bottomText": "Click on the waste bin to dispose of the tip"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#wasteBinTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.disposeTip
                    }
                }
            ]
        }, {
            "id": "group11"
            , "shortText": "Load S4 DNA into gel"
            , "steps": [
                {
                    "id": "addTipTop6"
                    , "shortText": "Place tip"
                    , "longText": "Add a tip to the micropipette"
                    , "bottomText": "Click on any tip to add it to the micropipette"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": ".tipTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.addTipTop
                    }
                }
                , {
                    "id": "takeS4"
                    , "shortText": "Suspect 4 DNA"
                    , "longText": "Remove 10 uL of suspect 4 (pink tube)"
                    , "bottomText": "Click the suspect 4 DNA (pink tube) to draw it up"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": ".tubeTopp"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.takeMicTube
                        , "postEventFunction" : helperFunctions.takeMicTubePost
                        , "criteria": {
                            "variable": "tubePicked",
                            "value": 5,
                            "messageWrong": "Incorrect. Please select the correct tube."
                            }
                    }
                }
                , {
                    "id": "toLane6"
                    , "shortText": "Put in Lane 6"
                    , "longText": "Move the micropipette to the correct well"
                    , "bottomText": "Click on the correct well to move the micropipette."
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": ".wells" //"#well_0"
                        , "eventType": "click" //"click"
                        , "eventFunction": helperFunctions.toLane
                        , "postEventFunction" : helperFunctions.toLanePost
                        , "criteria": {
                            "variable": "lanePicked",
                            "value": 5,
                            "messageWrong": "Incorrect. Please select the correct well."
                            }
                    }
                }
                , {
                    "id": "insertTip6"
                    , "shortText": "Insert tip"
                    , "longText": "Place the tip in the well. Be sure not to breach the walls!"
                    , "bottomText": "Drag around the tip to position it"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#gelWell"
                        , "eventType": "drop"
                        , "eventFunction": helperFunctions.insertTip
                        , "postEventFunction": helperFunctions.insertTipPost
                        , "criteria": {
                            "variable": "TipPosition",
                            "value": true
                        }
                    }
                }
                , {
                    "id": "disposeTip6"
                    , "shortText": "Dispose of tip"
                    , "longText": "Dispose of the used tip"
                    , "bottomText": "Click on the waste bin to dispose of the tip"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#wasteBinTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.disposeTip
                    }
                }
            ]
        }, {
            "id": "group12"
            , "shortText": "Load S5 DNA into gel"
            , "steps": [
                {
                    "id": "addTipTop7"
                    , "shortText": "Place tip"
                    , "longText": "Add a tip to the micropipette"
                    , "bottomText": "Click on any tip to add it to the micropipette"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": ".tipTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.addTipTop
                    }
                }
                , {
                    "id": "takeS5"
                    , "shortText": "Suspect 5 DNA"
                    , "longText": "Remove 10 uL of suspect 5 (yellow tube)"
                    , "bottomText": "Click the suspect 5 DNA (yellow tube) to draw it up"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": ".tubeTopp"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.takeMicTube
                        , "postEventFunction" : helperFunctions.takeMicTubePost
                        , "criteria": {
                            "variable": "tubePicked",
                            "value": 6,
                            "messageWrong": "Incorrect. Please select the correct tube."
                            }
                    }
                }
                , {
                    "id": "toLane7"
                    , "shortText": "Put in Lane 7"
                    , "longText": "Move the micropipette to the correct well"
                    , "bottomText": "Click on the correct well to move the micropipette."
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": ".wells" //"#well_0"
                        , "eventType": "click" //"click"
                        , "eventFunction": helperFunctions.toLane
                        , "postEventFunction" : helperFunctions.toLanePost
                        , "criteria": {
                            "variable": "lanePicked",
                            "value": 6,
                            "messageWrong": "Incorrect. Please select the correct well."
                            }
                    }
                }
                , {
                    "id": "insertTip7"
                    , "shortText": "Insert tip"
                    , "longText": "Place the tip in the well. Be sure not to breach the walls!"
                    , "bottomText": "Drag around the tip to position it"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#gelWell"
                        , "eventType": "drop"
                        , "eventFunction": helperFunctions.insertTip
                        , "postEventFunction": helperFunctions.insertTipPost
                        , "criteria": {
                            "variable": "TipPosition",
                            "value": true
                        }
                    }
                }
                , {
                    "id": "disposeTip7"
                    , "shortText": "Dispose of tip"
                    , "longText": "Dispose of the used tip"
                    , "bottomText": "Click on the waste bin to dispose of the tip"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#wasteBinTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.disposeTip
                    }
                }
            ]
        }, {
            "id": "group13"
            , "shortText": "Gel Electrophoresis"
            , "steps": [
                {
                    "id": "lidOnBox"
                    , "shortText": "Place lid on the gel box"
                    , "longText": "Place the lid on the gel electrophoresis chamber"
                    , "bottomText": "Click on the lid to place it on the chamber"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": "#lidSide"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.clickLid
                    }
                }
                , {
                    "id": "setVoltage"
                    , "shortText": "Set the voltage"
                    , "longText": "Set the power to 100 volts. Allow the gel to run for 30-40 minutes."
                    , "bottomText": "Enter the correct voltage"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": "#voltageInputForm"
                        , "eventType": "submit"
                        , "eventFunction": helperFunctions.setVoltage
                        , "postEventFunction": helperFunctions.setVoltagePost
                        , "criteria": {
                            "variable": "voltage"
                            , "value": 100
                            , "messageWrong": "Incorrect, please enter the approriate volume!"
                        }
                    }
                }
                , {
                    "id": "removeGelLid"
                    , "shortText": "Remove Lid"
                    , "longText": "Remove the lid from the electrophoresis chamber"
                    , "bottomText": "Click on the lid to remove it from the chamber"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#lidBox"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.removeGelLid
                    }
                }
                , {
                    "id": "removeGel"
                    , "shortText": "Remove gel"
                    , "longText": "Remove the gel tray from the electrophoresis chamber"
                    , "bottomText": "Click on the staining tray to remove the gel"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#stainingTray"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.removeGel
                    }
                }
                , {
                    "id": "nudgeGel"
                    , "shortText": "Nudge gel"
                    , "longText": "Nudge the gel onto the staining tray"
                    , "bottomText": "Click on the gel to nudge it"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": "#gelFinalTop"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.nudgeGel
                    }
                }
            ]
        }, {
            "id": "group14"
            , "shortText": "Stain and analyze"
            , "steps": [
                {
                    "id": "stainGel"
                    , "shortText": "Stain the gel"
                    , "longText": "Pour the stain onto the gel in the staining tray"
                    , "bottomText": "Click on the graduated cylinder to pour the stain"
                    , "feedbackText": "complete the first step"
                    , "logic": {
                        "eventSelector": "#graduatedCylinder"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.stainGel
                    }
                }
                , {
                    "id": "examineGel"
                    , "shortText": "Examine the gel"
                    , "longText": "Examine the stained gel to identify your suspect"
                    , "bottomText": "Click on the stained gel to examine it"
                    , "feedbackText": "complete the second step"
                    , "logic": {
                        "eventSelector": "#stainedGel"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.examineGel
                    }
                }
                , {
                    "id": "pickLane"
                    , "shortText": "Pick correct lane"
                    , "longText": "Which suspect's DNA matches the sample found at the crime scene?"
                    , "bottomText": "Click on a lane to select it"
                    , "feedbackText": "complete the third step"
                    , "logic": {
                        "eventSelector": ".laneFills"
                        , "eventType": "click"
                        , "eventFunction": helperFunctions.pickLane
                        , "postEventFunction": helperFunctions.pickLanePost
                        , "criteria": {
                            "variable": "lanePickedNumber",
                            "value": answer-1,
                            "messageWrong": "Incorrect. Try again."
                            }
                    }
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
            var newStep = new Step(cur, "#step" + stepCount, "#icon" + stepCount);
            game.addStep(newStep);
            newGroup.addStep(newStep);
        }
    }
    game.linkSteps();
    updateSteps();
}
