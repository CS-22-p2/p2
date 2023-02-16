
function underline_current(param) {
    const current = 0;
    for (var i = 0; i <document.links.length; i++) {
        if (document.links[i].href === document.url) {
            current = i;
        }
    }
    document.links[current].className = 'active';
}
