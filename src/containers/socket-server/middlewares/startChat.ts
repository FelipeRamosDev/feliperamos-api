import { NamespaceEventMiddleware } from "../../../services/SocketServer/SocketServer.types";
import ErrorSocketServer from "../../../services/SocketServer/ErrorSocketServer";

export const startChatMiddleware: NamespaceEventMiddleware = function(socketClient, data, next) {
   const clientID = socketClient.id;
   const client = this.getClient(clientID);
   const roomId = `chat_${socketClient.id}`;
   const { label, chatName } = Object(data);

   if (!client) {
      next(new ErrorSocketServer(`Client with ID ${clientID} not found.`, 'SOCKET_CLIENT_NOT_FOUND'));
      return;
   }

   if (this.getRoom(roomId)) {
      next(new ErrorSocketServer(`Chat room with ID ${roomId} already exists.`, 'ROOM_ALREADY_EXISTS'));
      return;
   }

   this.createRoom({
      id: roomId,
      name: chatName || 'Chat Room',
      onCreate: (room) => {
         room.addClient(client).catch((error) => {
            console.error(`Error adding client "${client.id}" to room "${room.name}":`, error);
            next(new ErrorSocketServer(`Failed to add client to chat room.`, 'ROOM_JOIN_FAILED'));
         });
      },
      onJoin(room) {
         // Create the AI Chat
         global.socket.sendTo('/ai-core/common/new-chat', { chatId: room.id, label }, (response: any) => {
            if (response.error) {
               console.error(`Error creating AI chat for room "${room.name}":`, response.error);
               next(new ErrorSocketServer(`Failed to create AI chat.`, 'AI_CHAT_CREATION_FAILED'));
               return;
            }

            next(null, { roomId: room.id, chatId: response.chatId });
         });
      }
   });
}