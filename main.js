onload = () => main();


const REGEX = /%<?([^%]*)%/;

// key is a phrase, values are isFound and followsPrevious
let passMap = new Map();
let passCount = 0;

const dialogList = [];
let dialogCount = 0;
let dialogPoem = "";
let dialogElement;
let inputElement;

let poem = "";


async function main() {
    // resetNavigation(); ---> How to redirect without auth // don't worry about it
    setUp();
}

function setUp() {
    parsePoems();
}

function parsePoems() {
    let result;
    fetch("./assets/poems.txt").then((response) => {
        return response.blob();
    }).then((blob) => {
        return blob.text();
    }).then((text) => {
        let poems = text.split("_");
        
        setUpMainPoem(poems[0]);
        setUpDialogPoem(poems[1]);
        // set up 2nd page poem???

        setUpEventListeners();
        setUpElements();
    });

}

function setUpMainPoem(text) {
    let lines = text.split("\n");
    let i = 0;
    let j = 0;

    // for each line
    lines = lines.map((line, index) => {
        // if a line include a subtitle, make sure to create a new subsection
        if (line.includes("<b>")) {
            line = `<pre id="time${j}">` + line;
            j++;

            // after the first subsection, make sure to close the previous one
            if (index > 0) {
                line = "</pre>" + line;
            }
        }
        // while the line includes a key phrase
        while (line.includes("%")) {

            let match = line.match(REGEX);
            let follows = match[0].includes("<");
            passMap.set(match[1], {isFound: false, followsPrevious: follows});

            line = line.replace(REGEX, `<span id="key${i}" class="hidden-buttons">$1</span>`);
            i++;
        }
        return line;
    });
    poem = lines.join("\n") + "</pre>";
    document.getElementById("poem").innerHTML = poem;
} 
function setUpDialogPoem(text) {
    dialogList.push(...(text.split("\n").slice(1)));
}

function setUpEventListeners() {
    // set up event listener for each passphrase
    // on click change background color of each phrase
    Array.from(passMap.keys()).forEach((key, index) => {
        let phraseElement = document.getElementById(`key${index}`);
        phraseElement.innerHTML = key;

        phraseElement.addEventListener("click", () => {
            foundPhrase(key);
            phraseElement.style.backgroundColor = "aqua";
        });
    });

    // watch mouse movements
    document.addEventListener('mousemove', (mouse) => {        
        if (passMap.size - passCount <= 4) {
            // getting mouse coordinates and remaining passphrases
            let lastOnes = getRemainingSpans();
            let x = mouse.clientX;
            let y = mouse.clientY;
            // distance in px
            let distance = 60;

            // for each remaining passphrase
            // if the mouse is within a specific proximity
            // highlight the phrase slightly to draw attention to it
            lastOnes.forEach((span) => {
                let rect = span.getBoundingClientRect();
                let top = rect.top;
                let right = rect.right;
                let bottom = rect.bottom;
                let left = rect.left;
                
                if (
                    (y >= (top - distance) && y <= (bottom + distance)) &&
                    (x >= (left - distance) && x <= (right + distance))
                ) {
                    span.classList.add("last-ones");
                } else {
                    span.classList.remove("last-ones");
                }
            })
        }
    });
}


function setUpElements() {
    inputElement = document.getElementById("fake-input");
    dialogElement = document.getElementById("dialog");
}

function getRemainingSpans() {
    let spans = [];
    Array.from(passMap.entries()).forEach(([, values], index) => {
        if(!values.isFound) {
            spans.push(document.getElementById(`key${index}`));
        }
    });
    return spans;
}

function foundPhrase(key) {
    let passInfo = passMap.get(key);
    if (!passInfo.isFound) {
        passInfo.isFound = true;
        passMap.set(key, passInfo);
        passCount++;
        let inputStr = "";
        Array.from(passMap.entries()).forEach(([phrase, info]) => {
            if (info.isFound) {
                if (info.followsPrevious) {
                    inputStr = inputStr + " " + phrase;
                } else {

                    inputStr =  inputStr + "\n" + phrase;
                }
            }
        });
        // remove first \n
        inputStr = inputStr.replace("\n", "");
        inputElement.innerHTML = inputStr;
    }
}

function attemptSubmit() {
    if (passCount === passMap.size) {
        submit();
    } else {
        showDialog();
    }
}

function submit() {
    let url = window.location.href;
    url = url.replace("index", "reconstruction");
    window.location.href = "reconstruction.html";
}

function showDialog() {
    if (dialogCount < dialogList.length) {
        dialogPoem = dialogPoem + dialogList[dialogCount] + "\n";
        dialogCount++;
    } 
    document.getElementById("dialog-poem").innerHTML = dialogPoem;

    // show the dialog here with the poem
    dialogElement.showModal()
}


function closeDialog() {
    dialogElement.close();
}


function backButton() {

}
