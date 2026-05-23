import { Opportunity } from '../../../../../database/models/opportunities_schema';
import ErrorSocketServer from '../../../../../services/SocketServer/ErrorSocketServer';
import { NamespaceEvent } from '../../../../../services/SocketServer';
import socketServer from '../../../socket-server.service';

const generateLetter: NamespaceEvent = {
   name: 'generate-letter',
   async handler(socket, data = {}, callback) {
      const { opportunityId, roomId, agentId } = data;
      const room = this.getRoom(roomId);

      if (!opportunityId) {
         return callback(new ErrorSocketServer('Opportunity ID is required', 'OPPORTUNITY_ID_REQUIRED'));
      }

      if (!room) {
         return callback(new ErrorSocketServer('Room not found', 'ROOM_NOT_FOUND'));
      }

      this.sendToClient(socket.id, 'letter:generate-letter:status', 'generating');
      const [opportunity] = await Opportunity.search({ where: { id: opportunityId } });

      if (!opportunity) {
         this.sendToClient(socket.id, 'letter:generate-letter:status', 'error');
         return callback(new ErrorSocketServer('Opportunity not found', 'OPPORTUNITY_NOT_FOUND'));
      }

      const chatId = roomId; 
      const message = `Generate a cover letter for the following job opportunity`;

      socketServer.sendTo('/ai-core/common/chat-message', { chatId, message, agentId }, (response) => {
         if (!response.success) {
            this.sendToClient(socket.id, 'letter:generate-letter:status', 'error');
            return callback(new ErrorSocketServer('Error generating cover letter', 'AI_GENERATE_LETTER_ERROR'));
         }

         callback({
            success: true,
            opportunity,
            messageId: response.messageId,
            letterSubject: `Application for ${opportunity.job_title} position`,
            letterBody: response.finalOutput
         });

         this.sendToClient(socket.id, 'letter:generate-letter:status', 'success');
      });
   }
};

export default generateLetter;
