onload = () => main();


let canvas;
let ctx;
let images = [];
let overlays = new Set();
let queue = [];
let numShown = 0;
// manually discovered thresholds via ruler tool
const thresholds = [
    270/4215,
    650/4215,
    1050/4215,
    2200/4215,
    3000/4215,
    3600/4215,
    4145/4215
];

const animationClassMap = new Map([
    [1, "fade-in-fast"],
    [2, "fade-in-slow"],
    [3, "fade-in-slow"],
    [4, "fade-in-slow"],
    [5, "fade-in-med"],
    [6, "fade-in-fast"],
    [7, "fade-in-fast"]
]);


async function main() {
    checkAddToOverlays();

    watchScrollBar();
}

async function watchScrollBar() {
    addEventListener("scroll", (event) => {
        // until all 7 stanzas are shown
        if (overlays.size < 7) {
            checkAddToOverlays();
        }
    });
}

async function checkAddToOverlays() {
    const totalPageHeight = document.documentElement.scrollHeight;
    const bottomViewport = window.scrollY + document.documentElement.clientHeight;
    let numAdded = 0;
    for (let i = numShown; i <= thresholds.length; i++) {
        // if the viewport encompasses the location of a stanza
        // make sure to queue it for showing
        if (thresholds[i] <= (bottomViewport / totalPageHeight)) {
            numAdded++;
        }
    }
    createOverlays(numAdded);
}

async function createOverlays(numAdded) {
    let addedToQueue = false;
    const container = document.getElementById("container");
    for (let i = 0; i < numAdded; i++) {
        const overlayNum = numShown + 1;
        const animationClass = animationClassMap.get(overlayNum);
        let newElement = new Image();
        newElement.id = "overlay" + overlayNum;
        newElement.classList.add
        
        
        ("position", animationClass);
        newElement.src = `assets/deconstruction_IV/overlay_v${overlayNum}.png`;
        // scrolling fast may trigger duplicate element creation
        // probably still issues with trying to mitigate it with this check....
        if (!overlays.has(newElement)) {
            overlays.add(newElement);
            queue.unshift(newElement);
            addedToQueue = true;
            numShown++;
        }
    }
    if (addedToQueue) {
        await displayOverlays(container);
    }
}

async function displayOverlays(container) {
    // prevent premature displaying of the overlays
    while (queue.length > 0 && !window.activeTimers()) {
        console.log(queue);
        let element = queue.pop();
        container.appendChild(element);
        let timeout = getWaitTime(element);
        await wait(timeout);
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms)); 
}


function getWaitTime(element) {
    let order = element.id.charAt(element.id.length - 1);
    if (order == 1 || order > 5) {
        return 1000;
    } else if (order < 5 ) {
        return 2500;
    } else  {
        return 1500;
    }
}



// Source - https://stackoverflow.com/a/34294862
// Posted by adeneo, modified by community. See post 'Timeline' for change history
// Retrieved 2026-11-02, License - CC BY-SA 3.0

(function(w) {
     var active = {};

     var _setTimeout = w.setTimeout;
     var _clearTimeout = w.clearTimeout;

     w.setTimeout = function(fn, delay) {
        console.log("overridden set timeout");
         var id = _setTimeout(function() {
             fn();
             delete active[id];
         }, delay);
         active[id] = true;
         console.log(active);
         return id;
     }

     w.clearTimeout = function(id) {
         delete active[id];
         _clearTimeout(id);
     }

     w.activeTimers = function() {
        console.log(Object.keys(active).length > 0);
         return Object.keys(active).length > 0;
     }
})(window);
