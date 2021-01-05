const userEmailSpan = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    console.log("Logged in with uid: " + uid);
    console.log(user.email);
    userEmailSpan.innerHTML = user.email;
  } else {
    console.log("No user is signed in");
  }
});

logoutBtn.addEventListener("click", (e) => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
});
