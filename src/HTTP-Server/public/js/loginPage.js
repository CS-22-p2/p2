let button = document.getElementsByName("login");
button[0].addEventListener("click", submit);

function submit(){
    let values = "";
    values += "Email = " + document.getElementsByName("mail")[0].value + "\n";
    values += "Password = " + document.getElementsByName("password")[0].value + "\n";

    console.log(values);

    let email = document.getElementsByName("mail")[0].value;
    let password = document.getElementsByName("password")[0].value;
    
    const url = '/';
    
    let data = {
        type: "login",
        email:  email,
        password: password
    };

    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let res = response.json()
        return res;
    }).then((res) => {
        document.cookie = `${res.cookie.cookieName}=${res.cookie.cookieValue};` +
        `max-age=${res.cookie.cookieOptions.maxAge};`;

        window.location.href = "landingPage.html";
    }).catch(error => {
        console.error('Error sending PUT request:', error);
    });
}