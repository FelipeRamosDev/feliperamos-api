# feliperamos-cv (v1.0.0)

This app is a chatbot powered by my personal assistant. It was trained to answer questions about my career, acting as a live, interactive resumé. Recruiters can ask it anything they’d like to know about my professional background.
A modular, scalable Node.js/TypeScript backend for AI-powered Slack applications, built with a cluster/thread architecture and Redis-based event routing.

---

## Overview

This project is designed to manage AI-powered Slack bots using a robust, multi-process architecture. It leverages Node.js clusters and worker threads to scale across CPU cores, and uses Redis (via ioredis) for efficient inter-process communication and event routing.

**Key features:**
- **Cluster/Core/Thread Architecture:**  
  - `Cluster` manages multiple `Core` processes (workers), each of which can manage multiple `Thread` instances.
  - Each `Thread` can handle specific tasks, such as Slack event processing or AI inference.
- **Slack Integration:**  
  - Uses [@slack/bolt](https://slack.dev/bolt-js/) for Slack app event handling.
  - Associates Slack users with AI conversation threads for context-aware responses.
- **OpenAI Integration:**  
  - Provides a modular AI service for managing OpenAI assistant interactions, thread management, and message handling.
- **Redis Pub/Sub:**  
  - Uses Redis channels for fast, decoupled event and message passing between processes.
- **Extensible Event Routing:**  
  - Event endpoints are defined and subscribed to dynamically, supporting custom controllers and callback patterns.
- **Robust Error Handling:**  
  - Centralized error model for consistent error reporting and logging.

---

## Main Components

- **ClusterManager**  
  - `Cluster`: Orchestrates worker processes and routes.
  - `Core`: Manages threads and worker lifecycle.
  - `Thread`: Handles specific tasks in worker threads.
  - `InstanceBase`: Shared logic for data storage, routing, and Redis messaging.

- **SlackApp**  
  - Encapsulates the Slack Bolt app, manages AI thread associations, and provides utility methods for Slack event handling.

- **AI Service**  
  - Handles OpenAI API interactions, thread/message management, and response generation.

- **EventEndpoint**  
  - Defines and manages event routes, subscribes to Redis channels, and invokes controllers on message receipt.

- **ErrorModel**  
  - Standardizes error structure, logging, and reporting.

---

## Example: Cluster Initialization

```typescript
import Cluster from './src/services/ClusterManager/Cluster';
import slackAppCore from './src/cluster/core/slack-app.core';
import aiCPUCore from './src/cluster/core/ai-cpu.core';

new Cluster({
   tagName: 'feliperamos-cv',
   cores: [ slackAppCore, aiCPUCore ],
   onReady: () => {
      console.log('[CLUSTER] Cluster is ready!');
   },
   onError: (err) => {
      toError('Something went wrong with the cluster!');
   },
   onClose: () => {
      console.log('[CLUSTER] The cluster was closed!');
   }
});
```

---

## Example: Slack Message Handling

```typescript
slack.onMessage(async ({ message, say }) => {
   const feedbackTime1 = setTimeout(() => {
      say(`_Thinking... I'll have a response for you shortly!_`);
   }, 1000);

   const feedbackTime2 = setTimeout(() => {
      say(`_One moment while I get that information for you..._`);
   }, 5000);

   slack.askAssistant(message, async ({ error, data, output, threadID }) => {
      clearTimeout(feedbackTime1);
      clearTimeout(feedbackTime2);

      if (error) {
         return toError(`Something went wrong with askAssistant request! Error caught.`);
      }

      slack.setAiThread(message.user, threadID);
   });
});
```

---

## Project Structure

- `src/services/ClusterManager/` — Cluster, Core, Thread, and InstanceBase classes to create a cluster.
- `src/services/SlackApp/` — SlackApp integration with Slack API.
- `src/services/AI/` — OpenAI API integration and thread/message management.
- `src/models/` — EventEndpoint, ErrorModel, and project models.
- `src/cluster/routes/` — Event endpoint route definitions.
- `src/cluster/core/` — The code that will create a Core under the cluster, a fork on the cluster.
- `src/types/` — TypeScript type definitions

---

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure environment variables:**  
   Create a `.env` file with your Slack and OpenAI credentials.

3. **Build the project:**
   ```sh
   npm run build
   ```

4. **Start the cluster:**
   ```sh
   npm run start
   ```

---

## License

MIT License

---