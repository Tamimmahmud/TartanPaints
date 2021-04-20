const mainContainer = document.querySelector("main div.container");
const colorGroup = mainContainer.querySelector(".color-groups");
const whiteContainer = colorGroup.querySelector(".whites ul");
const greyContainer = colorGroup.querySelector(".greys ul");
const testBtn = document.querySelector(".test");
let colorsRef = firestore.collection("colorProfiles");
let whitesRef = colorsRef.where("Group", "==", "Whites");
let greysRef = colorsRef.where("Group", "==", "Greys");

const colorDemoPopup = document.querySelector(".colorDemoPopup");
const colorSolid = document.querySelector(".colorSolid");
let colorDemoCName = document.querySelector(".colorDetails #colorName");
let colorDemoCHex = document.querySelector(".colorDetails #colorCode");
let colorDemoImg = document.querySelector(".demoImg img");

const copiedPopup = document.querySelector(".copiedPopUp");
const whitesArray = [];
const greysArray = [];
let greys;

let colorSwatchesArray = [];
const otherColorsUl = document.querySelector("ul.otherColorsUl");

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
  colorBox.setAttribute("data-imgLink", `${doc.data().ImgLink}`);
  li.setAttribute("data-colorName", `${doc.data().ColorName}`);
  li.appendChild(colorBox);
  li.appendChild(swatchContent);
  colorBox.appendChild(popup);

  container.appendChild(li);

  function renderColorList(container, doc) {
    let li = document.createElement("li");
    let popup = document.createElement("div");
    let colorBox2 = document.createElement("div");
    let popupColorName = document.createElement("span");
    let popupColorCode = document.createElement("span");
    popupColorName.innerText = `${doc.ColorName}`;
    popupColorCode.innerText = `${doc.CodeHex}`;

    colorBox2.classList.add("color-swatch");

    popup.classList.add("colorPopup");
    popup.appendChild(popupColorName);
    popup.appendChild(popupColorCode);
    colorBox2.setAttribute("style", `background-color: ${doc.CodeHex}`);
    colorBox2.setAttribute("data-colorHex", `${doc.CodeHex}`);
    colorBox2.setAttribute("data-imgLink", `${doc.ImgLink}`);
    li.setAttribute("data-colorName", `${doc.ColorName}`);
    li.appendChild(colorBox2);
    colorBox2.appendChild(popup);
    container.appendChild(li);

    colorBox2.addEventListener("click", (e) => {
      let colorHex = e.target.getAttribute("data-colorHex");
      let colorName = e.target.parentElement.getAttribute("data-colorName");
      let imgLink = e.target.getAttribute("data-imgLink");
      container.innerHTML = "";
      colorDemoSetup(colorHex, colorName, imgLink, doc);
    });
  }

  // Generate content inside color Demo Popup
  function colorDemoSetup(colorHex, colorName, imgLink, colorObj) {
    let thisColorObject = colorObj; // ***
    console.log(thisColorObject);
    let resultArray = [];

    // finds if selected color is found in any of the colorGroups
    // when found, it renders the color boxes for the REMAINGING colors in the array
    function findInArray(arr, color) {
      const result = arr.find(({ docKey }) => docKey === color.docKey); // finds if array 'arr' has an object of key docKey, with value color.docKey (returns boolean)
      if (result) {
        resultArray = arr.filter(({ docKey }) => docKey != color.docKey);
        // GENERATE BOXES HERE
        resultArray.forEach((item) => renderColorList(otherColorsUl, item));
      } else {
        console.log("not found in array");
      }
    }
    findInArray(whitesArray, colorObj);
    findInArray(greysArray, colorObj);
    colorSolid.setAttribute("style", `background-color: ${colorHex}`);
    colorDemoCHex.innerText = `${colorHex}`;
    colorDemoCName.innerText = colorName;
    colorDemoImg.setAttribute("src", `${imgLink}`);
  }

  const blackScreen = document.querySelector(".black-screen");
  const colorDemoCloseBtn = document.querySelector(".colorDemoPopup .closeBtn");

  // Load colorDemo Popup
  function colorDemoLoad(colorHex, colorName, imgLink, colorObj) {
    if (!colorDemoPopup.classList.contains("active")) {
      colorDemoPopup.classList.add("active");
      blackScreen.classList.toggle("active");
    }
    colorDemoSetup(colorHex, colorName, imgLink, colorObj);
  }
  // Close color Demo Popup
  function colorDemoClose() {
    if (colorDemoPopup.classList.contains("active")) {
      colorDemoPopup.classList.remove("active");
      blackScreen.classList.toggle("active");
    }
  }

  colorDemoCloseBtn.addEventListener("click", () => {
    colorDemoClose();
  });

  colorBox.addEventListener("click", (e) => {
    let colorHex = e.target.getAttribute("data-colorHex");
    let colorName = e.target.parentElement.getAttribute("data-colorName");
    let imgLink = e.target.getAttribute("data-imgLink");
    otherColorsUl.innerHTML = "";
    colorDemoLoad(colorHex, colorName, imgLink, doc.data());
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
}

async function getGreys() {
  greysRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        greysArray.push(doc.data());
        renderColorSwatch(doc, greyContainer);
      });
    })
    .then(() => {
      greys = greysArray;
      return greys;
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

const getGreys2 = async () => {
  let greysArray2 = await greysRef.get().then((docs) => {
    docs.forEach((doc) => {
      greysArray.push(doc.data());
      renderColorSwatch(doc, greyContainer);
    });
  });
};

getGreys2();
getWhites();
