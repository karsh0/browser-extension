import { closeWebSocket, initializeWebSocket } from "../services/websocket";

console.log('Background script loaded');

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