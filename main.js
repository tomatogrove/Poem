onload = () => main();


let passMap = new Map();
let passCount = 0;

const dialogList = [];
let dialogCount = 0;
let dialogPoem = "";
let dialogElement;
let inputElement;

let poem = "";


async function main() {
    // resetNavigation(); ---> How to redirect without auth
    setUp();
}

function setUp() {
    parsePoems();
}

function parsePoems() {
    let result;
    fetch("poems.txt").then((response) => {
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

    lines = lines.map((line, index) => {
        if (line.includes("<b>")) {
            line = `<pre id="time${j}">` + line;
            j++;

            if (index > 0) {
                line = "</pre>" + line;
            }
        }
        while (line.includes("%")) {
            passMap.set(line.match(/%([^%]*)%/)[1], false);

            line = line.replace(/%([^%]*)%/, `<span id="key${i}" class="hidden-buttons">$1</span>`);
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
    Array.from(passMap.keys()).forEach((key, index) => {
        let phraseElement = document.getElementById(`key${index}`);
        phraseElement.innerHTML = key;

        phraseElement.addEventListener("click", () => {
            foundPhrase(key);
            phraseElement.style.backgroundColor = "aqua";
        });
    });

    document.addEventListener('mousemove', (mouse) => {        
        if (passMap.size - passCount <= 4) {
            let lastOnes = getRemainingSpans();
            let x = mouse.clientX;
            let y = mouse.clientY;
            let d = 60;

            lastOnes.forEach((span) => {
                let rect = span.getBoundingClientRect();
                let top = rect.top;
                let right = rect.right;
                let bottom = rect.bottom;
                let left = rect.left;
                
                console.log(x, y, top, right, bottom, left);
                if (
                    (y >= (top - d) && y <= (bottom + d)) &&
                    (x >= (left - d) && x <= (right + d))
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
    Array.from(passMap.entries()).forEach(([, show], index) => {
        if(!show) {
            spans.push(document.getElementById(`key${index}`));
        }
    });
    return spans;
}

function foundPhrase(key) {
    if (!passMap.get(key)) {
        passMap.set(key, true);
        passCount++;
        let inputStr = "";
        Array.from(passMap.entries()).forEach(([phrase, show]) => {
            if (show) {
                inputStr = inputStr + phrase + "\n";
            }
        });
        inputElement.innerHTML = inputStr;
    }
}

function resetNavigation() {
    let url = window.location.href;
    if (url.includes("secondary")) {
        url = url.replace("secondary", "primary");
        window.location.href = url;
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
    url = url.replace("primary", "secondary");
    window.location.href = url;
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
