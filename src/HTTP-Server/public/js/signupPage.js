let button = document.getElementsByName("button");
console.log(button);
button[0].addEventListener("click", submit);

async function submit(){
    let values = "";
    
    values += "name = " + document.getElementsByName("name")[0].value + "\n";
    values += "lastName = " + document.getElementsByName("lastName")[0].value + "\n";
    values += "mail = " + document.getElementsByName("mail")[0].value + "\n";
    values += "password = " + document.getElementsByName("password")[0].value + "\n";
    values += "campus = " + document.getElementsByName("campus")[0].value + "\n";
    alert(values);
    console.log(values);

    const url = '/';
    
    let name = document.getElementsByName("name")[0].value;
    let lastName = document.getElementsByName("lastName")[0].value;
    let email = document.getElementsByName("mail")[0].value;
    let password = document.getElementsByName("password")[0].value;
    let campus = document.getElementsByName("campus")[0].value;
    
    let data = {
        type: "signUp",
        name: name,
        lastName: lastName,
        email: email,
        password: password,
        campus: campus
    }
    console.log(data);
    
    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        console.log('PUT request successful');
        
        window.location.href = "landingPage.html";
    }).catch(error => {
        console.error('Error sending PUT request:', error);
    });
}