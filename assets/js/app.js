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

  let popupColorName = document.createElement("span");
  let popupColorCode = document.createElement("span");
  popupColorName.innerText = `${doc.data().ColorName}`;
  popupColorCode.innerText = `${doc.data().CodeHex}`;
  popup.classList.add("colorPopup");
  popup.appendChild(popupColorName);
  popup.appendChild(popupColorCode);

  li.setAttribute("style", `background-Color: ${doc.data().CodeHex}`);
  li.appendChild(popup);

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

const test = [{ 1: "test 1" }];
console.log(test);
console.log(typeof test);
