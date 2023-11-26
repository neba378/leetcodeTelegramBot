
// # check if the user exist 

// # if not tell him the he don't have any history 

// # if user then reset his porgress

const UserModel = require('../../models/UserModel');

const resetUser = async (msg) => {
    const {id} = msg.from
    try {
        const user = await UserModel.updateOne(
            {_id:id},
            {day:1,solved: 0,qList:{}}
        )

        if (user) {
            return "Progress Reseted Successfully "
        } else {
            return "Sorry you have to /register first."
        }

    }
    catch{
        console.log('Error while Reseting User !!!')
    }
}

module.exports = {resetUser};
