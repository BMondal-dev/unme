export type CallLog = {
  id: string;
  name: string;
  avatar: string;
  time: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration?: string;
  isVideo: boolean;
};
