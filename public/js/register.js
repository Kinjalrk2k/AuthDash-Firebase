const formElement = document.getElementById("registrationForm");

function getFormdata() {
  const formData = new FormData(formElement);

  const email = formData.get("email");
  const password = formData.get("password");

  return { email, password };
}

function signup(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      console.log("Logged in with uid" + user.uid);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorCode, errorMessage);
    });
}

formElement.addEventListener("submit", (e) => {
  console.log(e.target);

  const { email, password } = getFormdata();
  console.log(email, password);

  signup(email, password);
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    console.log("Logged in with uid: " + uid);
  } else {
    console.log("No user is signed in");
  }
});
