import VirtualBrowser from '../services/VirtualBrowser';

export default new VirtualBrowser({
   autoInit: true,
   async onInit(virtualBrowser) {
      const initialPage = await virtualBrowser.newPage('initial-page', 'https://feliperamos.dev');
      debugger
   },
   onError(error) {
      console.error(error);
   },
});
