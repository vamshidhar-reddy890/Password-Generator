const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const passwordField = document.getElementById("password");
const strengthText = document.getElementById("strength-text");
const barFill = document.getElementById("bar-fill");
const toast = document.getElementById("toast");

lengthSlider.addEventListener("input", () => {
  lengthValue.textContent = lengthSlider.value;
});

function generatePassword() {
  const length = parseInt(lengthSlider.value, 10);
  const includeUppercase = document.getElementById("uppercase").checked;
  const includeLowercase = document.getElementById("lowercase").checked;
  const includeNumbers = document.getElementById("numbers").checked;
  const includeSymbols = document.getElementById("symbols").checked;

  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}|;:',.<>?/`~";

  let allChars = "";
  const guaranteed = [];

  if (includeUppercase) {
    allChars += upper;
    guaranteed.push(randomChar(upper));
  }
  if (includeLowercase) {
    allChars += lower;
    guaranteed.push(randomChar(lower));
  }
  if (includeNumbers) {
    allChars += numbers;
    guaranteed.push(randomChar(numbers));
  }
  if (includeSymbols) {
    allChars += symbols;
    guaranteed.push(randomChar(symbols));
  }

  if (allChars.length === 0) {
    alert("Please select at least one character type!");
    return;
  }

  const result = [...guaranteed];
  for (let i = guaranteed.length; i < length; i++) {
    result.push(randomChar(allChars));
  }

  const password = shuffle(result).join("");
  passwordField.value = password;
  evaluateStrength(password);
}

function randomChar(str) {
  return str.charAt(Math.floor(Math.random() * str.length));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function copyPassword() {
  const password = passwordField.value;
  if (!password) {
    alert("Generate a password first!");
    return;
  }

  navigator.clipboard.writeText(password).then(() => {
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 2000);
  }).catch(() => {
    alert("Failed to copy password.");
  });
}

function toggleVisibility() {
  passwordField.type = passwordField.type === "password" ? "text" : "password";
}

function evaluateStrength(pwd) {
  let score = 0;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (pwd.length >= 12) score++;

  const levels = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];
  const colors = ["#ff4d4d", "#ff944d", "#ffcc00", "#66cc66", "#33ccff"];

  strengthText.textContent = `Strength: ${levels[score - 1] || "Very Weak"}`;
  barFill.style.width = `${(score / 5) * 100}%`;
  barFill.style.backgroundColor = colors[score - 1] || "#ff4d4d";
}
