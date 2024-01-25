//socket.io 팩키지 참조
const SocketIO = require("socket.io");

//socket.js모듈 기능정의
module.exports =(server)=>{
  const io = SocketIO(server, {
    path: "/socket.io",
    cors: {
      origin: "*",  //  "*" > 모든 도메인,모바일
      methods: ["GET", "POST"],
    },
  });



  io.on("connection", async (socket)=>{

  });
}