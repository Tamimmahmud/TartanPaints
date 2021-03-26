let colors = [];
colors = [
  {
    name: "green",
    hex: "#c1e335",
  },
  {
    name: "red",
    hex: "#d09abc",
  },
  {
    name: "blue",
    hex: "#35c6e3",
  },
  {
    name: "yellow",
    hex: "#fcf56e",
  },
];
const mainContainer = document.querySelector("main div.container");
const colorGroup = mainContainer.querySelector(".color-groups");
// console.log(mainContainer);

function createColorGroup(groupName) {
  return `<div class="group ${groupName}">
    <h4>${groupName}</h4>
    <ul>
    </ul>
</div>`;
}
function renderEachColorLi(group) {
  return `                        <li>
  <div class="color-swatch ${group.ColorName}" style="background-color:${group.CodeHex}">
  </div>

    <div class="hover-popup">

    </div>
</li>`;
}
var colorsRef = firestore.collection("ColorProfiles");

var whitesRef = colorsRef.where("Group", "==", "White");
var GreysRef = colorsRef.where("Group", "==", "Greys");

var whitesArray = [];
var greysArray = [];

function getWhites() {
  whitesRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => whitesArray.push(doc.data()));
      whitesArray.forEach((whiteObj) => {
        renderEachColorLi(whiteObj);
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

let colorGList = [];
let code;
colorGList = ["Whites", "Greys", "Browns", "Purples", "Blues", "Greens"];
colorGList.forEach((colorG) => {
  code = createColorGroup(colorG);
  colorGroup.innerHTML += code;
  const colorContainerUl = colorGroup.querySelector(`div .${colorG} ul`);
  //   console.log(window["get" + colorG]());
});

getWhites();
console.log(whitesArray[0]);
const test = [{ 1: "test 1" }];
console.log(test);
console.log(typeof test);
console.log(test[0]);
