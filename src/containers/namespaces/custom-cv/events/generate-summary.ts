import ErrorSocketServer from '../../../../services/SocketServer/ErrorSocketServer';
import { NamespaceEvent, SocketRoom } from '../../../../services/SocketServer';
import socketServer from '../../../socket-server.service';

interface GenerateSummaryData {
   jobURL?: string;
   jobDescription?: string;
   customPrompt?: string;
   aiThread?: string;
   currentInput?: string;
}

const generateSummaryEvent: NamespaceEvent = {
   name: 'generate-summary',
   handler(socket, data: GenerateSummaryData, callback) {
      const { jobURL, jobDescription, customPrompt, aiThread, currentInput } = data || {};
      const clientID = socket.id;
      const client = this.getClient(clientID);
      const existingRoom = this.getRoom(clientID);

      if (!client) {
         return callback({ error: new ErrorSocketServer(`Client not found`, 'CLIENT_NOT_FOUND') });
      }

      const generateSummary = async (room: SocketRoom, jobDescr: string) => {
         this.sendToRoom(room.id, 'custom-cv:status', 'generating-summary');

         socketServer.sendTo('/ai/generate-cv-summary', {
            jobDescription: jobDescr,
            customPrompt,
            currentInput,
            threadID: aiThread
         }, ({ error, message, summary, threadID }) => {
            if (error) {
               console.error('AI Error:', { error, message });
               this.sendToRoom(room.id, 'custom-cv:status', 'error');

               return callback({
                  error: new ErrorSocketServer(
                     error.message || 'Error generating CV summary!',
                     error.code || 'ERROR_GENERATING_CV_SUMMARY'
                  )
               });
            }

            this.sendToRoom(room.id, 'custom-cv:status', 'success');
            callback({ summary, jobDescription: jobDescr, aiThread: threadID });
         });
      }

      const getJobDescriptionFromURL = (room: SocketRoom) => {
         this.sendToRoom(room.id, 'custom-cv:status', 'fetching-url');

         socketServer.sendTo('/virtual-browser/linkedin/job-description', { jobURL }, ({ error, message, jobDescription: jobDescr }) => {
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

            generateSummary(room, jobDescr);
         });
      }

      if (existingRoom) {
         if (jobDescription) {
            generateSummary(existingRoom, jobDescription);
         } else {
            getJobDescriptionFromURL(existingRoom);
         }

         return;
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
         onJoin: getJobDescriptionFromURL
      });
   }
};

export default generateSummaryEvent;

