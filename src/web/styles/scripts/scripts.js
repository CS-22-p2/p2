
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

window.addEventListener('load', function (event_wrapper) {
    
})

class event_wrapper{
    constructor(events_arr) {
        this.events_arr = events_arr;
        this.wrapper_length = events_arr.length;
    }
    
    call_function() {
        for (let i = 0; i < this.wrapper_length; i++) {
            create_section(title = this.events_arr[i].title, description = this.events_arr[i].description, this.events_arr[i].date, this.events_arr[i].participants, this.events_arr[i].link);
        }
    }
}
