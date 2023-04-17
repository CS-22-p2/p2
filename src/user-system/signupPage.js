let button = document.getElementsByName("button");
console.log(button);
button[0].addEventListener("click", submit);

function submit(){
    let values = "";
    values += "name = " + document.getElementsByName("name")[0].value + "\n";
    values += "lastName = " + document.getElementsByName("lastName")[0].value + "\n";
    values += "mail = " + document.getElementsByName("mail")[0].value + "\n";
    values += "password = " + document.getElementsByName("password")[0].value + "\n";
    values += "campus = " + document.getElementsByName("campus")[0].value + "\n";
    alert(values);
    console.log(values);
}