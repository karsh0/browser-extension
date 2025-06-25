import { closeWebSocket, initializeWebSocket } from "../services/websocket";
import { tabTracing } from "../services/tabTracking";

console.log('Background script loaded');

tabTracing();

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  initializeWebSocket();
});

chrome.runtime.onStartup.addListener(() => {
  console.log('browser started');
  initializeWebSocket();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LOGIN_SUCCESS'){
    initializeWebSocket();
  } else if (message.type === 'LOGOUT') {
    closeWebSocket();
  } else if (message.type === 'POPUP_OPENED') {
    initializeWebSocket();
  }

  return true;
});