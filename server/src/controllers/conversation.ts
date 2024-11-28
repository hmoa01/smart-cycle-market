import { RequestHandler } from "express";
import { isValidObjectId, ObjectId } from "mongoose";
import path from "path";
import ConversationModel from "src/models/conversation";
import UserModel from "src/models/user";
import { sendErrorRes } from "src/utils/helper";

interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
}

interface Chat {
  text: string;
  time: string;
  id: string;
  viewed: boolean;
  user: UserProfile;
}

interface Conversation {
  id: string;
  chats: Chat[];
  peerProfile: { avatar?: string; name: string; id: string };
}

type PopulatedChat = {
  _id: ObjectId;
  content: string;
  timestamp: Date;
  sentBy: { name: string; _id: ObjectId; avatar?: { id: string; url: string } };
  viewed: boolean;
};

type PopulatedParticipant = {
  _id: ObjectId;
  name: string;
  avatar?: { id: string; url: string };
};

export const getOrCreateConversation: RequestHandler = async (req, res) => {
  const { peerId } = req.params;

  if (!isValidObjectId(peerId)) {
    return sendErrorRes(res, "Invalid peer id!", 422);
  }

  const user = await UserModel.findById(peerId);
  if (!user) {
    return sendErrorRes(res, "User not found!", 404);
  }

  const participants = [req.user.id, peerId];
  const participantsId = participants.sort().join("_");

  const conversation = await ConversationModel.findOneAndUpdate(
    { participantsId },
    {
      // insert only if upsert founds nothing as participants
      $setOnInsert: {
        participantsId,
        participants,
      },
    },
    { upsert: true, new: true }
  );

  res.json({ conversationId: conversation._id });
};

export const getConversation: RequestHandler = async (req, res) => {
  const { conversationId } = req.params;

  if (!isValidObjectId(conversationId)) {
    return sendErrorRes(res, "Invalid conversation id!", 422);
  }

  const conversation = await ConversationModel.findById(conversationId)
    .populate<{ chats: PopulatedChat[] }>({
      path: "chats.sentBy",
      select: "name avatar.url",
    })
    .populate<{ participants: PopulatedParticipant[] }>({
      path: "participants",
      match: { _id: { $ne: req.user.id } }, // Filter out the logged in user
      select: "name avatar.url",
    })
    .select("sentBy chats._id chats.content chats.timestamp participants");

  if (!conversation) return sendErrorRes(res, "Details not found!", 404);

  const peerProfile = conversation.participants[0];

  const finalConversation: Conversation = {
    id: conversation._id as string,
    chats: conversation.chats.map((c) => ({
      id: c._id.toString(),
      text: c.content,
      time: c.timestamp.toISOString(),
      viewed: c.viewed,

      user: {
        id: c.sentBy._id.toString(),
        name: c.sentBy.name,
        avatar: c.sentBy.avatar?.url,
      },
    })),
    peerProfile: {
      id: peerProfile._id.toString(),
      name: peerProfile.name,
      avatar: peerProfile.avatar?.url,
    },
  };

  // console.log(JSON.stringify(conversation, null, 2));
  res.json({ conversation: finalConversation });
};
