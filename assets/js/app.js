const mainContainer = document.querySelector("main div.container");
const colorGroup = mainContainer.querySelector(".color-groups");
const whiteContainer = colorGroup.querySelector(".whites ul");
const greyContainer = colorGroup.querySelector(".greys ul");
const testBtn = document.querySelector(".test");
var colorsRef = firestore.collection("ColorProfiles");
var whitesRef = colorsRef.where("Group", "==", "White");
var greysRef = colorsRef.where("Group", "==", "Greys");

const whitesArray = [];
console.log(`After initialization ${typeof whitesArray}`);
const greysArray = [];

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
  copyIcon.setAttribute("src", "../assets/images/copyIcon.png");
  colorBox.setAttribute("style", `background-Color: ${doc.data().CodeHex}`);

  li.appendChild(colorBox);
  li.appendChild(swatchContent);
  colorBox.appendChild(popup);

  container.appendChild(li);
}

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

  console.log(whitesArray);
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

getWhites();
getGreys();
