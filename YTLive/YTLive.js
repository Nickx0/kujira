"use strict";
const axios = require("axios")

class YTLive {
  constructor(id) {
    if (!id || (!("channelId" in id) && !("liveId" in id))) {
      throw new Error("Required channelId or liveId.");
    }
    else if ("liveId" in id) {
      this.liveId = id.liveId;
    }
    this.id = id;
  }
  async getLiveData() {
    const url = "channelId" in this.id
      ? `https://www.youtube.com/channel/${this.id.channelId}/live`
      : `https://www.youtube.com/watch?v=${this.id.liveId}`;
    let res = await axios.default.get(url)
      .then(response => {
        return this.getLiveinformation(response.data.toString());
      })
      .catch(error => {
        console.log(error)
      });
    this.data = res;
    this.liveId = res.videoDetails.videoId
    return this;
  }
  getLiveinformation(data) {
    let LiveInfo;
    const info = data.match(/var ytInitialPlayerResponse = (.+?)};/);
    if (info) {
      LiveInfo = JSON.parse(info[1].toString() + '}');
    } else {
      throw new Error("Live Stream was not found");
    }
    return LiveInfo;
  }
  isVideo() {
    return !this.data.videoDetails.isLiveContent;
  }
  isWaiting() {
    return  (this.data.videoDetails.isUpcoming) ? this.data.videoDetails.isUpcoming : false;
  }
  isPremiere() {
    return (!this.data.videoDetails.isLiveContent) ? (this.data.videoDetails.isUpcoming) ? this.data.videoDetails.isUpcoming : false : false;
  }
  isLiveStream() {
    return this.data.videoDetails.isLiveContent;
  }
  isLiveNow() {
    return (this.data.videoDetails.isLive) ? this.data.videoDetails.isLive : false;
  }
  isFinished() {
    return (this.data.videoDetails.isPostLiveDvr) ? this.data.videoDetails.isPostLiveDvr : false;
  }
  isLowLatencyLiveStream() {
    return this.data.videoDetails.isLowLatencyLiveStream;
  }
  isPrivate() {
    return (this.data.playabilityStatus.status === 'LOGIN_REQUIRED');
  }
  isUnlisted() {
    if("channelId" in this.id){
      return this.data.microformat.microformatDataRenderer.unlisted;
    }else{
      return this.data.microformat.playerMicroformatRenderer.isUnlisted;
    }
  }
  getProfileInfo() {
    let channel = this.data.videoDetails.channelId;
    let author = this.data.videoDetails.author;
    let isFamilySafe;
    if("channelId" in this.id){
      isFamilySafe = this.data.microformat.microformatDataRenderer.familySafe;
    }else{
      isFamilySafe = this.data.microformat.playerMicroformatRenderer.familySafe;
    }
    return { channel, author, isFamilySafe };
  }
  isRegressless() {
    return !this.data.videoDetails.isLiveDvrEnabled;
  }
  getThumbnails() {
    return this.data.videoDetails.thumbnail;
  }
  getVideoInfo() {
    let videoDetails = this.data.videoDetails;
    let title = videoDetails.title;
    let description = videoDetails.shortDescription;
    let thumbnail = this.data.videoDetails.thumbnail;
    let viewCount = this.data.videoDetails.viewCount;
    let isRegressless = !videoDetails.isLiveDvrEnabled;
    let isLiveStream = this.data.videoDetails.isLiveContent;
    let isLiveNow = (videoDetails.isLive) ? videoDetails.isLive : false;
    let keywords = videoDetails.keywords;
    let publishDate;
    let uploadDate;
    let category;
    let liveBroadcastDetails;
    let isUnlisted;
    if("channelId" in this.id){
      publishDate = this.data.microformat.microformatDataRenderer.publishDate;
      uploadDate = this.data.microformat.microformatDataRenderer.uploadDate;
      category = this.data.microformat.microformatDataRenderer.category;
      isUnlisted = this.data.microformat.microformatDataRenderer.unlisted;
    }else{
      publishDate = this.data.microformat.playerMicroformatRenderer.publishDate;
      uploadDate = this.data.microformat.playerMicroformatRenderer.uploadDate;
      category = this.data.microformat.playerMicroformatRenderer.category;
      liveBroadcastDetails = this.data.microformat.playerMicroformatRenderer.liveBroadcastDetails;
      isUnlisted = this.data.microformat.playerMicroformatRenderer.isUnlisted;
    }
    
    return { title, description, category, keywords, publishDate, uploadDate,thumbnail,viewCount, isLiveStream, isLiveNow, isRegressless, isUnlisted, liveBroadcastDetails };
    
  }
  getStartTime() {
    if("channelId" in this.id){
      return this.data.microformat.microformatDataRenderer.liveBroadcastDetails.startTimestamp;
    }else{
      return this.data.microformat.playerMicroformatRenderer.liveBroadcastDetails.startTimestamp;
    }
  }
  getliveBroadcastDetails() {
    if("channelId" in this.id){
      return this.data.microformat.microformatDataRenderer.liveBroadcastDetails;
    }else{
      return this.data.microformat.playerMicroformatRenderer.liveBroadcastDetails;
    }
  }
  getViewCount(){
    return this.data.videoDetails.viewCount;
  }
}
exports.YTLive = YTLive;
