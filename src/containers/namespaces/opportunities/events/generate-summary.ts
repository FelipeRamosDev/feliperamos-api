import ErrorSocketServer from '../../../../services/SocketServer/ErrorSocketServer';
import { NamespaceEvent, SocketRoom } from '../../../../services/SocketServer';
import socketServer from '../../../socket-server.service';

interface GenerateSummaryData {
   jobURL?: string;
   jobDescription?: string;
   jobTitle?: string;
   jobCompany?: string;
   customPrompt?: string;
   aiThread?: string;
   currentInput?: string;
}

const generateSummaryEvent: NamespaceEvent = {
   name: 'generate-summary',
   handler(socket, data: GenerateSummaryData, callback) {
      const { jobURL, jobDescription, customPrompt, aiThread, currentInput, jobTitle, jobCompany } = data || {};
      const clientID = socket.id;
      const client = this.getClient(clientID);
      const existingRoom = this.getRoom(clientID);

      if (!client) {
         return callback({ error: new ErrorSocketServer(`Client not found`, 'CLIENT_NOT_FOUND') });
      }

      const generateSummary = async (room: SocketRoom, jobDescr: string, jobTitle?: string, jobCompany?: string) => {
         this.sendToRoom(room.id, 'opportunities:generate-summary:status', 'generating-summary');

         socketServer.sendTo('/ai/generate-cv-summary', {
            jobDescription: jobDescr,
            customPrompt,
            currentInput,
            threadID: aiThread
         }, ({ error, message, summary, threadID }) => {
            if (error) {
               console.error('AI Error:', { error, message });
               this.sendToRoom(room.id, 'opportunities:generate-summary:status', 'error');

               return callback({
                  error: new ErrorSocketServer(
                     error.message || 'Error generating CV summary!',
                     error.code || 'ERROR_GENERATING_CV_SUMMARY'
                  )
               });
            }

            this.sendToRoom(room.id, 'opportunities:generate-summary:status', 'success');
            callback({ summary, jobDescription: jobDescr, jobTitle, jobCompany, aiThread: threadID });
         });
      }

      const getJobDescriptionFromURL = (room: SocketRoom) => {
         this.sendToRoom(room.id, 'opportunities:generate-summary:status', 'fetching-url');

         socketServer.sendTo('/virtual-browser/linkedin/job-infos', { jobURL }, ({ error, message, jobTitle, jobCompany, jobDescription: jobDescr }) => {
            if (error) {
               console.error('Job Description Error:', { error, message });
               this.sendToRoom(room.id, 'opportunities:generate-summary:status', 'error');

               return callback({
                  error: new ErrorSocketServer(
                     error.message || 'Error fetching job description from LinkedIn URL!',
                     error.code || 'ERROR_FETCHING_JOB_DESCRIPTION'
                  )
               });
            }

            generateSummary(room, jobDescr, jobTitle, jobCompany);
         });
      }

      if (existingRoom) {
         if (jobDescription) {
            generateSummary(existingRoom, jobDescription, jobTitle, jobCompany);
         } else {
            getJobDescriptionFromURL(existingRoom);
         }

         return;
      }

      const clientRoom = this.createRoom({
         id: socket.id,
         name: `opportunities-generate-summary-${socket.id}`,
         onCreate: (room) => {
            room.addClient(client).catch((error) => {
               console.error(`Error adding client ${client.id} to room ${clientRoom.name}:`, error);

               callback({ error: new ErrorSocketServer(`Failed to join the client's room: ${clientRoom.name}`, 'ROOM_JOIN_ERROR') });
            });
         },
         onJoin: (room) => getJobDescriptionFromURL(room)
      });
   }
};

export default generateSummaryEvent;

