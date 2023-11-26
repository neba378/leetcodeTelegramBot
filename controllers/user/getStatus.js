const UserModel = require("../../models/UserModel")


const getUserStatus = async (msg) => {
    const {id} = msg.from
    try {
        const user = await UserModel.findOne(
            {_id:id}
        )

        if (user) {
            const {solved,day} = user;

            const message = `Your status 
                \nSolved: ${solved}/${day}
                \nYou can do more than that :) `;

            return message
        } else {
            return "Sorry you have to /register first."
        }

    }
    catch{
        console.log('Error while Reseting User !!!')
    }

}

module.exports = {getUserStatus}