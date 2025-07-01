import { NamespaceEvent } from '@/services/SocketServer';

const WELCOME_MESSAGE = [
   `Welcome to the Felipe's CV chat!`,
   `I'm Felipe's AI assistant and I will assist you with any questions or information you need regarding my CV.`,
   `Feel free to ask anything about his career and experiences.`
].join('\n');

const startChatEvent: NamespaceEvent = {
   name: 'start-chat',
   handler(socket, data, callback) {
      const clientID = socket.id;
      const client = this.getClient(clientID);

      if (!client) {
         console.error(`Client with ID ${clientID} not found`);
         return callback({ error: true, message: 'Client not found' });
      }

      const clientRoom = this.createRoom({
         id: clientID,
         name: `cvchat-room-${clientID}`,
         onCreate: (room) => {
            room.addClient(client).catch((error) => {
               console.error(`Error adding client ${client.id} to room ${clientRoom.name}:`, error);

               callback({
                  error: true,
                  message: `Failed to join the client's room: ${clientRoom.name}`
               });
            });
         },
         onJoin: (room, client) => {
            callback({ success: true });

            this.sendToRoom(room.id, 'assistant-message', {
               success: true,
               room: room.id,
               timestamp: Date.now(),
               content: WELCOME_MESSAGE
            });
         }
      });
   }
};

export default startChatEvent;
