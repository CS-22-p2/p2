let button = document.getElementsByName("login");
console.log(button);
button[0].addEventListener("click", submit);

function submit(){
    let values = "";
    values += "Email = " + document.getElementsByName("mail")[0].value + "\n";
    values += "Password = " + document.getElementsByName("password")[0].value + "\n";
    alert(values);
    console.log(values);
}