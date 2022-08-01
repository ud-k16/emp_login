
//not used 
const listUserData = () => {
  var myHeaders = new Headers(); // Currently empty
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.get('Content-Type');
  myHeaders.append('Access-Control-Allow-origin', '*')
  //test fetch temp working one for get reference
  fetch("http://localhost:3000/displayDetails?uid=uma")
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((erroe) => console.log("some error", erroe))

}
//delete userdata uses update to make data null
const deleteUserData = (attribute) => {
  const { column } = attribute
  const confirmed = confirm(`delete your ${column} ?`);
  //delete user data based on choice
  if (confirmed) {
    fetch("http://localhost:3000/update", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uid: localStorage.getItem('uid'),//try storing uid and retrieve , ere raw constant is used
        column,
        data: null

      })
    })
      .then(response => response.json())
      .then((result) => {
        //try calling loadUserData because of any changes in scheme affects 
        if (result == 'updated')
          console.log("deleted")
        else console.log("failed to update")
      })
      .catch((err) => console.log(err))
    //loading dasboad after deleting
    window.location = 'mainpage.html'


  }
}
//update user data 
const updateUserData = (attribute) => {
  //data format {uid:uma,column:name,data:udkk}
  const { uid, column, data } = attribute
  console.log(attribute)
  fetch("http://localhost:3000/update", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uid: localStorage.getItem('uid'),
      column,
      data

    })
  })
    .then(response => response.json())
    .then((result) => {
      //try calling loadUserData because of any changes in scheme affects 
      if (result == 'updated')
        console.log("updated result came")
      else console.log("failed to update")
    })
    .catch((err) => console.log(err))
  // console.log("event clicked with data",event.target.getAttribute('data')
  window.location = 'mainpage.html'
}
//displays the user data on load of the webpage by fetching data from database
const loadUserData = (uid) => {
  // console.log("fetch function for testing")
  console.log("loadind user data", uid)
  fetch("http://localhost:3000/displayDetail", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uid
    })
  })
    .then(response => response.json())
    .then((user) => {
      console.log(user);
      //updating in the column the respective data
      if (user.name !== null) {
        document.getElementById('name').innerText = user.name
        document.getElementById("userName").innerText = "welcome ".concat(user.name)
        document.getElementById('NameRelatedDiv').style.visibility = 'visible'
        console.log("name value not empty")

      }

      else {
        console.log("name value is empty")
      }
      if (user.age !== null) {
        document.getElementById('age').innerText = user.age
        document.getElementById('AgeRelatedDiv').style.visibility = 'visible'
        // document.getElementById('AgeRelatedDiv').style.pointerEvents = 'auto'
      }

      if (user.title !== null) {
        document.getElementById('title').innerText = user.title //check and then update
        document.getElementById('TitleRelatedDiv').style.visibility = 'visible'
      }

    })
    .catch((err) => console.log(err))
}
//called when user clicks login
const userLogin = () => {
  // document.getElementById('invalidPassword').style.visibility = 'visible'
  const uid = document.getElementById('uid').value
  const password = document.getElementById('password').value
  fetch("http://localhost:3000/userLogin", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uid,
      password
    })
  })
    .then(response => response.json())
    .then((result) => {
      console.log(result)
      if (result.authenticated) {
        // console.log(" result came")
        //when user validated redirected to mainpage
        window.location = `http://127.0.0.1:8080/mainpage.html?uid=${uid}`
      }
      else {
        // else notify the user password mismatch
        document.getElementById('invalidPassword').style.visibility = 'visible'
      }
    })
    .catch((err) => console.log(err))
  // window.location = 'mainpage.html'
}