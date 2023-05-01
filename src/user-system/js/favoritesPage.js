let homeButton = document.querySelector('#homePage');
let favoritesButton = document.querySelector('#favoritesPage');
let loginButton = document.querySelector('#loginPage');

homeButton.addEventListener('click', goToPage);
favoritesButton.addEventListener('click', goToPage);
loginButton.addEventListener('click', goToPage);

function goToPage(event)
{
  let url = "";

  switch(event.target.innerText)
  {
    case 'Home':
      url = "../html/landingPage.html"
      break;
    case 'Favorites':
      url = "../html/favoritesPage.html"
      break;
    case 'Login':
      console.log("login");
      break;
  }

  window.location.href = url;
}