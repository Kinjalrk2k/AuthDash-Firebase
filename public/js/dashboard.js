const userEmailSpan = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");
const secretForm = document.getElementById("secretForm");
const secretInput = document.getElementById("secretInput");

function stopLoading() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("mainContainer").style.display = "block";
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
    .then((snapshot) => {
      return snapshot.val();
    });
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
      // An error happened.
    });
});

function getSecretFormdata() {
  const formData = new FormData(secretForm);

  const secret = formData.get("secret");

  return secret;
}

secretForm.addEventListener("submit", (e) => {
  var user = firebase.auth().currentUser;
  var secret = getSecretFormdata();

  console.log(user.uid, secret);

  writeDB(user.uid, secret)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
});
