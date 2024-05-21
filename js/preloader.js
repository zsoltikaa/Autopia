document.addEventListener('DOMContentLoaded', function() {
    let progressBar = document.getElementById('progress-bar');
    let width = 0;

    function simulateLoading() {
        if (width >= 100) {
            clearInterval(interval);
            document.getElementById('preloader').style.display = 'none';
            content.style.opacity = '1';
        } else {
            width += 10;
            progressBar.style.width = width + '%';
        }
    }

    let interval = setInterval(simulateLoading, 120);
});