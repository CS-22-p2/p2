
function underline_current(param) {
    const current = 0;
    for (var i = 0; i <document.links.length; i++) {
        if (document.URL[i].href === document.url) {
            current = i;
        }
    }
    document.links[current].className = 'active';
}

// Fade images in on scroll
let imageBundle = document.querySelector('#image-bundle');
let observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        let images = document.querySelectorAll('#image-bundle img');
        images.forEach(image => {
            let opacity = 0;
            let intervalID = setInterval(() => {
                opacity += 0.1;
                image.style.opacity = opacity;
                if (opacity >= 1) clearInterval(intervalID);
            }, 50);
        });
        observer.disconnect();
    }
});
observer.observe(imageBundle);

// Show the button when the user scrolls down 20px from the top of the document
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("topButton").style.display = "block";
  } else {
    document.getElementById("topButton").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
document.getElementById("topButton").addEventListener("click", function() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});
