---
title: "SSE vs WebSockets"
date: 2024-05-22
description: "Comparing Server-Sent Events and WebSockets for real-time communication — unidirectional server push versus full-duplex bidirectional messaging, and where each fits."
tags: ["real-time", "websockets", "sse"]
readingTime: "3 min"
draft: false
---

## Server-Sent Events

Server-Sent Events (SSE) is a technology that allows a server to push real-time updates to a client over an HTTP connection. It enables servers to send updates as they happen, eliminating the need for clients to constantly poll for new data. Common use cases:

- **Real-time notifications**: chat messages, social media updates, stock price changes.
- **Live data updates**: updating a dashboard with real-time analytics, or displaying live scores for sporting events.
- **Server-to-client communication**: a simple, efficient way for servers to push data without clients needing to initiate requests.
- **IoT applications**: real-time communication between devices and servers.

SSE is supported by most modern web browsers, making it a convenient solution for web applications that need real-time updates. It's worth noting that SSE is unidirectional — clients can't send updates back to the server over the same channel. For bidirectional communication, WebSockets or long polling are the better fit.

## WebSockets

WebSocket is a communication protocol that provides full-duplex, bidirectional communication between a client and server over a single, long-lived TCP connection. It enables low-latency, event-driven communication, letting either side send messages at any time.

- **Initialization**: WebSocket connections start as an HTTP connection with an upgrade request, followed by a handshake between client and server.
- **Full-duplex**: client and server can send messages concurrently without waiting for a response.
- **Event-driven**: either side can initiate a message transfer when a specific event occurs.
- **Low latency**: no need to open a new connection for each request, unlike traditional HTTP.

Common use cases:

- **Real-time chat applications** — instant messaging without frequent polling or page refreshes.
- **Multiplayer games** — real-time data transfer between game server and clients.
- **Stock market data** — real-time price updates for traders.
- **IoT devices** — real-time monitoring and control.
- **Collaborative editing** — live updates as others make changes.

## Further reading

- [SSE vs WebSockets: Comparing Real-Time Communication Protocols](https://softwaremill.com/sse-vs-websockets-comparing-real-time-communication-protocols)
- [MDN: WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [MDN: Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [web.dev: EventSource basics](https://web.dev/articles/eventsource-basics)
