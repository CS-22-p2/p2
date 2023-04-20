
function underline_current(param) {
    const current = 0;
    for (var i = 0; i <document.links.length; i++) {
        if (document.URL[i].href === document.url) {
            current = i;
        }
    }
    document.links[current].className = 'active';
}


function create_section(title, description, date, participants, link) {
    let section = document.createElement("section");
    section.classList.add("section");

    let box = document.createElement("div");
    box.classList.add("box");

    let header = document.createElement("h1");
    header.innerHTML = title;

    let description_div = document.createElement("div")
    description_div.classList.add("description");
    description_div.innerHTML = description;

    let date_div = document.createElement("div")
    date_div.classList.add("date");
    date_div.innerHTML = date;

    let link_div = document.createElement("div");
    link_div.classList.add("link");

    // Appends the divs to the box, and the box to the section, and the section the the body
    box.appendChild(header);
    box.appendChild(description_div);
    box.appendChild(date_div);
    box.appendChild(link_div);
    section.appendChild(box);
    document.body.appendChild(section);
}

window.addEventListener('load', function () {
    for (let i = 0; i < 5; i++){
        create_section(title = "Hello", "kjasnajsd", "2013 - 12 - 12", 112, "https://www.javatpoint.com/how-to-call-javascript-function-in-html");
    }
})
