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
}

Room.prototype.getMessages = function () {
  return this.messages;
};

Room.prototype.getUsers = function () {
  return this.users;
};

module.exports = Room;
