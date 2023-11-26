document.addEventListener("DOMContentLoaded", function () {
  let sortingInProgress = true; 
  const boxAmountDisplay = document.getElementById("boxAmountDisplay");
  const slider = document.getElementById("slider");
  const boxContainer = document.createElement("div");
  boxContainer.classList.add("box-container");
  document.body.appendChild(boxContainer);

  function generateSortedHeights(numBoxes) {
      const heights = [];
      for (let i = 0; i < numBoxes; i++) {
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

  function updateBoxHeights(heights) {
      const boxes = document.querySelectorAll(".box");
      boxes.forEach((box, index) => {
          box.style.height = `${heights[index]}px`;
      });
  }

  async function heapSort(heights) 
  {
    let n = heights.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(heights, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        [heights[0], heights[i]] = [heights[i], heights[0]];
        updateBoxHeights(heights);
        await sleep(50);

        await heapify(heights, i, 0);
    }
}

async function heapify(heights, n, i) 
{
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && heights[left] > heights[largest]) {
        largest = left;
    }

    if (right < n && heights[right] > heights[largest]) {
        largest = right;
    }

    if (largest !== i) {
        [heights[i], heights[largest]] = [heights[largest], heights[i]];
        updateBoxHeights(heights);
        await sleep(50);

        await heapify(heights, n, largest);
    }
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
      if (!sortingInProgress) {
          return;
      }

      sortingInProgress = false;

      const boxes = document.querySelectorAll(".box");
      const boxHeights = Array.from(boxes).map((box) => parseInt(box.style.height));

      heapSort(boxHeights);

      sortingInProgress = true;
  };
  const initialBoxHeights = generateSortedHeights(10);
  createBoxes(initialBoxHeights);

  window.updateBoxAmount();
});
