const mainContainer = document.querySelector("main div.container");
const colorGroup = mainContainer.querySelector(".color-groups");
const whiteContainer = colorGroup.querySelector(".whites ul");
const greyContainer = colorGroup.querySelector(".greys ul");
const testBtn = document.querySelector(".test");
var colorsRef = firestore.collection("colorProfiles");
var whitesRef = colorsRef.where("Group", "==", "Whites");
var greysRef = colorsRef.where("Group", "==", "Greys");

const colorDemoPopup = document.querySelector(".colorDemoPopup");
const colorSolid = document.querySelector(".colorSolid");
let colorDemoCName = document.querySelector(".colorDetails #colorName");
let colorDemoCHex = document.querySelector(".colorDetails #colorCode");

console.log(colorDemoCName, colorDemoCHex);
const copiedPopup = document.querySelector(".copiedPopUp");
const whitesArray = [];
const greysArray = [];

let colorSwatchesArray = [];
function renderColorSwatch(doc, container) {
  let li = document.createElement("li");
  let popup = document.createElement("div");
  let colorBox = document.createElement("div");
  let swatchContent = document.createElement("div");
  let swatchName = document.createElement("span");
  let copyIcon = document.createElement("img");
  let popupColorName = document.createElement("span");
  let popupColorCode = document.createElement("span");
  popupColorName.innerText = `${doc.data().ColorName}`;
  popupColorCode.innerText = `${doc.data().CodeHex}`;

  colorBox.classList.add("color-swatch");

  popup.classList.add("colorPopup");
  popup.appendChild(popupColorName);
  popup.appendChild(popupColorCode);
  swatchName.innerText = `${doc.data().ColorName}`;
  swatchContent.appendChild(swatchName);
  swatchContent.appendChild(copyIcon);
  swatchContent.classList.add("swatch-content");
  copyIcon.setAttribute("src", "./assets/images/copyIcon.png");
  colorBox.setAttribute("style", `background-color: ${doc.data().CodeHex}`);
  colorBox.setAttribute("data-colorHex", `${doc.data().CodeHex}`);
  li.setAttribute("data-colorName", `${doc.data().ColorName}`);
  li.appendChild(colorBox);
  li.appendChild(swatchContent);
  colorBox.appendChild(popup);

  container.appendChild(li);

  function colorDemoSetup(colorHex, colorName) {
    console.log(colorSolid);
    colorSolid.setAttribute("style", `background-color: ${colorHex}`);
    colorDemoCHex.innerText = colorHex;
    colorDemoCName.innerText = colorName;
  }

  function colorDemoLoad(colorHex, colorName) {
    if (!colorDemoPopup.classList.contains("active")) {
      colorDemoSetup(colorHex, colorName);
      console.log("done");
      colorDemoPopup.classList.add("active");
    }
  }

  colorBox.addEventListener("click", (e) => {
    let colorHex = e.target.getAttribute("data-colorHex");
    let colorName = e.target.parentElement.getAttribute("data-colorName");
    colorDemoLoad(colorHex, colorName);
    // console.log(colorHex, colorName);
  });

  function copyToClipboard(e) {
    // select list item and get data-attribute which is the colorName
    let colorSwatch = e.target.parentElement;
    let listItem = colorSwatch.parentElement;
    let dataColorName = listItem.dataset.colorname;

    // copy to clipboard
    const el = document.createElement("textarea");
    el.value = dataColorName;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    el.remove();

    copiedPopup.classList.add("active");
    const copiedPopUpSpan = document.querySelector(".copiedColorName");
    copiedPopUpSpan.innerText = dataColorName;
    setTimeout(() => {
      copiedPopup.classList.remove("active");
    }, 800);
  }

  copyIcon.addEventListener("click", (e) => {
    copyToClipboard(e);
  });
}

const closeCopyPopup = document.querySelector(".closeCopy");
closeCopyPopup.addEventListener("click", (e) => {
  copiedPopup.classList.remove("active");
});

function getWhites() {
  whitesRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        whitesArray.push(doc.data());
        renderColorSwatch(doc, whiteContainer);
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  // console.log(whitesArray);
}

function getGreys() {
  greysRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        greysArray.push(doc.data());
        renderColorSwatch(doc, greyContainer);
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

// console.log(colorSwatches);
getWhites();
getGreys();
