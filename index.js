// Helper function to show error message
function showError(message, element) {
  const errorDisplay = document.getElementById("errorDisplay");
  errorDisplay.style.display = "block";
  errorDisplay.innerHTML = message;

  // Focus on the first invalid input element
  if (element) {
    element.focus();
  }
}

// Hide error display
function hideError() {
  const errorDisplay = document.getElementById("errorDisplay");
  errorDisplay.style.display = "none";
}

// Function to highlight the error in the input field
function highlightError(element) {
  element.style.border = "2px solid red";
  element.style.backgroundColor = "#f8d7da"; // light red background
}

// Function to clear error highlight
function clearHighlightError(element) {
  element.style.border = "1px solid #888"; // default border
  element.style.backgroundColor = ""; // reset background color
}

// Registration form validation logic
function validateRegistrationForm(event) {
  event.preventDefault();

  // Get form data
  const form = event.target;
  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const passwordCheck = form.passwordCheck.value;
  const terms = form.terms.checked;

  // Start with no error message
  let errorMessage = "";
  let firstInvalidElement = null;

  // Validate username
  const usernameError = isUsernameValid(username);
  if (usernameError) {
    errorMessage = usernameError;
    firstInvalidElement = form.username;
    highlightError(form.username);
  } else {
    clearHighlightError(form.username);
  }

  // Validate email
  if (!errorMessage) {
    const emailError = isEmailValid(email);
    if (emailError) {
      errorMessage = emailError;
      firstInvalidElement = form.email;
      highlightError(form.email);
    } else {
      clearHighlightError(form.email);
    }
  }

  // Validate password
  if (!errorMessage) {
    const passwordError = isPasswordValid(password, username);
    if (passwordError) {
      errorMessage = passwordError;
      firstInvalidElement = form.password;
      highlightError(form.password);
    } else {
      clearHighlightError(form.password);
    }
  }

  // Validate password check
  if (!errorMessage && password !== passwordCheck) {
    errorMessage = "Passwords do not match.";
    firstInvalidElement = form.passwordCheck;
    highlightError(form.passwordCheck);
  } else {
    clearHighlightError(form.passwordCheck);
  }

  // Validate terms and conditions
  if (!errorMessage && !terms) {
    errorMessage = "You must accept the terms and conditions.";
    firstInvalidElement = form.terms;
    highlightError(form.terms);
  }

  // If there's an error, prevent form submission and show error messages
  if (errorMessage) {
    showError(errorMessage, firstInvalidElement);
  } else {
    // Store the user data in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
    });
    localStorage.setItem("users", JSON.stringify(users));

    // Clear the form
    form.reset();

    // Show success message
    document.getElementById("successMessage").style.display = "block";
    document.getElementById("successMessage").innerHTML =
      "<strong>Success!</strong> You have successfully registered.";
    setTimeout(
      () => (document.getElementById("successMessage").style.display = "none"),
      5000
    );
  }
}

// Function to check username validity
function isUsernameValid(username) {
  if (!username) return "Username cannot be blank.";
  if (username.length < 4)
    return "Username must be at least 4 characters long.";
  if (!/^[a-zA-Z0-9]+$/.test(username))
    return "Username cannot contain special characters or spaces.";
  const uniqueChars = new Set(username);
  if (uniqueChars.size < 2)
    return "Username must contain at least two unique characters.";
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some((user) => user.username === username.toLowerCase()))
    return "Username is already taken.";
  return "";
}

// Function to check email validity
function isEmailValid(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!email) return "Email cannot be blank.";
  if (!emailRegex.test(email)) return "Please enter a valid email address.";
  if (email.endsWith("example.com"))
    return 'Email cannot be from the domain "example.com".';
  return "";
}

// Function to check password validity
function isPasswordValid(password, username) {
  if (password.length < 12)
    return "Password must be at least 12 characters long.";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password))
    return "Password must contain at least one uppercase and one lowercase letter.";
  if (!/\d/.test(password)) return "Password must contain at least one number.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Password must contain at least one special character.";
  if (/password/i.test(password))
    return 'Password cannot contain the word "password".';
  if (password.toLowerCase().includes(username.toLowerCase()))
    return "Password cannot contain your username.";
  return "";
}

// Login form validation logic
function validateLoginForm(event) {
  event.preventDefault();

  // Get form data
  const form = event.target;
  const username = form.username.value.trim();
  const password = form.password.value;
  const keepLoggedIn = form.persist.checked;

  // Start with no error message
  let errorMessage = "";
  let firstInvalidElement = null;

  // Validate username
  if (!username) {
    errorMessage = "Username cannot be blank.";
    firstInvalidElement = form.username;
    highlightError(form.username);
  } else {
    // Check if username exists in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((user) => user.username === username.toLowerCase());

    if (!user) {
      errorMessage = "Username does not exist.";
      firstInvalidElement = form.username;
      highlightError(form.username);
    } else {
      clearHighlightError(form.username);

      // Validate password
      if (!password) {
        errorMessage = "Password cannot be blank.";
        firstInvalidElement = form.password;
        highlightError(form.password);
      } else if (password !== user.password) {
        errorMessage = "Incorrect password.";
        firstInvalidElement = form.password;
        highlightError(form.password);
      } else {
        clearHighlightError(form.password);
      }
    }
  }

  // If there's an error, prevent form submission and show error messages
  if (errorMessage) {
    showError(errorMessage, firstInvalidElement);
  } else {
    // Clear form fields
    form.reset();

    // Show success message
    let successMessage = "Login successful!";
    if (keepLoggedIn) {
      successMessage = "Login successful! You will stay logged in.";
    }

    document.getElementById("successMessage").style.display = "block";
    document.getElementById(
      "successMessage"
    ).innerHTML = `<strong>Success!</strong> ${successMessage}`;

    setTimeout(
      () => (document.getElementById("successMessage").style.display = "none"),
      5000
    );
  }
}

// Event listeners for form submissions
document
  .getElementById("registration")
  .addEventListener("submit", validateRegistrationForm);
document.getElementById("login").addEventListener("submit", validateLoginForm);
