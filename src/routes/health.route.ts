import { Route } from "../services";

export default new Route({
   routePath: '/health',
   method: 'GET',
   controller: (req, res) => {
      res.status(200).send({ success: true, message: 'Server is running' });
   }
});
