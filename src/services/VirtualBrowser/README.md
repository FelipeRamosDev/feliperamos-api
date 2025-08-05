# VirtualBrowser Service

The `VirtualBrowser` service is a backend abstraction for managing headless browser automation in Node.js, built on top of Puppeteer. It provides a clean API for launching browsers, managing pages, handling errors, and customizing viewport settings.

## Features
- Launch and close a headless browser instance
- Create, manage, and delete multiple browser pages
- Custom viewport configuration
- Error handling via custom error class
- PDF generation and file writing utilities
- Event hooks for initialization and error handling

## Usage

### 1. Setup and Initialization
```typescript
import VirtualBrowser from './VirtualBrowser';

const vb = new VirtualBrowser({
  viewPort: { width: 1280, height: 800 },
  autoInit: true,
  onInit: (browser) => console.log('Browser initialized'),
  onError: (err) => console.error(err)
});
```

### 2. Manual Initialization
```typescript
await vb.init();
```

### 3. Create and Open a Page
```typescript
const page = await vb.newPage('page1', 'https://example.com');
```

### 4. Navigate and Interact
```typescript
await page.navigate('https://another-url.com');
// Use Puppeteer Page API via page._page
```

### 5. Generate PDF
```typescript
const pdfBuffer = await page.toPDF('output.pdf');
```

### 6. Close Page and Browser
```typescript
await vb.closePage('page1');
await vb.close();
```

## API Reference
### VirtualBrowser
- `constructor(setup?: VirtualBrowserSetup)`
- `init(): Promise<VirtualBrowser>`
- `newPage(id: string, startURL?: string): Promise<VirtualBrowserPage>`
- `getPage(pageId: string): VirtualBrowserPage | undefined`
- `deletePage(pageId: string): void`
- `closePage(pageId: string): Promise<void>`
- `close(): Promise<void>`
- `viewPort: ViewPort` (getter)
- `browser: Browser` (getter)

### VirtualBrowserPage
- `open(): Promise<VirtualBrowserPage>`
- `navigate(url: string): Promise<void>`
- `toPDF(filePath: string, options?): Promise<Uint8Array>`
- `close(): Promise<void>`

### Error Handling
All errors are thrown as instances of `ErrorVirtualBrowser` with a code and message for easier debugging.

## Types
See `VirtualBrowser.types.ts` for:
- `VirtualBrowserSetup`
- `ViewPortSetup`
- `VirtualBrowserPageSetup`
- `VirtualBrowserSuccessResponse<T>`

## Example
```typescript
import VirtualBrowser from './VirtualBrowser';

async function run() {
  const vb = new VirtualBrowser({ autoInit: true });
  await vb.init();
  const page = await vb.newPage('test', 'https://example.com');
  await page.navigate('https://google.com');
  await page.toPDF('google.pdf');
  await vb.closePage('test');
  await vb.close();
}
run();
```

## Notes
- All page and browser operations are promise-based and should be awaited.
- Errors are always thrown as `ErrorVirtualBrowser` for consistency.
- Viewport defaults to 1440x900 if not specified.
