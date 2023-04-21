import { json } from "stream/consumers";

let button = document.getElementsByName("login");
console.log(button);
button[0].addEventListener("click", submit);

const url = '/path/to/resource';

function submit(){
    let values = "";
    values += "Email = " + document.getElementsByName("mail")[0].value + "\n";
    values += "Password = " + document.getElementsByName("password")[0].value + "\n";
    alert(values);
    console.log(values);

    let data = {Email: document.getElementsByName("mail")[0].value,
                         Password: document.getElementsByName("password")[0].value};

    fetch(url, {
        method: "put",
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
    }).then(response => {
        console.log('PUT request successful');
    }).catch(error => {
        console.error('Error sending PUT request:', error);
    });
}