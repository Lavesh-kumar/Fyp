const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campaignSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
    Approved: {
        type: Boolean,
    default: false
      },
      Rejectionmessage: {
        type: String,
    default: null
      },
  Campaigntitle: {
    type: String,
    required: true
  },
  Campaignamount: {
    type: Number,
    required: true
  },
  Campaigncategory: {
    type: String,
    required: true
  },
  Campaignduration: {
    type: Number,
    required: true
  },
  Campaigndescription: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  emailaddress: {
    type: String,
    required: true
  },
  phonenumber: {
    type: String,
    required: true
  },
  cnic: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  provience: {
    type: String,
    required: true
  },
  postalcode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  userfiles: {
    cnicDoc: {
      type: String,
      required: true
    },
    profileDoc: {
      type: String,
      required: true
    },
    B_formDoc: {
      type: String,
      required: true
    },
    E_billDoc: {
      type: String,
      required: true
    }
  },
  banner: {
    type: String,
    required: true
  }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
