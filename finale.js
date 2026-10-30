onload = () => main();
let poemElement;


async function main() {
    console.log("Hello")
    setUp();
}

function setUp() {
    poemElement = document.getElementsByClassName("overlay");
    setTimeout(() => {
        console.log(poemElement[0].classList)
        poemElement[0].classList.add("overlay-2");
        console.log("in timeout");
    }, 3000)
}