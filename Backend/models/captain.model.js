const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 2 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 2 characters long'],
        }
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
    },

    password: {
        type: String,
        required: true,
        select:false,
    },

    socketId : {
        type:String,

    },

    status : {
        type:String,
        enum:['acive' , 'inactive'],
        default: 'inactive',
    },

    vehicle: {
        color:{
            type: String,
            required: true,
            minlength: [3, 'Color must be at least 3 characters long'],
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, 'Plate number must be at least 3 characters long'],
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1']
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'motorcycle', 'auto'],
        }

    },

    location: {
        lat: {
            type: Number,
            
        },
        lng: {
            type: Number,
            
        }
    }

})

captainSchema.methods.generateAuthToken =  function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

captainSchema.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(Password, this.password);
}

captainSchema.statics.hashPassword = async function (password) {
 
    return await bcrypt.hash(password,10);

}
const CaptainModel = mongoose.model('Captain', captainSchema);

module.exports = CaptainModel;