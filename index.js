const generateButton = document.querySelector("button");
const passwordDisplay = document.getElementById("passwordDisplay");
const charLength = document.getElementById("charLength");
const charLengthDisplay = document.getElementById("charLengthDisplay");
const includeUpper = document.getElementById("includeUpper");
const includeLower = document.getElementById("includeLower");
const includeNumbers = document.getElementById("includeNumbers");
const includeSymbols = document.getElementById("includeSymbols");

function initializePage() {
    includeUpper.checked = false;
    includeLower.checked = false;
    includeNumbers.checked = false;
    includeSymbols.checked = false;
    updatePassword();
}

function updatePassword() {
    const password = generatePassword(
        parseInt(charLength.value),
        includeUpper.checked,
        includeLower.checked,
        includeNumbers.checked,
        includeSymbols.checked
    );

    passwordDisplay.textContent = password || "";

    if (password && (includeLower.checked || includeUpper.checked || includeNumbers.checked || includeSymbols.checked)) {
        const strength = checkPasswordStrength(password, includeSymbols.checked);
        updateStrengthIndicators(strength);
    } else {
        updateStrengthIndicators(null);
    }
}

window.addEventListener("load", initializePage);

generateButton.addEventListener("click", function() {
    const checkboxes = [includeUpper, includeLower, includeNumbers, includeSymbols];

    if (!checkboxes.some(checkbox => checkbox.checked)) {
        alert("Please choose at least one of the criteria.");
        return
    }
    
    updatePassword();
});

charLength.addEventListener("input", updateCharLength);


function updateCharLength() {
    charLengthDisplay.textContent = charLength.value;
}

const copyButton = document.getElementById("copyButton");

copyButton.addEventListener("click", function() {
    const password = passwordDisplay.textContent.trim();

    if (password) {
        const range = document.createRange();
        range.selectNode(passwordDisplay);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        try {
            const successful = document.execCommand("copy");
            const message = successful ? "Password copied!" : "Unable to copy password";
            alert(message);
        } catch (err) {
            alert("Unable to copy password: " + err);
        }

        window.getSelection().removeAllRanges();
    } else {
        alert("Please generate a password.");
    }
});

function updateStrengthIndicators(strength) {
    const strengthContainer = document.querySelector(".strength-container p");
    const strengthIndicators = document.querySelectorAll(".strength-indicator");

    strengthIndicators.forEach(indicator => {
        indicator.style.backgroundColor = "inherit";
    });

    if (strength === "great") {
        strengthContainer.textContent = "Great";
        strengthIndicators.forEach(indicator => {
            indicator.style.backgroundColor = "#00FF00";
        });
    } else if (strength === "good") {
        strengthContainer.textContent = "Good";
        for (let i = 0; i < 3; i++) {
            strengthIndicators[i].style.backgroundColor = "#4abea0";
        }
    } else if (strength === "medium") {
        strengthContainer.textContent = "Medium";
        for (let i = 0; i < 2; i++) {
            strengthIndicators[i].style.backgroundColor = "#ffa257";
        }
    } else if (strength === "weak") {
        strengthContainer.textContent = "Weak";
        strengthIndicators[0].style.backgroundColor = "red";
    } else {
        strengthContainer.textContent = "";
    }
}

function generatePassword(length, includeUpper, includeLower, includeNumbers, includeSymbols) {
    let charset = "";

    if (includeLower) {
        charset += "abcdefghijklmnopqrstuvwxyz";
    }

    if (includeUpper) {
        charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }

    if (includeNumbers) {
        charset += "1234567890";
    }

    if (includeSymbols) {
        charset += "+!?@#%&().:-_";
    }

    if (!charset) {
        return null;
    }

    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }

    return password;
}

function checkPasswordStrength(password, includeSymbols) {
    const criteriaMet = [
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
        /\d/.test(password),
        /[+!?@#%&().:-_]/.test(password) && includeSymbols
    ].filter(Boolean).length;

    if (criteriaMet === 0) {
        return null;
    } else if (criteriaMet === 1) {
        return "weak";
    } else if (criteriaMet === 2) {
        return "medium";
    } else if (criteriaMet === 3) {
        return "good";
    } else {
        return "great";
    }
}