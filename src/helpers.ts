import IORedis from 'ioredis';

const ioRedis = new IORedis();

export function publishEvent(eventName: string, data: any) {
   let dataString: string;

   try {
      dataString = JSON.stringify(data);
   } catch (err) {
      return;
   }

   ioRedis.publish(eventName, dataString);
}

