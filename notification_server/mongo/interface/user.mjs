import User from "../schemas/user.js";

//clean the notifHistory of a user if it has more than 7 items
async function cleanNotifHistory(userId) {
  const user = await User.findById(userId);
  if (user.notifHistory.length > 7) {
    user.notifHistory = [];
    await user.save();
  }
}

export { cleanNotifHistory };
