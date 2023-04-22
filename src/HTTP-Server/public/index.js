let loginBtn = document.getElementsByName("login");
let signUpBtn = document.getElementsByName("signUp");

function changePage(name) {
    let url = "";

    switch (name) {
        case "login":
            url = "/loginPage.html"
            break;
        case "signUp":
            url = "/signUpPage.html"
            break;
        default:
            break;
    }

    window.location.href = url;
}

function login() {
    console.log("Login");

    url += "loginPage.html"

    window.location.href = url;

    url = "/";
}

function signUp() {
    console.log("Sign Up");

    url += "loginPage.html"

    window.location.href = url;

    url = "/";
}