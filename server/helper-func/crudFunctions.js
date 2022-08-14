//database configuration
const postgres = require('postgres')
const sqlObject = postgres({
    host: 'localhost',
    port: 5432,
    database: 'employee',
    username: 'postgres',
    password: 'uma'
})

//update fn defn
const updateDetail = async (update) => {
    //const {name,age,uid}= update
    console.log("data came for updation", update)

    const presentOrNot = await isUserPresent(update.uid)
    if (presentOrNot) {

        switch (update.column) {
            case "name":
                update.name = update.data
                await sqlObject` update employeedata set ${sqlObject(update, 'uid', 'name')} where uid = ${update.uid}`
                console.log("name updated")
                return true

            case "age":
                update.age = update.data
                await sqlObject`update employeedata set ${sqlObject(update, 'uid', 'age')} where uid = ${update.uid}`
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
//defn for adduser
const addUser = async (user, response) => {
    //check if user already present
    const presentOrNot = await isUserPresent(user.uid, response)
    const encrypt = await simpleEncryption(user.password)
    user.password = encrypt
    if (!presentOrNot) {
        await sqlObject`insert into employeedata ${sqlObject(user, 'uid', 'password')}`
        console.log("new user record added")
        return true //if true redirects to dasboard
    }
    else {
        console.log("user already exist checking for password valid")
        const passwordMatchOrNot = await validateUser(user.uid, user.password)
        if (passwordMatchOrNot) {
            console.log("password matches")
            return true
        }

        return false //password mismatch
        // console.log("user already exist")
    }

}
//display fn defn
const displayDetail = async (uid) => {
    const userData = await sqlObject` select * from employeedata where uid = ${uid}`
    console.log("fetched user data for display purpose ", userData[0])
    return userData[0]
}

//not used
const addDetail = async (data) => {
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
//not used
//delete a user defn
const deleteUser = async (uid) => {
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


module.exports = {
    //not used
    deleteUser,
    addDetail,
    //used export
    addUser,
    updateDetail,
    displayDetail
}



//other related functions

//check's for the password match
const validateUser = async (uid, password) => {
    const userData = await sqlObject` select * from employeedata where uid = ${uid}`
    console.log("password validation for " + `${uid}\npassword came ${password} and password in database ${userData[0].password}`)
    if (password === userData[0].password)
        return true
    return false
}
//encryption of password before checking or storing password
const simpleEncryption = async (password) => {
    console.log(`password came for encryption ${password}`)
    const length = password.length
    // console.log("length of password", length)
    const encryptedPassword = []
    for (const index in password) {
        //every char in password is shifted to other char that comes by adding the length of password to ascii of that char
        encryptedPassword[index] = String.fromCharCode(password.charCodeAt(index) + length)
    }
    return encryptedPassword.toString()
}
//checks if user is already present or not
const isUserPresent = async (uid) => {
    const presentOrNot = await sqlObject` select * from employeedata where uid = ${uid}`
    if (presentOrNot.length > 0)
        return true
    return false //if user does not exist

}
