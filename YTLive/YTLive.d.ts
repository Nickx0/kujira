export declare class YTLive {
  
  liveId?: String;
  id: { channelId: string; } | { liveId: string; };
  data: any;
  constructor(id: { channelId: string; } | { liveId: string; });
  getLiveData(): ThisType;
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
  getProfileInfo(): any;
  isRegressless(): any;
  getVideoInfo(): any;
  getStartTime(): any;
  getliveBroadcastDetails(): any;
}
