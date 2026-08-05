let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
      cors: {
        origin: `http://${process.env.HOST_FRONT}:${process.env.PORT_FRONT}`,
      },
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized");
    }

    return io;
  },
};
