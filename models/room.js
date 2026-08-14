const mongoose=require(`mongoose`)
const chatroom = new mongoose.Schema({
    roomid:{type:String,
        required:true,
        unique:true
     },
    members:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
     ],
     },{timestamps:true}
     )

module.exports=mongoose.model(`Room`,chatroom)