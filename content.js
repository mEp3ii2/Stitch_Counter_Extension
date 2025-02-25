(function() {
    
    if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Bonbon"]')) {
    
        const preconnect1 = document.createElement('link');
        preconnect1.rel = 'preconnect';
        preconnect1.href = 'https://fonts.googleapis.com';
        document.head.appendChild(preconnect1);
    
        const preconnect2 = document.createElement('link');
        preconnect2.rel = 'preconnect';
        preconnect2.href = 'https://fonts.gstatic.com';
        preconnect2.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect2);
    
    
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Bonbon&display=swap';
        document.head.appendChild(fontLink);
    }

    // Create container for the counter
    let container = document.getElementById('stitchCounter');
    if (!container) {
        container = document.createElement('div');
        container.id = 'stitchCounter';
        container.innerHTML = `
        <div id="dragHeader">my little <br> crochet counter</div>
        <div>
            <label for="stitchesPerRow">stitches / row:</label>
            <input type="number" id="stitchesPerRow" value="10" min="1" />
        </div>
        <div>
            <strong>Row:</strong> <span id="rowCount">0</span><br>
            <strong>Stitch:</strong> <span id="stitchCount">0</span>
        </div>
        <div>
            <button id="incrementStitch">add stitch</button>
            <button id="resetCounters">reset</button>
        </div>
        `;
        document.body.appendChild(container);
    }
    //code for the draggins
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const dragHeader = container.querySelector("#dragHeader");

    dragHeader.addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', closeDragElement);
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        container.style.top = (container.offsetTop - pos2) + "px";
        container.style.left = (container.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('mouseup', closeDragElement);
    }

    //code to keep it on fullscreen switch
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
          document.fullscreenElement.appendChild(container);
        } else {
          document.body.appendChild(container);
        }
      });

    // code for the counter
    let rowCount = 0;
    let stitchCount = 0;
  
    
    const stitchesPerRowInput = container.querySelector('#stitchesPerRow');
    const rowCountDisplay = container.querySelector('#rowCount');
    const stitchCountDisplay = container.querySelector('#stitchCount');
    const incrementButton = container.querySelector('#incrementStitch');
    const resetButton = container.querySelector('#resetCounters');
  
    function incrementStitch() {
        const stitchesPerRow = parseInt(stitchesPerRowInput.value, 10);
        if (isNaN(stitchesPerRow) || stitchesPerRow <= 0) {
          alert('Please enter a valid number of stitches per row.');
          return;
        }
        stitchCount++;
        if (stitchCount >= stitchesPerRow) {
          stitchCount = 0;
          rowCount++;
        }
        rowCountDisplay.textContent = rowCount;
        stitchCountDisplay.textContent = stitchCount;
      }
    
    //user can click button or use ` to increment
      incrementButton.addEventListener('click', incrementStitch);
    
    document.addEventListener('keydown', function(e){
        if(e.key === '`'){
            e.preventDefault();
            incrementStitch();
        }
    })
    resetButton.addEventListener('click', () => {
      rowCount = 0;
      stitchCount = 0;
      rowCountDisplay.textContent = rowCount;
      stitchCountDisplay.textContent = stitchCount;
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'toggleCounter') {
          if (container.style.display === 'none' || container.style.display === '') {
            container.style.display = 'block';
          } else {
            container.style.display = 'none';
          }
        }
    });
})();