const usersSchema = new Schema({
    name: { type: String },
    email: { type: String },
    tel: { type: Number },
  });

const Users = mongoose.model('Users', usersSchema, 'users');
