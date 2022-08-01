//import postgres from 'postgres'
//app.use(express.json())
const express = require('express')
const app = express()
var cors = require('cors')
app.use(cors())
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
//database configuration
const postgres = require('postgres')
const sqlObject = postgres({
  host: 'localhost',
  port: 5432,
  database: 'employee',
  username: 'postgres',
  password: 'uma'
})
//called when user attempts to sign in
//new user  account created if not present. otherwise redirected 
app.post('/userLogin', async function (req, res) {
  //console.log("req came",req)
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Content-Type', 'application/json'); 
  res.setHeader('Access-control-Allow-Origin', '*')
  console.log("req came", req.body)
  const addedOrNot = await addUser(req.body)
  
  if (addedOrNot)//is true if user already present and also not present. fails if password mismatch
  {
    // console.log("redirecting to mainpage")
    res.send({authenticated:true})
    // res.redirect(`http://127.0.0.1:8080/mainpage.html}`)
  }
  else res.send({authenticated:false})//when password mismatch
})
app.post('/addDetail', async function (req, res) {
  console.log("req came", req.body)
  await addDetail(req.body)
  res.redirect("http://127.0.0.1:8080/mainpage.html")

})

app.post('/update', async function (req, res) {
  console.log("req came", req.body)
  const result = await updateDetail(req.body)
  if (result)
    res.send("updated")
  else res.send("user id not found")
})

app.post('/displayDetail', async function (req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  console.log("req came for dispalying details", req.body)
  const userData = await sqlObject` select * from employeedata where uid = ${req.body.uid}`
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-control-Allow-Origin', '*')
  res.send(userData[0])
  // res.send(responseObject)
  // res.send(JSON.stringify(userData[0]))

})
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
app.post('/deleteDetail', async function (req, res) {
  console.log("req came", req.body)
  const deleted = await deleteUser(req.body.uid)
  if (deleted)
    res.redirect("http://127.0.0.1:8080/loginPage.html")
  else res.send("data not found")
  // await display(req.body.uid)
})

//server listening port
app.listen(3000)



//display fn defn
async function display() {
  const users = await sqlObject`select * from employeedata`
  console.log("displaying result", users)
}

async function isUserPresent(uid) {
  const presentOrNot = await sqlObject` select * from employeedata where uid = ${uid}`
  if (presentOrNot.length > 0)
    return true
  return false //if user does not exist

}

//update fn defn
async function updateDetail(update) {
  //const {name,age,uid}= update
  console.log("data came for updation", update)

  const presentOrNot = await isUserPresent(update.uid)
  if (presentOrNot) {

    switch (update.column) {
      case "name":
        update.name = update.data
        await sqlObject` update employeedata set ${sqlObject(update, 'uid', 'name') } where uid = ${update.uid}`
        console.log("name updated")
        return true

      case "age":
        update.age = update.data
        await sqlObject`update employeedata set ${sqlObject(update, 'uid', 'age') } where uid = ${update.uid}`
        console.log("age updated")
        return true

      case "title":
        update.title = update.data
        await sqlObject`update employeedata set ${sqlObject(update, 'uid', 'title')} where uid = ${update.uid}`
        console.log(" title updated")
        return true
      default:
        break;
    }
  }
  else return false
}

//delete a user defn
async function deleteUser(uid) {
  const presentOrNot = await isUserPresent(uid)
  if (presentOrNot) {
    await sqlObject`delete from employeedata where uid = ${uid}`
    return true
  }
  else {
    console.log("user data not found ")
    console.log("deleted")
    return false
  }
}

//defn for adduser
async function addUser(user, response) {
  //check if user already present
  const presentOrNot = await isUserPresent(user.uid, response)
  const encrypt = await  simpleEncryption(user.password)
  user.password = encrypt
  if (!presentOrNot) {
    await sqlObject`
  insert into employeedata ${sqlObject(user, 'uid', 'password')
      }`
    console.log("user record added")
    return true //if true redirects to dasboard
  }
  else {
    console.log("user already exist checking for password")
    const passwordMatchOrNot = await validateUser(user.uid, user.password)
    if (passwordMatchOrNot) {
      console.log("password matches")
      return true
    }

    return false //password mismatch
    // console.log("user already exist")
  }

}

async function addDetail(data) {
  const presentOrNot = await isUserPresent(data.uid)
  if (presentOrNot) {
    await sqlObject`
  update employeedata set ${sqlObject(data, 'uid', 'name', 'age')
      }
  where uid = ${data.uid}`
    console.log("user record added")
  }
  else
    console.log("user does not exist")
}

async function validateUser(uid, password) {
  const userData = await sqlObject` select * from employeedata where uid = ${uid}`
  console.log(`user date`, userData)
  // const encrypt = simpleEncryption(password)
  console.log("password validation for " + `${uid}password came ${password} and password in database ${userData[0].password}`)
  if (password === userData[0].password)
    return true
  return false
}

async function simpleEncryption (password){
console.log(`password came for encryption${password}`)
const length = password.length
console.log("length of password",length)
// const tempAddOn = Math.pow(2,length)
// console.log('power got',tempAddOn)
// console.log('math pow')
// const characterTobeAdded = String.fromCharCode(tempAddOn)
// console.log("character to be added ",characterTobeAdded)
const encryptedPassword=[]
for(const index in password){
  // console.log(`${index} printing befor conversion`,password.charAt(index))
  encryptedPassword[index]= String.fromCharCode(password.charCodeAt(index)+length)
  // console.log(`${index} printing afterconversion`,encryptedPassword[index])
}
return encryptedPassword.toString()
}