import { Opportunity } from '../../../../database/models/opportunities_schema';
import { createSocketRoom } from '../../../../helpers/socket.helper';
import { NamespaceEvent } from '../../../../services/SocketServer';
import ErrorSocketServer from '../../../../services/SocketServer/ErrorSocketServer';
import socketServer from '../../../../containers/socket-server.service';

const generateLetter: NamespaceEvent = {
   name: 'generate-letter',
   async handler(socket, data = {}, callback) {
      const { opportunityId, aiThreadID = '', currentLetter = '', additionalMessage = '' } = data;

      const roomId = `generate-letter-${socket.id}`;
      let room = this.getRoom(roomId);

      if (!opportunityId) {
         return callback(new ErrorSocketServer('Opportunity ID is required', 'OPPORTUNITY_ID_REQUIRED'));
      }

      if (!room) {
         room = await createSocketRoom(this, {
            id: roomId,
            name: 'Generate Letter Room'
         });
      }

      const [ opportunity ] = await Opportunity.search({ where: { id: opportunityId }});
      if (!opportunity) {
         return callback(new ErrorSocketServer('Opportunity not found', 'OPPORTUNITY_NOT_FOUND'));
      }

      socketServer.sendTo('/ai/generate-letter', {
         aiThreadID,
         jobDescription: opportunity?.job_description,
         currentLetter,
         additionalMessage
      }, (response) => {
         if (!response.success) {
            return callback(new ErrorSocketServer('Error generating cover letter', 'AI_GENERATE_LETTER_ERROR'));
         }

         callback({
            success: true,
            opportunity,
            letterSubject: `Application for ${opportunity.job_title} position`,
            letterBody: response.output
         });
      })
   }
}

export default generateLetter;
