var io = require('socket.io');

var initData = [
  {
    id:"iv001",
    Price:25,
    Description:"Eugene's Invoice",
    Quantity:3
  },
  {
    id:"iv002",
    Price:22,
    Description:"Serena's Invoice",
    Quantity:2
  },
  {
    id:"iv003",
    Price:12,
    Description:"Mike's Invoice",
    Quantity:5
  },
  {
    id:"iv004",
    Price:13,
    Description:"Allen's Invoice",
    Quantity:4
  },
  {
    id:"iv005",
    Price:13,
    Description:"Aliang's Hotel live",
    Quantity:13
  }
];

var SocketAPP = function(server){
  var _self = this;
  this.io = io(server);
  this.io.on("connection", function(socket){
    _self.onConnection(socket);
  });
};

SocketAPP.prototype.onConnection = function(socket){
  var _self = this;
  socket.emit("data init", initData);
  socket.on("data synchornizing", function(data){
    _self.io.emit("data synchornizing", data);
  });
};

module.exports = SocketAPP;
