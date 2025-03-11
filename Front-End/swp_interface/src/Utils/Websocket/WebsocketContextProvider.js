import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getUsername } from '../UserInfoUtils';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const username = getUsername();
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:9999/ws',
      connectHeaders: {},
      webSocketFactory: () => new SockJS('http://localhost:9999/ws'),
      onConnect: () => {
        console.log('Kết nối thành công!');
        client.subscribe(`/user/${username}/private`, (message) => {
          const notification = JSON.parse(message.body);
          setMessages(notification);
        });
      },
      debug: (str) => console.log(str),
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, [username]);

  return (
    <WebSocketContext.Provider value={{ stompClient, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);