import { Microservice, Route } from '../services';

export default new Route({
   routePath: '/health',
   method: 'GET',
   controller: (req, res) => {
      Microservice.sendTo('/ai/get-chat', { chatId: Number(req.query.chatId) }, 'api-server', (response: Record<string, any>) => {
         if (response.error) {
            res.status(500).send({ success: false, message: 'Failed to retrieve chat', error: response.error });
            return;
         }

         res.status(200).send({ success: true, message: 'Server is running', chat: response });
      });
   }
});
