
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
    header.classList.add("box");

    let header = document.createElement("h1");
    header.innerHTML = title;

    let description_div = document.createElement("div")
    description_div.classList("description");
    description_div.innerHTML = description;

    let date_div = document.createElement("div")
    date_div.classList("date");
    date_div.innerHTML = date;

    var link = document.createElement("div");
    link.classList.add("link");

    // Appends the divs to the box, and the box to the section
    box.appendChild(header)
    box.appendChild(description_div)
    box.appendChild(date_div)
    box.appendChild(link)
    section.appendChild(box)
}
