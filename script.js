function reload() {
    window.location.href = "https://www.maleka.dev/";
    style.setAttribute("href", "style.css");
}

var style = document.getElementById("stylesheet");
function showSection(section) {
    const sections = [
        { name: "aboutMe", block: "aboutMeBlock", button: "aboutMeButton" },
        { name: "projects", block: "projectsBlocks", button: "projectsButton" },
        { name: "contact", block: "contactBlock", button: "contactButton" },
        { name: "hireme", block: "hiremeBlock", button: "hiremeButton" }
    ];

    sections.forEach(s => {
        const block = document.getElementById(s.block);
        const button = document.getElementById(s.button);
        const img1 = document.getElementById("imgsubp");
        const img2 = document.getElementById("imgmainp");
        if (s.name === section) {
            block.style.display = "block";
            button.className = "btn-sellected";
            img1.style.display = "none"; img2.style.display = "block";
        } else {
            block.style.display = "none";
            button.className = "btn";
        }
    });

    // Apply style change and hide logo
    document.getElementById("i-lookingforlogo").style.display = "none";
    style.setAttribute("href", "style2.css");
}
