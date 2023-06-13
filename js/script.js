const buttonDropdown = document.querySelector(".button_header");
const menuDropdown = document.querySelector(".menu_header");

buttonDropdown.addEventListener("click", ()=> menuDropdown.classList.toggle("active"));

function copyToClipboard(email) {
    const el = document.createElement('textarea');
    el.value = email;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    var tooltip = document.getElementById("tooltip");
    tooltip.classList.add("show");
    
    setTimeout(function() {
        tooltip.classList.remove("show");
    }, 1000);
  }
  
  
  
  
 