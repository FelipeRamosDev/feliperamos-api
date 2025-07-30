import VirtualBrowser from '../services/VirtualBrowser';

export default new VirtualBrowser({
   autoInit: true,
   async onInit(virtualBrowser) {
      console.log('Virtual Browser initialized');
      console.log(`Viewport: ${virtualBrowser.viewPort.width}x${virtualBrowser.viewPort.height}`);
   },
   onError(error) {
      console.error(error);
   },
});
