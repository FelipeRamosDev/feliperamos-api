import ErrorSocketServer from '../../../../services/SocketServer/ErrorSocketServer';
import { NamespaceEvent } from '../../../../services/SocketServer';
import socketServer from '../../../socket-server.service';

interface GenerateSummaryData {
   jobURL?: string;
   jobDescription?: string;
}

const generateSummaryEvent: NamespaceEvent = {
   name: 'generate-summary',
   handler(socket, data: GenerateSummaryData, callback) {
      const { jobURL, jobDescription } = data || {};
      const clientID = socket.id;
      const client = this.getClient(clientID);

      if (jobDescription) {
         // This will be implemented on the future
         return;
      }

      if (!client) {
         console.error(`Client with ID ${clientID} not found`);
         return callback({ error: new ErrorSocketServer(`Client not found`, 'CLIENT_NOT_FOUND') });
      }

      const clientRoom = this.createRoom({
         id: socket.id,
         name: `custom-cv-generate-summary-${socket.id}`,
         onCreate: (room) => {
            room.addClient(client).catch((error) => {
               console.error(`Error adding client ${client.id} to room ${clientRoom.name}:`, error);

               callback({ error: new ErrorSocketServer(`Failed to join the client's room: ${clientRoom.name}`, 'ROOM_JOIN_ERROR') });
            });
         },
         onJoin: (room, client) => {
            this.sendToRoom(room.id, 'custom-cv:status', 'fetching-url');

            socketServer.sendTo('/virtual-browser/linkedin/job-description', { jobURL }, ({ error, message, jobDescription }) => {
               if (error) {
                  console.error('Job Description Error:', { error, message });
                  this.sendToRoom(room.id, 'custom-cv:status', 'error');

                  return callback({
                     error: new ErrorSocketServer(
                        error.message || 'Error fetching job description from LinkedIn URL!',
                        error.code || 'ERROR_FETCHING_JOB_DESCRIPTION'
                     )
                  });
               }

               this.sendToRoom(room.id, 'custom-cv:status', 'generating-summary');
               socketServer.sendTo('/ai/generate-cv-summary', { jobDescription }, ({ error: aiError, message: aiMessage, summary }) => {
                  if (aiError) {
                     console.error('AI Error:', { aiError, aiMessage });
                     this.sendToRoom(room.id, 'custom-cv:status', 'error');

                     return callback({
                        error: new ErrorSocketServer(
                           aiError.message || 'Error generating CV summary!',
                           aiError.code || 'ERROR_GENERATING_CV_SUMMARY'
                        )
                     });
                  }

                  this.sendToRoom(room.id, 'custom-cv:status', 'success');
                  callback({ summary });
               });
            });
         }
      });
   }
};

export default generateSummaryEvent;

