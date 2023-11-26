const UserModel = require("../../models/UserModel");

const saveSubmiton = async (msg) => {
    const {id} = msg.from
    try {
        const user = await UserModel.findOne(
            {_id:id}
        )

        if (user) {
            user.solved++;
            await user.save()
            return "Accepted"
        } else {
            return "Sorry you have to /register first."
        }

    }
    catch{
        console.log('Error while Reseting User !!!')
    }

}

module.exports = {saveSubmiton}