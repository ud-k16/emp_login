const { addDetail, addUser, updateDetail, deleteUser, displayDetail } = require('../server/helper-func/crudFunctions')
const express = require('express')
const app = express()
var cors = require('cors')
app.use(cors())
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

//called when user attempts to sign in
//new user  account created if not present. otherwise redirected 
app.post('/userLogin', async function (req, res) {
  //console.log("req came",req)
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-control-Allow-Origin', '*')
  console.log("req came for login", req.body)
  const addedOrNot = await addUser(req.body)

  if (addedOrNot)//is true if user already present and also not present. fails if password mismatch
  {
    // console.log("redirecting to mainpage")
    res.send({ authenticated: true })
    // res.redirect(`http://127.0.0.1:8080/mainpage.html}`)
  }
  else res.send({ authenticated: false })//when password mismatch
})
//update the given data to respective column
app.post('/update', async function (req, res) {
  console.log("req came for updation of user data", req.body)
  const result = await updateDetail(req.body)
  if (result)
    res.send("updated")
  else res.send("user id not found")
})
//used for displaying the user data in dasboard
app.post('/displayDetail', async function (req, res) {
  console.log("req came for dispalying details", req.body)
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-control-Allow-Origin', '*')
  const userData = await displayDetail(req.body.uid)
  res.send(userData)
})

//not used
//dublicate for testingg
app.get('/displayDetails', async function (req, res) {
  // console.log("req came for dispalying details with get method",window.location.search)
  console.log("req came for dispalying details with get method", req.query.uid)
  //temorary commenting following since uid retrieving from url
  const userData = await sqlObject` select * from employeedata where uid = ${req.query.uid}`
  // console.log("data fetched",userData)
  // console.log("data fetched",userData[0])
  // res.contentType('application/json')
  // res.sendStatus(200)
  console.log("type of user data sent to nuser", typeof (userData[0]))
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-control-Allow-Origin', '*')
  // res.end(userData[0])
  // console.log("response object",res)
  res.send(userData[0])
  // res.send(responseObject)
})
//not used
app.post('/deleteDetail', async function (req, res) {
  console.log("req came", req.body)
  const deleted = await deleteUser(req.body.uid)
  if (deleted)
    res.redirect("http://127.0.0.1:8080/loginPage.html")
  else res.send("data not found")
  // await display(req.body.uid)
})
//not used
app.post('/addDetail', async function (req, res) {
  console.log("req came", req.body)
  await addDetail(req.body)
  res.redirect("http://127.0.0.1:8080/mainpage.html")

})
//till here


//server listening port
app.listen(3000)



