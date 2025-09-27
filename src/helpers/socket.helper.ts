import { RoomConfig, SocketNamespace, SocketRoom } from '../services/SocketServer';

export async function createSocketRoom(nsEvent: SocketNamespace, roomConfig: RoomConfig) {
   return new Promise<SocketRoom>((resolve, reject) => {
      try {
         nsEvent.createRoom({
            onCreate(room: SocketRoom) {
               resolve(room);
            },
            ...roomConfig
         });
      } catch (error) {
         reject(error);
      }
   });
}
