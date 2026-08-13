const mongoose = require(`mongoose`)
const messages= new mongoose.Schema({
    message:{type:String,
        required:true,},
        createdby:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        chatroom:{type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }
    }
,
{timestamps:true})

module.exports=mongoose.model(`Messages`,messages)