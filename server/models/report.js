const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({ 
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
      username: { type: String, required: true, unique: true },
      email:{type: String,required: true, unique: true},
      profilePhoto: {
        type: String,
        default: function () {
          return `https://secure.gravatar.com/avatar/${this._id}?s=90&d=identicon`;
        }
      },
      
      created: { type: Date, default: Date.now }  
}

)
module.exports = reportSchema
