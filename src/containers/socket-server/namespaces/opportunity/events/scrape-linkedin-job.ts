import ErrorSocketServer from '../../../../../services/SocketServer/ErrorSocketServer';
import { NamespaceEvent } from '../../../../../services/SocketServer';
import socketServer from '../../../socket-server.service';

const scrapeLinkedInJob: NamespaceEvent = {
   name: 'scrape-linkedin-job',
   handler(socket, data, callback) {
      const { jobURL, roomId } = data || {};

      const clientID = socket.id;
      const existingRoom = this.getRoom(roomId);

      if (!existingRoom) {
         this.sendToClient(clientID, 'opportunities:scrape-linkedin-job:status', 'error');
         return callback({ error: new ErrorSocketServer(`Room not found`, 'ROOM_NOT_FOUND') });
      }

      this.sendToRoom(existingRoom.id, 'opportunities:scrape-linkedin-job:status', 'fetching-url');

      socketServer.sendTo('/virtual-browser/linkedin/job-infos', { jobURL }, (response = {}) => {
         const { jobDescription, jobTitle, jobCompany, jobLocation, jobSeniority, jobEmploymentType } = response;
         const { error, message } = response;

         if (error) {
            console.error('LinkedIn Job Scrap Error:', { error, message });
            this.sendToRoom(existingRoom.id, 'opportunities:scrape-linkedin-job:status', 'error');

            return callback({
               error: new ErrorSocketServer(
                  error.message || 'Error fetching job description from LinkedIn URL!',
                  error.code || 'ERROR_FETCHING_JOB_DESCRIPTION'
               )
            });
         }

         callback({ jobDescription, jobTitle, jobCompany, jobLocation, jobSeniority, jobEmploymentType });
      });
   }
}

export default scrapeLinkedInJob;
