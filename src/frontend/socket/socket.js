'use strict';

const socketIO = require(`socket.io`);

const createSocketServer = (server) => {
  const io = socketIO(server);
  return io;
};

module.exports = {
  createSocketServer,
};
