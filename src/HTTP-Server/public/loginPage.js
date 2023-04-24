let button = document.getElementsByName("login");
console.log(button);
button[0].addEventListener("click", submit);

function submit(){
    let values = "";
    values += "Email = " + document.getElementsByName("mail")[0].value + "\n";
    values += "Password = " + document.getElementsByName("password")[0].value + "\n";
    alert(values);
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
        console.log('PUT request successful');
        // Forward the user to the landing page
    }).catch(error => {
        console.error('Error sending PUT request:', error);
    });
}