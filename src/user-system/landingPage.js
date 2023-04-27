let parent = document.querySelector('#FlexBoxWrapper');
let elem = parent.querySelector('.elem');

for (let index = 0; index < 40; index++) {
    let clone = elem.cloneNode(true);
    parent.appendChild(clone);

}

