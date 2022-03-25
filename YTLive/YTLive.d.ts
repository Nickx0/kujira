export declare class YTLive {
  
  liveId?: String;
  id: { channelId: string; } | { liveId: string; };
  data: any;
  constructor(id: { channelId: string; } | { liveId: string; });
  getLiveData(): void;
  getLiveinformation(data: any): any;
  isVideo(): boolean;
  isPremiere(): boolean;
  isStream(): boolean;
  isWaiting(): boolean;
  isLiveNow(): boolean;
  isFinished(): boolean;
  isLowLatencyLiveStream(): boolean;
  isPrivate(): boolean;
  isUnlisted(): boolean;
  getChannelId(): any;
  getProfileInfo(): any;
  isRegressless(): any;
  getVideoInfo(): any;
  getStartTime(): any;
  getScheduledStartTime(): number;
  getliveBroadcastDetails(): any;
  getViewCount(): any;
  getDuration(): any;
  getTitle(): any;
}
