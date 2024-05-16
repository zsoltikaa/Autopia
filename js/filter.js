const filterMenu = document.querySelector(".filterMenu");

let toggle = false;

function toggleFilters() {
    toggle = !toggle;
    if (toggle) {
        filterMenu.style.display = "block";
    }
    else {
        filterMenu.style.display = "none";
    }
}

function toggleFilters() {
    const filterMenu = document.querySelector('.filterMenu');
    
    if (filterMenu.classList.contains('active')) {
        filterMenu.classList.remove('animate__fadeInDown');
        filterMenu.classList.add('animate__fadeOutUp');

        filterMenu.addEventListener('animationend', function handleAnimationEnd() {
            filterMenu.classList.remove('active', 'animate__fadeOutUp');
            filterMenu.removeEventListener('animationend', handleAnimationEnd);
        });
    } else {
        filterMenu.classList.remove('animate__fadeOutUp');
        filterMenu.classList.add('active', 'animate__fadeInDown');
    }
}
