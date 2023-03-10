export enum ChatClientEvents {
  NEW_MESSAGE = 'NEW_MESSAGE',
  INVITED_TO_CHAT = 'INVITED_TO_CHAT',
  HISTORY_CHANGED = 'HISTORY_CHANGED',
  NEW_CHAT = 'NEW_CHAT',
  NEW_CHATS = 'NEW_CHATS',
  ERROR = 'ERROR',
}

export enum ChatServerEvents {
  GET_AND_SUBSCRIBE_CHATS = 'GET_AND_SUBSCRIBE_CHATS',
  SEND_MESSAGE = 'SEND_MESSAGE',
  LEAVE_CHAT = 'LEAVE_CHAT',
  INVITE_TO_CHAT = 'INVITE_TO_CHAT',
  CREATE_CHAT = 'CREATE_CHAT',
  CHANGE_HISTORY = 'CHANGE_HISTORY',
}

export enum WebRTCSignalingServerEvents {
  INITIALIZATION = 'INITIALIZATION',
  REQUEST = 'REQUEST',
  CALL = 'CALL',
  END = 'END',
  DISCONNECT = 'DISCONNECT',
  JOIN_ROOM = 'JOIN_ROOM',
}

export enum WebRTCSignalingClientEvents {
  INITIALIZATION = 'INITIALIZATION',
  NEW_MEMBER = 'NEW_MEMBER',
  REQUEST = 'REQUEST',
  CALL = 'CALL',
  END = 'END',
  DISCONNECT = 'DISCONNECT',
}
