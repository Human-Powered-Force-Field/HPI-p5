const firebaseConfig = {
  apiKey: "AIzaSyAg8jkiitQa6Y8sgbbYeZsL02C4eSbhHXo",
  authDomain: "hpforcefield.firebaseapp.com",
  databaseURL: "https://hpforcefield.firebaseio.com",
  projectId: "hpforcefield",
  storageBucket: "hpforcefield.appspot.com",
  messagingSenderId: "1048363384532",
  appId: "1:1048363384532:web:c53bafdcf3cacf8f24c541"
};

firebase.initializeApp(firebaseConfig);

var body = document.getElementsByTagName("body")[0];
let bottomCannon = document.createElement("p");
let leftCannon = document.createElement("p");
let rightCannon = document.createElement("p");
let topCannon = document.createElement("p");

body.appendChild(bottomCannon);
body.appendChild(leftCannon);
body.appendChild(rightCannon);
body.appendChild(topCannon);

var db = firebase.firestore();
db.collection("canons").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
});

db.collection("canons").doc("bottomCanon")
    .onSnapshot(function(doc) {
        setBottomCannon(doc.data());
});

db.collection("canons").doc("leftCanon")
    .onSnapshot(function(doc) {
        setLeftCannon(doc.data());
});

db.collection("canons").doc("rightCanon")
    .onSnapshot(function(doc) {
        setRightCannon(doc.data());
});

db.collection("canons").doc("topCanon")
    .onSnapshot(function(doc) {
        setTopCannon(doc.data());
});

function setBottomCannon(fbData){
  let val = 'Bottom Cannon Shooting: ' + fbData.shooting.toString();
  bottomCannon.innerHTML = val;
}

function setLeftCannon(fbData){
  let val = 'Left Cannon Shooting: ' + fbData.shooting.toString();
  leftCannon.innerHTML = val;
}

function setRightCannon(fbData){
  let val = 'Right Cannon Shooting: ' + fbData.shooting.toString();
  rightCannon.innerHTML = val;
}

function setTopCannon(fbData){
  let val = 'Top Cannon Shooting: ' + fbData.shooting.toString();
  topCannon.innerHTML = val;
}
