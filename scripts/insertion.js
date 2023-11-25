document.addEventListener("DOMContentLoaded", function () {
    let sortingInProgress = true; 
    const boxAmountDisplay = document.getElementById("boxAmountDisplay");
    const slider = document.getElementById("slider");
    const boxContainer = document.createElement("div");
    boxContainer.classList.add("box-container");
    document.body.appendChild(boxContainer);

    function generateSortedHeights(numBoxes) {
        const heights = [];
        for (let i = 0; i < numBoxes; i++) 
        {
            let percentage = (i+1)/numBoxes
            heights.push(Math.round(300*percentage));
        }
        return heights;
    }

    function generateRandomHeights(numBoxes) {
        const heights = generateSortedHeights(numBoxes);
        return shuffle(heights);
    }

    function shuffle(array) {
        let currentIndex = array.length,
            randomIndex;
        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function createBoxes(heights) {
        boxContainer.innerHTML = "";
        heights.forEach((height, index) => {
            const box = document.createElement("div");
            box.classList.add("box", "blue");
            box.style.height = `${height}px`;
            boxContainer.appendChild(box);
        });
    }

    function updateBoxHeights(heights) 
    {
        const boxes = document.querySelectorAll(".box");
        boxes.forEach((box, index) => 
        {
            box.style.height = `${heights[index]}px`;
        });
    }

    async function insertionSort(heights) {
        let i = 1;
        while (i < heights.length) 
        {
            let j = i;
            while (j > 0 && heights[j - 1] > heights[j]) 
            {
                [heights[j], heights[j - 1]] = [heights[j - 1], heights[j]];
                updateBoxHeights(heights);
                await sleep(20);
                j--;
            }
            i++; 
        }
        return heights;
    }

    window.updateBoxAmount = function () {
        const numBoxes = parseInt(slider.value);
        boxAmountDisplay.textContent = numBoxes.toString();
        const boxHeights = generateSortedHeights(numBoxes);
        createBoxes(boxHeights);
    };

    window.randomizeBoxes = async function () {
        if (!sortingInProgress) {
            return;
        }
    
        sortingInProgress = false;
    
        const numBoxes = parseInt(slider.value);
        const boxHeights = generateRandomHeights(numBoxes);
    
        const boxes = document.querySelectorAll(".box");
        const swappedIndices = new Set();
        const maxAttempts = 100;
    
        for (let i = 0; i < boxes.length - 1; i++) 
        {
            let attempts = 0;
            let nextIndex;
    
            do {
                nextIndex = Math.floor(Math.random() * (boxes.length - 1));
                attempts++;
                if (attempts >= maxAttempts) {
                    break;
                }
            } while (swappedIndices.has(nextIndex));
    
            swappedIndices.add(nextIndex);
            swappedIndices.add(nextIndex + 1);
    
            [boxes[i].style.height, boxes[nextIndex].style.height] = [boxes[nextIndex].style.height, boxes[i].style.height];
            await sleep(50);
        }
    
        sortingInProgress = true; 
    };
    

    window.startSorting = function () {
        if (!sortingInProgress) 
        {
            return;
        }
    
        sortingInProgress = false;
    
        const boxes = document.querySelectorAll(".box");
        const boxHeights = Array.from(boxes).map((box) => parseInt(box.style.height));
    
        insertionSort(boxHeights);
    
        sortingInProgress = true;
    };

    const initialBoxHeights = generateSortedHeights(10);
    createBoxes(initialBoxHeights);

    window.updateBoxAmount();
});
