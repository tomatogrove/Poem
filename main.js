onload = () => main();


let passMap = new Map();
let passCount = 0;

const dialogList = ["One", "Two", "Three", "Four"];
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
    parsePoem();
}

function parsePoem() {
    let result;
    fetch("poems.txt").then((response) => {
        return response.blob();
    }).then((blob) => {
        return blob.text();
    }).then((text) => {
        result = text;
        let lines = result.split("\n");
        let i = 0;

        lines = lines.map((line) => {
            while (line.includes("%")) {
                passMap.set(line.match(/%([^%]*)%/)[1], false);

                line = line.replace(/%([^%]*)%/, `<span id="key${i}" class="hidden-buttons">$1</span>`);
                i++;
            }
            return line;
        });
        console.log(lines.length)
        poem = lines.join("\n");
        document.getElementById("poem").innerHTML = poem;

        setUpEventListeners();
        setUpElements();
    });

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
}


function setUpElements() {
    inputElement = document.getElementById("fake-input");
    dialogElement = document.getElementById("dialog");
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
        console.log(inputStr)
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
    console.log("showDialog");
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
