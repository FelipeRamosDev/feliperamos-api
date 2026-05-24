import ErrorSocketServer from '../../../../../services/SocketServer/ErrorSocketServer';
import { NamespaceEvent } from '../../../../../services/SocketServer';
import socketServer from '../../../socket-server.service';

interface GenerateSummaryData {
   jobURL?: string;
   jobDescription?: string;
   jobTitle?: string;
   jobCompany?: string;
   prompt?: string;
   chatId: string;
   agentId: string;
   roomId: string;
}

const generateSummaryEvent: NamespaceEvent = {
   name: 'generate-summary',
   handler(_, data: GenerateSummaryData, callback) {
      const { jobDescription, prompt, jobTitle, jobCompany, roomId, agentId } = data;
      const room = this.getRoom(roomId);

      if (!agentId) {
         return callback({ error: new ErrorSocketServer(`Agent ID is required.`, 'AGENT_ID_REQUIRED') });
      }

      if (!room) {
         return callback({ error: new ErrorSocketServer(`Room not found`, 'ROOM_NOT_FOUND') });
      }

      this.sendToRoom(room.id, 'opportunities:generate-summary:status', 'generating-summary');

      socketServer.sendTo('/ai-core/common/chat-message', {
         message: prompt || 'Generate a concise summary for this CV based on the following job description.',
         chatId: roomId,
         agentId,
         context: { jobDescription, jobTitle, jobCompany },
      }, (response: any) => {
         if (response.error) {
            console.error('AI Error:', response.error);
            this.sendToRoom(room.id, 'opportunities:generate-summary:status', 'error');

            return callback({
               error: new ErrorSocketServer(
                  response.error.message || 'Error generating CV summary!',
                  response.error.code || 'ERROR_GENERATING_CV_SUMMARY'
               )
            });
         }

         this.sendToRoom(room.id, 'opportunities:generate-summary:status', 'success');
         callback(response.finalOutput);
      });
   }
};

export default generateSummaryEvent;
