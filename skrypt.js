document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    // Obsługa menu mobilnego (hamburger)
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Zmiana ikony hamburgera na X i odwrotnie
        if (navLinks.classList.contains('active')) {
            menuToggle.textContent = '✕';
        } else {
            menuToggle.textContent = '☰';
        }
    });
});