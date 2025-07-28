<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vermont Isopod Identification Key</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom styles to complement Tailwind */
        body {
            font-family: 'Source Sans 3', sans-serif;
            background-color: #f0eadd; /* A warm, paper-like color */
        }
        h1, h2 {
            font-family: 'Lora', serif;
        }
        .choice-image-container {
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .choice-image-container:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body class="bg-[#f0eadd] text-gray-800 flex items-center justify-center min-h-screen p-4">

    <div id="game-container" class="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-10 text-center">

        <!-- Start Screen -->
        <div id="start-screen">
            <h1 class="text-4xl md:text-5xl font-bold text-[#4a403a] mb-4">Isopod Identifier</h1>
            <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Welcome to the virtual key for the Oniscoidea of Vermont. You will be shown a specimen. Follow the visual guide to correctly identify it!</p>
            <button id="start-button" class="bg-[#6d5d4d] text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg hover:bg-[#5a4d41] transition-colors duration-300">
                Begin Identification
            </button>
        </div>

        <!-- Game Screen -->
        <div id="game-screen" class="hidden">
            <h2 class="text-2xl md:text-3xl font-bold text-[#4a403a] mb-2">Specimen to Identify:</h2>
            <div id="specimen-area" class="mb-6 flex justify-center">
                <img id="specimen-image" src="" alt="Specimen to identify" class="max-w-xs md:max-w-sm w-full h-auto rounded-lg shadow-lg border-4 border-white bg-[#d1c4b7]">
            </div>
            <p id="question-text" class="text-xl md:text-2xl font-semibold text-gray-700 mb-6 min-h-[3rem]"></p>
            <div id="choices-area" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Choices will be dynamically inserted here -->
            </div>
        </div>

        <!-- End Screen -->
        <div id="end-screen" class="hidden">
            <h1 id="end-title" class="text-4xl md:text-5xl font-bold mb-4"></h1>
            <p id="end-message" class="text-lg text-gray-600 mb-8"></p>
            <div id="correct-specimen-display" class="mb-8 flex justify-center"></div>
            <button id="restart-button" class="bg-[#6d5d4d] text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg hover:bg-[#5a4d41] transition-colors duration-300">
                Identify Another
            </button>
        </div>

    </div>

    <script>
        // --- DATA STRUCTURES ---

        const CDN_BASE_URL = "https://sbutltmedia.github.io/CDN/Isopod/";

        const imageUrlMap = {
          // Species Images
          "Armadillidium nasatum": "species-armadillidium-nasatum.jpg",
          "Armadillidium vulgare": "species-armadillidium-vulgare.jpg",
          "Ligidium longicaudatum": "species-ligidium-longicaudatum.jpg",
          "Trichoniscus pusillus": "species-trichoniscus-pusillus.jpg",
          "Haplophthalmus danicus": "species-haplophthalmus-danicus.jpg",
          "Oniscus asellus": "species-oniscus-asellus.jpg",
          "Metoponorthus pruinosus": "species-metoponorthus-pruinosus.jpg",
          "Cylisticus convexus": "species-cylisticus-convexus.jpg",
          "Porcellio laevis": "species-porcellio-laevis.jpg",
          "Porcellio spinicornis": "species-porcellio-spinicornis.jpg",
          "Porcellio scaber": "species-porcellio-scaber.jpg",
          "Porcellio rathkei": "species-porcellio-rathkei.jpg",
          // Feature Images
          "FEATURE: Short Uropods\n(not beyond body)": "feature-short-uropods.jpg",
          "FEATURE: Long Uropods\n(beyond body)": "feature-long-uropods.jpg",
          "FEATURE: Notched Frontal Line": "feature-notched-frontal-line.jpg",
          "FEATURE: Smooth Frontal Line": "feature-smooth-frontal-line.jpg",
          "FEATURE: Rounded/\nSlightly Indented\nAbdominal Segment": "feature-rounded-abdominal-segment.jpg",
          "FEATURE: Acutely Triangular\nAbdominal Segment": "feature-triangular-abdominal-segment.jpg",
          "FEATURE: 11 Segments\nin Antenna Flagellum": "feature-11-antenna-segments.jpg",
          "FEATURE: 3-4 Segments\nin Antenna Flagellum": "feature-3-to-4-antenna-segments.jpg",
          "FEATURE: 3 Eye Facets": "feature-3-eye-facets.jpg",
          "FEATURE: 1 Eye Facet": "feature-1-eye-facet.jpg",
          "FEATURE: 3 Segments\nin Antenna Flagellum": "feature-3-antenna-segments.jpg",
          "FEATURE: 2 Segments\nin Antenna Flagellum": "feature-2-antenna-segments.jpg",
          "FEATURE: Abdomen\nAbruptly Narrower": "feature-abdomen-narrower.jpg",
          "FEATURE: Abdomen NOT\nAbruptly Narrower": "feature-abdomen-not-narrower.jpg",
          "FEATURE: Smooth\nDorsal Surface": "feature-smooth-dorsal-surface.jpg",
          "FEATURE: Bumpy (Tuberculate)\nDorsal Surface": "feature-bumpy-dorsal-surface.jpg",
          "FEATURE: Extremely\nConvex Body": "feature-extremely-convex-body.jpg",
          "FEATURE: Moderately\nConvex Body": "feature-moderately-convex-body.jpg",
          "FEATURE: Head Color\nContrasts with Thorax": "feature-head-contrasts-thorax.jpg",
          "FEATURE: Head Color\nDoes NOT Contrast": "feature-head-not-contrasting.jpg",
          "FEATURE: 2 Pairs\nof White Bodies": "feature-2-pairs-white-bodies.jpg",
          "FEATURE: 5 Pairs\nof White Bodies": "feature-5-pairs-white-bodies.jpg"
        };
        
        const keyData = {
            q1: { question: "Do the uropods (tail-like appendages) extend beyond the body outline?", choices: [{ imageText: "FEATURE: Short Uropods\n(not beyond body)", next: "q2" }, { imageText: "FEATURE: Long Uropods\n(beyond body)", next: "q3" }] },
            q2: { question: "Is the frontal line on the head notched at the midline?", choices: [{ imageText: "FEATURE: Notched Frontal Line", next: "Armadillidium nasatum" }, { imageText: "FEATURE: Smooth Frontal Line", next: "Armadillidium vulgare" }] },
            q3: { question: "Is the last abdominal segment rounded or acutely triangular?", choices: [{ imageText: "FEATURE: Rounded/\nSlightly Indented\nAbdominal Segment", next: "q4" }, { imageText: "FEATURE: Acutely Triangular\nAbdominal Segment", next: "q6" }] },
            q4: { question: "How many segments are in the antenna flagellum?", choices: [{ imageText: "FEATURE: 11 Segments\nin Antenna Flagellum", next: "Ligidium longicaudatum" }, { imageText: "FEATURE: 3-4 Segments\nin Antenna Flagellum", next: "q5" }] },
            q5: { question: "How many facets (lenses) are in the compound eye?", choices: [{ imageText: "FEATURE: 3 Eye Facets", next: "Trichoniscus pusillus" }, { imageText: "FEATURE: 1 Eye Facet", next: "Haplophthalmus danicus" }] },
            q6: { question: "How many segments are in the antenna flagellum?", choices: [{ imageText: "FEATURE: 3 Segments\nin Antenna Flagellum", next: "Oniscus asellus" }, { imageText: "FEATURE: 2 Segments\nin Antenna Flagellum", next: "q7" }] },
            q7: { question: "Is the abdomen abruptly narrower than the thorax?", choices: [{ imageText: "FEATURE: Abdomen\nAbruptly Narrower", next: "Metoponorthus pruinosus" }, { imageText: "FEATURE: Abdomen NOT\nAbruptly Narrower", next: "q8" }] },
            q8: { question: "Is the dorsal (top) surface smooth or bumpy (tuberculate)?", choices: [{ imageText: "FEATURE: Smooth\nDorsal Surface", next: "q9" }, { imageText: "FEATURE: Bumpy (Tuberculate)\nDorsal Surface", next: "q10" }] },
            q9: { question: "How convex is the body?", choices: [{ imageText: "FEATURE: Extremely\nConvex Body", next: "Cylisticus convexus" }, { imageText: "FEATURE: Moderately\nConvex Body", next: "Porcellio laevis" }] },
            q10: { question: "Does the gray head contrast with the thorax color?", choices: [{ imageText: "FEATURE: Head Color\nContrasts with Thorax", next: "Porcellio spinicornis" }, { imageText: "FEATURE: Head Color\nDoes NOT Contrast", next: "q11" }] },
            q11: { question: "How many pairs of white bodies are visible (in a live animal)?", choices: [{ imageText: "FEATURE: 2 Pairs\nof White Bodies", next: "Porcellio scaber" }, { imageText: "FEATURE: 5 Pairs\nof White Bodies", next: "Porcellio rathkei" }] }
        };

        const speciesData = [
            { name: "Armadillidium nasatum", path: ["FEATURE: Short Uropods\n(not beyond body)", "FEATURE: Notched Frontal Line"] }, { name: "Armadillidium vulgare", path: ["FEATURE: Short Uropods\n(not beyond body)", "FEATURE: Smooth Frontal Line"] }, { name: "Ligidium longicaudatum", path: ["FEATURE: Long Uropods\n(beyond body)", "FEATURE: Rounded/\nSlightly Indented\nAbdominal Segment", "FEATURE: 11 Segments\nin Antenna Flagellum"] }, { name: "Trichoniscus pusillus", path: ["FEATURE: Long Uropods\n(beyond body)", "FEATURE: Rounded/\nSlightly Indented\nAbdominal Segment", "FEATURE: 3-4 Segments\nin Antenna Flagellum", "FEATURE: 3 Eye Facets"] }, { name: "Haplophthalmus danicus", path: ["FEATURE: Long Uropods\n(beyond body)", "FEATURE: Rounded/\nSlightly Indented\nAbdominal Segment", "FEATURE: 3-4 Segments\nin Antenna Flagellum", "FEATURE: 1 Eye Facet"] }, { name: "Oniscus asellus", path: ["FEATURE: Long Uropods\n(beyond body)", "FEATURE: Acutely Triangular\nAbdominal Segment", "FEATURE: 3 Segments\nin Antenna Flagellum"] }, { name: "Metoponorthus pruinosus", path: ["FEATURE: Long Uropods\n(beyond body)", "FEATURE: Acutely Triangular\nAbdominal Segment", "FEATURE: 2 Segments\nin Antenna Flagellum", "FEATURE: Abdomen\nAbruptly Narrower"] }, { name: "Cylisticus convexus", path: ["FEATURE: Long Uropods\n(beyond body)", "FEATURE: Acutely Triangular\nAbdominal Segment", "FEATURE: 2 Segments\nin Antenna Flagellum", "FEATURE: Abdomen NOT\nAbruptly Narrower", "FEATURE: Smooth\nDorsal Surface", "FEATURE: Extremely\nConvex Body"] }, { name: "Porcellio laevis", path: ["FEATURE: Long Uropods\n(beyond body)", "FEATURE: Acutely Triangular\nAbdominal Segment", "FEATURE: 2 Segments\nin Antenna Flagellum", "FEATURE: Abdomen NOT\nAbruptly Narrower", "FEATURE: Smooth\nDorsal Surface", "FEATURE: Moderately\nConvex Body"] }, { name: "Porcellio spinicornis", path: ["FEATURE: Long Uropods\n(beyond body)", "FEATURE: Acutely Triangular\nAbdominal Segment", "FEATURE: 2 Segments\nin Antenna Flagellum", "FEATURE: Abdomen NOT\nAbruptly Narrower", "FEATURE: Bumpy (Tuberculate)\nDorsal Surface", "FEATURE: Head Color\nContrasts with Thorax"] }, { name: "Porcellio scaber", path: ["FEATURE: Long Uropods\n(beyond body)", "FEATURE: Acutely Triangular\nAbdominal Segment", "FEATURE: 2 Segments\nin Antenna Flagellum", "FEATURE: Abdomen NOT\nAbruptly Narrower", "FEATURE: Bumpy (Tuberculate)\nDorsal Surface", "FEATURE: Head Color\nDoes NOT Contrast", "FEATURE: 2 Pairs\nof White Bodies"] }, { name: "Porcellio rathkei", path: ["FEATURE: Long Uropods\n(beyond body)", "FEATURE: Acutely Triangular\nAbdominal Segment", "FEATURE: 2 Segments\nin Antenna Flagellum", "FEATURE: Abdomen NOT\nAbruptly Narrower", "FEATURE: Bumpy (Tuberculate)\nDorsal Surface", "FEATURE: Head Color\nDoes NOT Contrast", "FEATURE: 5 Pairs\nof White Bodies"] }
        ];

        // --- GAME STATE ---
        let currentTarget = null; let currentQuestionKey = ''; let userStep = 0;

        // --- DOM ELEMENTS ---
        const startScreen = document.getElementById('start-screen'); const gameScreen = document.getElementById('game-screen'); const endScreen = document.getElementById('end-screen');
        const startButton = document.getElementById('start-button'); const restartButton = document.getElementById('restart-button');
        const specimenImage = document.getElementById('specimen-image'); const questionText = document.getElementById('question-text'); const choicesArea = document.getElementById('choices-area');
        const endTitle = document.getElementById('end-title'); const endMessage = document.getElementById('end-message'); const correctSpecimenDisplay = document.getElementById('correct-specimen-display');

        // --- HELPER FUNCTIONS ---
        function getImageUrl(name) {
            const filename = imageUrlMap[name];
            return filename ? CDN_BASE_URL + filename : getPlaceholderUrl(`MISSING:\n${name}`);
        }

        function getPlaceholderUrl(text, width = 400, height = 300) {
            const bgColor = 'd1c4b7'; const textColor = '3e332d';
            return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}&font=lora`;
        }

        // --- GAME LOGIC ---
        function startGame() {
            currentTarget = speciesData[Math.floor(Math.random() * speciesData.length)];
            currentQuestionKey = 'q1'; userStep = 0;
            startScreen.classList.add('hidden'); endScreen.classList.add('hidden'); gameScreen.classList.remove('hidden');
            renderState();
        }

        function renderState() {
            const specimenName = currentTarget.name;
            specimenImage.src = getImageUrl(specimenName);
            specimenImage.onerror = () => { specimenImage.src = getPlaceholderUrl(`SPECIMEN:\n${specimenName}`, 600, 400); };
            specimenImage.alt = `Specimen to identify: ${specimenName}`;
            
            const questionData = keyData[currentQuestionKey];
            questionText.textContent = questionData.question;

            choicesArea.innerHTML = '';
            questionData.choices.forEach(choice => {
                const choiceEl = document.createElement('div');
                choiceEl.className = 'choice-image-container cursor-pointer rounded-lg overflow-hidden shadow-lg border-2 border-transparent hover:border-[#6d5d4d] bg-[#d1c4b7]';
                
                const imageUrl = getImageUrl(choice.imageText);
                const placeholderUrl = getPlaceholderUrl(choice.imageText);
                
                choiceEl.innerHTML = `<img src="${imageUrl}" alt="${choice.imageText}" class="w-full h-auto object-cover" onerror="this.onerror=null;this.src='${placeholderUrl}';">`;
                
                choiceEl.addEventListener('click', () => handleChoice(choice));
                choicesArea.appendChild(choiceEl);
            });
        }

        function handleChoice(chosenOption) {
            if (chosenOption.imageText === currentTarget.path[userStep]) {
                userStep++;
                const nextStep = chosenOption.next;
                if (keyData[nextStep]) {
                    currentQuestionKey = nextStep;
                    renderState();
                } else {
                    endGame(true);
                }
            } else {
                endGame(false);
            }
        }

        function endGame(isSuccess) {
            gameScreen.classList.add('hidden'); endScreen.classList.remove('hidden');

            const specimenName = currentTarget.name;
            const finalImageUrl = getImageUrl(specimenName);
            const finalPlaceholderUrl = getPlaceholderUrl(`CORRECT:\n${specimenName}`, 400, 300);

            if (isSuccess) {
                endTitle.textContent = 'Identification Successful!';
                endTitle.className = "text-4xl md:text-5xl font-bold mb-4 text-green-700";
                endMessage.textContent = `You correctly identified the specimen as:`;
            } else {
                endTitle.textContent = 'Incorrect Path';
                endTitle.className = "text-4xl md:text-5xl font-bold mb-4 text-red-700";
                endMessage.textContent = `That was the wrong choice. The correct specimen was:`;
            }
            
            correctSpecimenDisplay.innerHTML = `
                <div class="text-center">
                    <img src="${finalImageUrl}" alt="${specimenName}" class="rounded-lg shadow-md mx-auto mb-2 border-4 border-white bg-[#d1c4b7]" style="max-width: 400px;" onerror="this.onerror=null;this.src='${finalPlaceholderUrl}';">
                    <p class="text-2xl font-bold italic">${specimenName}</p>
                </div>
            `;
        }

        // --- EVENT LISTENERS ---
        startButton.addEventListener('click', startGame);
        restartButton.addEventListener('click', startGame);

    </script>
</body>
</html>
