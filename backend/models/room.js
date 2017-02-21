function Room(name, id, owner) {
  this.name = name;
  this.id = id;
  this.owner = owner;
  this.users = [];
  this.status = "available";
  this.messages = [];
};

Room.prototype.addUser = function(user) {
  if (this.status === "available") {
    this.users.push(user);
  }
};

Room.prototype.addMessage = function(message) {
  if (this.status === 'available') {
    this.messages.push(message);
  }
};

Room.prototype.getMessages = function () {
  return this.messages;
};

Room.prototype.getUsers = function () {
  return this.users;
};

Room.prototype.isOwner = function (name) {
  if (name === this.owner) {
    return true;
  }
  return false;
};

Room.prototype.getId = function () {
  return this.id;
};

Room.prototype.removeUser = function (usr) {
  if (usr === this.owner) {
    //  Admin can't leave the room
    //  can only close
    return false;
  }
  var index = this.users.indexOf(usr);
  if (index > -1) {
    this.users.splice(index, 1);
    return true;
  }
  return false;
}

module.exports = Room;
