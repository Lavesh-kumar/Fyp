const mongoose = require('mongoose');
const  Schema  = mongoose.Schema;

const notificationSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user',  // Reference to the User model
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['success','info', 'warning', 'error'],  // Define allowed categories for notification types
    required: true
  },
  is_read: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }


});

// Create the Notification model using the schema
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;



//commom
// Create Notification
// POST /notifications

// Get All Notifications
// GET /notifications

// Mark Notification as Read
// PUT /notifications/:id/mark-as-read















// more deep notification system
// Get Notification by ID
// GET /notifications/:id

// Update Notification
// PUT /notifications/:id




// Delete Notification
// DELETE /notifications/:id

// Get Notifications for a User
// GET /users/:userId/notifications





