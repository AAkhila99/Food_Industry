// function menu_open() {
//     console.log("w3_open function called");
//     document.getElementById("main").style.marginLeft = "25%";
//     document.getElementById("mySidebar").style.width = "25%";
//     document.getElementById("mySidebar").style.display = "block";
//     document.getElementById("openNav").style.display = 'none';
//     // Your existing code here
// }

// function menu_close() {
//     console.log("w3_close function called");
//     document.getElementById("main").style.marginLeft = "0%";
//     document.getElementById("mySidebar").style.display = "none";
//     document.getElementById("openNav").style.display = "inline-block";
//     // Your existing code here
// }

function menu_toggle() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}