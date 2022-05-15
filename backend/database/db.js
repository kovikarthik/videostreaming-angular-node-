
const firebase = require('firebase-admin')

const firebaseConfig = {
  apiKey: "AIzaSyCnS-LjOxOFh86JDqixyYhgetjb5m0CLSo",
  authDomain: "streaming-2dc2c.firebaseapp.com",
  projectId: "streaming-2dc2c",
  storageBucket: "streaming-2dc2c.appspot.com",
  messagingSenderId: "576650360011",
  appId: "1:576650360011:web:3d3d726cc52b945f1b574e",
  measurementId: "G-BNCZVEF3MQ"
};

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
const posts = db.collection("posts")

let data = []
posts.get().then(data1 => {
    data1.forEach((d, i) => {
        console.log(d.data())
        data.push(d.data())
        // console.log(data,"data")
    })
}
)

module.exports ={posts,data}