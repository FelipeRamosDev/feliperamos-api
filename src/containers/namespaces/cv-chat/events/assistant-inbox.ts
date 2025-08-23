import { NamespaceEvent } from '../../../../services/SocketServer';
import socketServer from '../../../socket-server.service';

const typingStatus: Map<string, boolean> = new Map();

const assistantInboxEvent: NamespaceEvent = {
   name: 'assistant-inbox',
   handler(socket, data = {}) {
      const roomID = socket.id;
      const { content, threadID } = data;

      const sendTyping = (typing: boolean) => {
         if (typingStatus.get(roomID) !== typing) {
            typingStatus.set(roomID, typing);
            this.sendToRoom(roomID, 'assistant-typing', typing);
         }
      };

      try {
         sendTyping(true);
         if (!content) {
            console.error('Received assistant inbox event without content:', data);
            this.sendToRoom(roomID, 'assistant-message', {
               error: true,
               message: 'Message content is empty or missing.'
            });
   
            sendTyping(false);
            return;
         }
   
         socketServer.sendTo('/ai/assistant-generate', { input: content, threadID }, (response = {}) => {
            const { error, message, success, output, threadID } = response;
   
            if (error) {
               console.error('Error occurred while sending message to AI:', message || error);
               this.sendToRoom(roomID, 'assistant-message', {
                  error: true,
                  message: 'Error occurred while sending message to AI.'
               });
   
               return;
            }
   
            if (success && output) {
               this.sendToRoom(roomID, 'assistant-message', {
                  success: true,
                  timestamp: Date.now(),
                  content: output,
                  threadID: threadID
               });
            }
   
            sendTyping(false);
         });
      } catch (error) {
         console.error('Error occurred while processing assistant inbox event:', error);
         this.sendToRoom(roomID, 'assistant-message', {
            error: true,
            message: 'Error occurred while sending message to AI.'
         });

         sendTyping(false);
      }
   }
};

export default assistantInboxEvent;
