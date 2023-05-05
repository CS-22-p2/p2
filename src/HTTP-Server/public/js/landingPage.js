
//Executed code
const idArray = ["#EventTitle", "#Location", "#Date",
  "#Participants", "#Host", "#Link", "#DescriptionBox", "#Category"];

let events = [];

let parent = document.querySelector('#FlexBoxWrapper');
let template = document.querySelector("#FlexBox");
let elem = parent.querySelector('.elem');
let homeButton = document.querySelector('#homePage');
let favoritesButton = document.querySelector('#favoritesPage');
let loginButton = document.querySelector('#loginPage');
let categoryForm = document.querySelector('#categoryForm');


homeButton.addEventListener('click', goToPage);
favoritesButton.addEventListener('click', goToPage);
loginButton.addEventListener('click', goToPage);
categoryForm.addEventListener('click', sortHandler);

fetch('/getEvents', { method: 'GET' })
  .then(response => response.json())
  .then(data => {
    eventInitializer(data);
    changeColor();
  })
  .catch(error => console.error(error));

//Removes the generic template the events are based on
template.remove();

//---------------------------------------------------------------------

function eventInitializer(eventData) {
  for (let event of eventData) {
    createEvent(event);
  }
}

function createEvent(eventObject, templateElement) {
  //The date is made simple into the format month/day/year
  let clone;
  const readableDateFormat = new Intl.DateTimeFormat("en-us", { dateStyle: "full" });
  let processedDate = readableDateFormat.format(new Date(eventObject.eventDate))

  if(templateElement === undefined){
    clone = template.cloneNode(true);
  }else clone = templateElement.cloneNode(true);

  clone.dataset.eventid = eventObject._id;
  clone.querySelector("#EventTitle").innerText = eventObject.eventTitle;
  clone.querySelector("#Location").innerText = eventObject.eventLocation;
  clone.querySelector("#Date").innerText = processedDate;
  clone.querySelector("#Participants").innerText = eventObject.eventParticipants;
  clone.querySelector("#Host").innerText = eventObject.orgName;
  clone.querySelector("#Link").href = eventObject.eventLink;
  clone.querySelector("#ImageLink").src = eventObject.eventImage;
  clone.querySelector("#DescriptionBox").innerText = eventObject.eventDescription;
  clone.querySelector("#Category").innerText = eventObject.eventCategories.toString().toUpperCase();
  clone.querySelector("#RelevanceScore").innerText = eventObject.relevancyScore;
  checkExistance(clone, idArray);
  parent.appendChild(clone);
}

function checkExistance(node, idArray) {
  for (let id of idArray) {
    //Removes all undefined elements in the TextBox
    if (node.querySelector(id).innerText === "") {
      node.querySelector(id).parentElement.remove();
    }
  }
  //Removes unwanted descriptions
  if (node.querySelector("#DescriptionBox").innerText === "") {
    node.querySelector("#DescriptionBox").remove();
  }
}

function goToPage(event) {
  let url = "";

  switch (event.target.innerText) {
    case 'Home':
      url = "../html/landingPage.html"
      break;
    case 'Favorites':
      url = "../html/favoritesPage.html"
      break;
    case 'Login':
      url = "../html/loginPage.html"
      break;
  }

  window.location.href = url;
}

function changeColor() {
  // Gets all the favorite "buttons"
  const favoriteButtons = document.querySelectorAll('#fLogo');

  // for each of the favorite "buttons" this adds a function which 
  // updates the color of the button to the opposite color, from grey to yellow and back.
  for (let i = 0; i < favoriteButtons.length; i++) {
    favoriteButtons[i].style.backgroundColor = "rgb(159, 175, 166)";
    favoriteButtons[i].addEventListener('click', (event) => {
      if (event.target.style.backgroundColor == "rgb(159, 175, 166)") {
        event.target.style.backgroundColor = "rgb(255, 215, 0)";
      } else {
        event.target.style.backgroundColor = "rgb(159, 175, 166)";
      }
    });
    favoriteButtons[i].addEventListener('click', favoriteEvent);
  }
}

function sortHandler(event) {
  let selectedOption = event.target.id.toString();
  let templateBox = document.querySelector("#FlexBox");

  fetch('/sortedEvents', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(selectedOption)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.events);
    eventInitializer(data.events, templateBox);
  })
  .catch(error => console.log(`Network error occured ${error}`));
}

function favoriteEvent(event) {
  document.cookie = "username=John Doe";
  let cookies = document.cookie;
  let userCookie = getUserCookie(cookies);
  let objCookie = JSON.parse(userCookie);

  let data = {
    type: "favorite",
    userId: objCookie.userId,
    eventId: event.target.parentElement.parentElement.parentElement.dataset.eventid
  }

  fetch("/", {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    let res = response.json()
    return res;
  }).catch((res) => {
    console.log(res);
  });
}

function getUserCookie(cookies) {
  let c = cookies.split(";");
  for (let i = 0; i < c.length; i++) {
    if (c[i].includes("currentUser")) {
      return c[i].split("=")[1];
    }
  }
}