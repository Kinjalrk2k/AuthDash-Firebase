const userEmailSpan = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");
const secretForm = document.getElementById("secretForm");
const secretInput = document.getElementById("secretInput");

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

function stopLoading() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("mainContainer").style.display = "block";
}

function startLoading() {
  document.getElementById("loader").style.display = "flex";
  document.getElementById("mainContainer").style.display = "none";
}

function writeDB(userId, secret) {
  return firebase
    .database()
    .ref("/" + userId)
    .set({
      secret,
    });
}

function readDB(userId) {
  return firebase
    .database()
    .ref("/" + userId)
    .once("value")
    .then((snapshot) => snapshot.val())
    .catch((err) => console.log(err));
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    console.log("Logged in with uid: " + uid);
    console.log(user.email);
    userEmailSpan.innerHTML = user.email;

    readDB(user.uid).then((data) => {
      console.log(data);
      secretInput.value = data.secret;

      stopLoading();
    });
  } else {
    window.location.href = "/";
    console.log("No user is signed in");
  }
});

logoutBtn.addEventListener("click", (e) => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "/";
    })
    .catch((error) => {
      buildAlert(false, "Couldn't log out out!");
      secretForm.parentElement.insertBefore(alertDiv, secretForm);
    });
});

function getSecretFormdata() {
  const formData = new FormData(secretForm);

  const secret = formData.get("secret");

  return secret;
}

secretForm.addEventListener("submit", (e) => {
  startLoading();
  var user = firebase.auth().currentUser;
  var secret = getSecretFormdata();

  console.log(user.uid, secret);

  writeDB(user.uid, secret)
    .then(() => {
      secretInput.value = secret;
      buildAlert(true, "Your secret was secretly saved!");
      secretForm.parentElement.insertBefore(alertDiv, secretForm);
    })
    .catch((err) => {
      console.log(err);
      buildAlert(false, "There was an error saving the data!");
      secretForm.parentElement.insertBefore(alertDiv, secretForm);
    })
    .finally(() => {
      stopLoading();
    });
});
