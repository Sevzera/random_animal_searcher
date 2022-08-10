const ePicture = document.getElementById("picture");
const eName = document.getElementById("name");
const eSubtext = document.getElementById("subtext");
const eDescription = document.getElementById("description");
const eFilter = document.getElementById("filter");
const eVal0 = document.getElementById("val0");
const eVal1 = document.getElementById("val1");
const eVal2 = document.getElementById("val2");
const eVal3 = document.getElementById("val3");
const eCalc0 = document.getElementById("calc0");
const eCalc1 = document.getElementById("calc1");
const eButton = document.getElementById("button");
const previousObjectsList = document.getElementById("previous-list");
const previousObjectsListItems = previousObjectsList.getElementsByTagName("li");
const loading = document.getElementById("loading");

let currentObject = { name: "Empty", image_link: "./images/empty.jpg" };
let previousObjects = [
	{ name: "Empty", image_link: "./images/empty.jpg" },
	{ name: "Empty", image_link: "./images/empty.jpg" },
	{ name: "Empty", image_link: "./images/empty.jpg" },
];

async function getData() {
	const result = await fetch(
		"https://zoo-animal-api.herokuapp.com/animals/rand"
	);
	const data = await result.json();
	console.log(data);
	return data;
}

function updateCurrentObject(object) {
	currentObject = object;
	currentObject.length_max = Number(currentObject.length_max);
	currentObject.length_min = Number(currentObject.length_min);
	currentObject.weight_max = Number(currentObject.weight_max);
	currentObject.weight_min = Number(currentObject.weight_min);
}

function updatePreviousList() {
	previousObjects.shift();
	previousObjects.push(currentObject);
}

function showPreviousObjects() {
	for (let i = 0; i < previousObjects.length; i++) {
		previousObjectsListItems[i].getElementsByClassName(
			"previous-picture"
		)[0].src = previousObjects[i].image_link;
		previousObjectsListItems[i].getElementsByClassName(
			"previous-name"
		)[0].innerHTML = previousObjects[i].name;
	}
}

function showNewObjects() {
	ePicture.src = currentObject.image_link;
	ePicture.onload = () => {
		eName.innerHTML = currentObject.name;
		eSubtext.innerHTML = currentObject.animal_type;
		eDescription.innerHTML = "Lives in " + currentObject.habitat.toLowerCase();
		eVal0.innerHTML = "Latin name: " + currentObject.latin_name;
		eVal1.innerHTML = "Diet: " + currentObject.diet.toLowerCase();
		eVal2.innerHTML = "Active time: " + currentObject.active_time;
		eVal3.innerHTML = "Lifespan: " + currentObject.lifespan + " years";
		let medianLengthValue = (
			((currentObject.length_max + currentObject.length_min) / 2) *
			0.3048
		).toFixed(2);
		eCalc0.innerHTML = "Median length: " + medianLengthValue + "m";
		let medianWeightValue = (
			((currentObject.weight_max + currentObject.weight_min) / 2) *
			0.453592
		).toFixed(2);
		eCalc1.innerHTML = "Median weight: " + medianWeightValue + "kg";
		showPreviousObjects();
		loading.classList.add("hidden");
	};
}

async function btnHandler() {
	loading.classList.remove("hidden");
	updatePreviousList();
	try {
		let nextObject;
		eButton.disabled = true;
		if (eFilter.value === "all") {
			nextObject = await getData();
		} else {
			do nextObject = await getData();
			while (nextObject.animal_type.toLowerCase() !== eFilter.value);
		}
		updateCurrentObject(nextObject);
		eButton.disabled = false;
	} catch (error) {
		console.log(error);
	}
	showNewObjects();
}

eButton.addEventListener("click", btnHandler);
for (let i = 0; i < previousObjects.length; i++) {
	previousObjectsListItems[i]
		.getElementsByClassName("previous-picture")[0]
		.addEventListener("click", (event) => {
			if (event.target.src.includes("empty")) return;
			let selectedObject = previousObjects[event.target.attributes.index.value];
			updatePreviousList();
			updateCurrentObject(selectedObject);
			showNewObjects();
		});
}

(async () => {
	btnHandler();
})();
