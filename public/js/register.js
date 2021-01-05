const formElement = document.getElementById("registrationForm");

const alertDiv = document.createElement("div");
alertDiv.setAttribute("role", "alert");

function buildAlert(success, msg) {
  resetAlert();
  alertDiv.classList.add(success ? "alert-success" : "alert-danger");
  alertDiv.innerHTML = msg;
  alertDiv.innerHTML += `
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
}

function resetAlert() {
  alertDiv.classList = "alert alert-dismissible fade show";
}

function getFormdata() {
  const formData = new FormData(formElement);

  const email = formData.get("email");
  const password = formData.get("password");

  return { email, password };
}

formElement.addEventListener("submit", (e) => {
  const { email, password } = getFormdata();
  // console.log(email, password);

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      // console.log("Logged in with uid" + user.uid);
      window.location.href = "/dashboard";
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      // console.log(errorCode, errorMessage);

      buildAlert(false, errorMessage);
      formElement.parentElement.insertBefore(alertDiv, formElement);
    });
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    buildAlert(true, "You are already signed in!");
    formElement.parentElement.insertBefore(alertDiv, formElement);

    // var uid = user.uid;
    // console.log("Logged in with uid: " + uid);
  } else {
    // console.log("No user is signed in");
  }
});
