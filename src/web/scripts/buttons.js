
function underline_current(param) {
    const current = 0;
    for (var i = 0; i <document.links.length; i++) {
        if (document.links[i].href === document.url) {
            current = i;
        }
    }
    document.links[current].className = 'active';
}

const appear = document.querySelector('.fade-in-animation'); 
const cb = function(entries){
    entries.forEach(entry => {
        if(entry.isIntersecting){
        entry.target.classList.add('inview');
        }else{
        entry.target.classList.remove('inview');
        }
});
}
const io = new IntersectionObserver(cb);
io.observe(appear);
