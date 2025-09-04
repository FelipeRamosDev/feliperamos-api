import { NamespaceEvent, SocketNamespace, SocketRoom } from '../../../../services/SocketServer';
import ErrorSocketServer from '../../../../services/SocketServer/ErrorSocketServer';
import socketServer from '../../../socket-server.service';

function scrapeJob(
   this: SocketNamespace, // Specify the type of `this` context
   room: SocketRoom,
   jobURL: string,
   callback: (response: any) => void
) {
   this.sendToRoom(room.id, 'opportunities:scrape-linkedin-job:status', 'fetching-url');

   socketServer.sendTo('/virtual-browser/linkedin/job-infos', { jobURL }, (response = {}) => {
      const { jobDescription, jobTitle, jobCompany } = response;
      const { error, message } = response;

      if (error) {
         console.error('LinkedIn Job Scrap Error:', { error, message });
         this.sendToRoom(room.id, 'opportunities:scrape-linkedin-job:status', 'error');

         return callback({
            error: new ErrorSocketServer(
               error.message || 'Error fetching job description from LinkedIn URL!',
               error.code || 'ERROR_FETCHING_JOB_DESCRIPTION'
            )
         });
      }

      callback({ jobDescription, jobTitle, jobCompany });
   });
}

const scrapeLinkedInJob: NamespaceEvent = {
   name: 'scrape-linkedin-job',
   handler(socket, data, callback) {
      const { jobURL } = data || {};

      const clientID = socket.id;
      const client = this.getClient(clientID);
      const existingRoom = this.getRoom(clientID);

      if (!client) {
         this.sendToRoom(clientID, 'opportunities:scrape-linkedin-job:status', 'error');
         return callback({ error: new ErrorSocketServer(`Client not found`, 'CLIENT_NOT_FOUND') });
      }

      if (existingRoom) {
         return scrapeJob.call(this, existingRoom, jobURL, callback);
      }

      this.createRoom({
         id: socket.id,
         name: `opportunities-scrape-linkedin-job-${socket.id}`,
         onCreate: (room) => {
            room.addClient(client).catch((error) => {
               console.error(`Error adding client ${client.id} to room ${room.name}:`, error);

               callback({ error: new ErrorSocketServer(`Failed to join the client's room: ${room.name}`, 'ROOM_JOIN_ERROR') });
            });
         },
         onJoin: (room) => {
            scrapeJob.call(this, room, jobURL, callback);
         }
      });
   }
}

export default scrapeLinkedInJob;
