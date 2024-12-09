import "express-async-errors";
import "src/db";
import express from "express";
import authRouter from "routes/auth";
import productRouter from "./routes/product";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { sendErrorRes } from "./utils/helper";
import { TokenExpiredError, verify } from "jsonwebtoken";
import morgan from "morgan";
import conversationRouter from "./routes/conversation";
import ConversationModel from "./models/conversation";
import { updateSeenStatus } from "./controllers/conversation";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket-message",
});

app.use(morgan("dev"));
app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//API ROUTES
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/conversation", conversationRouter);

//SOCKET IO
io.use((socket, next) => {
  const socketReq = socket.handshake.auth as { token: string } | undefined;

  if (!socketReq?.token) {
    return next(new Error("Unauthorized request!"));
  }

  try {
    socket.data.jwtDecode = verify(socketReq.token, process.env.JWT_SECRET!);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new Error("jwt expired!"));
    }

    return next(new Error("Invalid token!"));
  }

  next();
});

type MessageProfile = {
  id: string;
  name: string;
  avatar?: { id: string; url: string };
};

type IncomingMessage = {
  message: {
    id: string;
    time: string;
    text: string;
    user: MessageProfile;
  };
  to: string;
  conversationId: string;
};

type OutgoingMessageResponse = {
  message: {
    id: string;
    time: string;
    text: string;
    user: MessageProfile;
    viewed: boolean;
  };
  from: MessageProfile;
  conversationId: string;
};

type SeenData = {
  messageId: string;
  conversationId: string;
  peerId: string;
};

io.on("connection", (socket) => {
  const socketData = socket.data as { jwtDecode: { id: string } };
  const userId = socketData.jwtDecode.id;

  socket.join(userId);

  // console.log("user is connected");
  socket.on("chat:new", async (data: IncomingMessage) => {
    const { conversationId, message, to } = data;

    await ConversationModel.findByIdAndUpdate(conversationId, {
      $push: {
        chats: {
          sentBy: message.user.id,
          content: message.text,
          timestamp: message.time,
        },
      },
    });

    const messageResponse: OutgoingMessageResponse = {
      from: message.user,
      conversationId,
      message: { ...message, viewed: false },
    };
    socket.to(to).emit("chat:message", messageResponse);
  });

  socket.on(
    "chat:seen",
    async ({ messageId, conversationId, peerId }: SeenData) => {
      await updateSeenStatus(peerId, conversationId);
      socket.to(peerId).emit("chat:seen", { conversationId, messageId });
    }
  );

  socket.on("chat:typing", (typingData: { to: string; active: boolean }) => {
    socket.to(typingData.to).emit("chat:typing", { typing: typingData.active });
  });
});

app.use(function (err, req, res, next) {
  res.status(500).json({ message: err.message });
} as express.ErrorRequestHandler);

app.use("*", (req, res) => {
  sendErrorRes(res, "Not Found!", 404);
});

server.listen(8000, () =>
  console.log("The app running on http://localhost:8000")
);
