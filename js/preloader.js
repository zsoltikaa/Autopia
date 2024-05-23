document.addEventListener('DOMContentLoaded', function() {
    let progressBar = document.getElementById('progress-bar');
    let preLoader = document.getElementById('preloader');
    let width = 0;

    function simulateLoading() {
        if (width >= 100) {
            clearInterval(interval);
            preLoader.style.display = 'none';
            content.style.opacity = '1';
        } else {
            width += 10;
            progressBar.style.width = width + '%';
        }
    }

    if(!sessionStorage.getItem("shouldPreLoader")){
        preLoader.style.display = 'flex';

        var interval = setInterval(simulateLoading, 120);

        sessionStorage.setItem("shouldPreLoader", true);
    } else{
        preLoader.style.display = 'none';
    }
    
});