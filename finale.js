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


function main() {
    setUp();
}

async function setUp() {

    checkAddToOverlays();

    watchScrollBar();
}

async function loadImages() {
    let promises = [];
    let images = [];
    for (let i = 0; i < 7; i++) {
        promises.push(new Promise((resolve) => {
            let img = new Image();
            img.onload = () => resolve();
            img.src = `assets/deconstruction_IV/overlay_v${i+1}.png`;
            images.push(img);
        }));
    }
    await Promise.all(promises);
    return images;
}


function watchScrollBar() {
    addEventListener("scroll", (event) => {
        checkAddToOverlays();
    });
}

function checkAddToOverlays() {
        const totalPageHeight = document.documentElement.scrollHeight;
        const bottomViewport = window.scrollY + document.documentElement.clientHeight;

        // until all 7 stanzas are shown
        if (overlays.size < 7) {
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
}

// TODO: create queue to stagger fade ins
function createOverlays(numAdded) {
    const container = document.getElementById("container");
    for (let i = 0; i < numAdded; i++) {
        const overlayNum = numShown + 1;
        const animationClass = animationClassMap.get(overlayNum);
        let newElement = new Image();
        newElement.id = "overlay" + overlayNum;
        newElement.classList.add("position", animationClass);
        newElement.src = `assets/deconstruction_IV/overlay_v${overlayNum}.png`;
        // scrolling fast may trigger duplicate element creation
        // probably still issues with trying to mitigate it with this check....
        if (!overlays.has(newElement)) {
            container.appendChild(newElement); // move to dequeue method
            overlays.add(newElement);
            queue.push(newElement);
            numShown++;
        }
    }
}