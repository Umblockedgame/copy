export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
}

export interface VideoDetails extends Video {
  videoUrl: string;
  channelId: string;
  channelThumbnail: string;
  isVerified: boolean;
  subscriberCount: string;
}

export interface Comment {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textDisplay: string;
  likeCount: string;
  publishedAt: string;
}

export interface Channel {
  id: string;
  title: string;
  thumbnail: string;
  subscriberCount: string;
  isVerified: boolean;
}