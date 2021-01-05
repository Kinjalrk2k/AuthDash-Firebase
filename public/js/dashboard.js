const userEmailSpan = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    console.log("Logged in with uid: " + uid);
    console.log(user.email);
    userEmailSpan.innerHTML = user.email;
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
