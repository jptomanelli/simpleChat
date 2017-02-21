function User(name, room, admin) {
  this.name = name;    //  username
  this.room = room;    //  room uuid
  this.admin = admin;   //  bool
};

User.prototype.getName = function () {
  return this.name;
};

User.prototype.getRoom = function () {
  return this.room;
};

User.prototype.isAdmin = function () {
  return this.admin;
};

module.exports = User;
