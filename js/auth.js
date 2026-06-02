// INITIALIZE ICONS
lucide.createIcons();

// firstname
// lastname
// registerEmail
// registerPassword
// confirmPassword
// termsServices

let errorElements = [];

getElById("registerBtn").addEventListener("click", e => {
    console.log("clicked")
    validateRegisterForm();
});

function getElById(id) {
    return document.getElementById(id);
}

function elementSelector(classname) {
    classname = "." + classname;
    return document.querySelector(classname);
}

function renderErrors() {
    for(let el of errorElements) {
        el.style.visibility = "visible"
    }
}

function validateRegisterForm() {
    if(!getElById("firstname").value) {
        
    } else {
        console.log(getElById("firstname").value);
    }
}