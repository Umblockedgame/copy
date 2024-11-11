const YOUTUBE_API_KEY = 'AIzaSyB3tYpQkf6NIrB_iO3XNb2zzo7HqvRPd28';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export const searchYouTubeVideos = async (query: string, pageToken?: string | null) => {
  const params = new URLSearchParams({
    part: 'snippet,statistics',
    maxResults: '12',
    q: query,
    type: 'video',
    key: YOUTUBE_API_KEY,
  });

  if (pageToken) {
    params.append('pageToken', pageToken);
  }

  const response = await fetch(`${YOUTUBE_API_BASE}/search?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch videos');
  }

  return {
    items: data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
      viewCount: formatViewCount(item.statistics?.viewCount),
    })),
    nextPageToken: data.nextPageToken || null,
  };
};

export const getTrendingVideos = async (pageToken?: string | null) => {
  const params = new URLSearchParams({
    part: 'snippet,statistics',
    chart: 'mostPopular',
    maxResults: '12',
    key: YOUTUBE_API_KEY,
    regionCode: 'US',
  });

  if (pageToken) {
    params.append('pageToken', pageToken);
  }

  const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch trending videos');
  }

  return {
    items: data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
      viewCount: formatViewCount(item.statistics.viewCount),
    })),
    nextPageToken: data.nextPageToken || null,
  };
};

export const getVideoDetails = async (videoId: string) => {
  // First, get video details and channel info
  const videoParams = new URLSearchParams({
    part: 'snippet,statistics',
    id: videoId,
    key: YOUTUBE_API_KEY,
  });

  const videoResponse = await fetch(`${YOUTUBE_API_BASE}/videos?${videoParams}`);
  const videoData = await videoResponse.json();

  if (!videoResponse.ok || !videoData.items?.[0]) {
    throw new Error('Failed to fetch video details');
  }

  const video = videoData.items[0];
  const channelId = video.snippet.channelId;

  // Get channel details
  const channelParams = new URLSearchParams({
    part: 'snippet,statistics',
    id: channelId,
    key: YOUTUBE_API_KEY,
  });

  const channelResponse = await fetch(`${YOUTUBE_API_BASE}/channels?${channelParams}`);
  const channelData = await channelResponse.json();

  if (!channelResponse.ok || !channelData.items?.[0]) {
    throw new Error('Failed to fetch channel details');
  }

  const channel = channelData.items[0];

  // Get video URL using yt-dlp (this would be implemented on the server side)
  const videoUrl = await getVideoUrl(videoId);

  return {
    id: video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
    videoUrl,
    channelId: channel.id,
    channelTitle: channel.snippet.title,
    channelThumbnail: channel.snippet.thumbnails.default.url,
    isVerified: channel.snippet.customUrl != null,
    subscriberCount: formatSubscriberCount(channel.statistics.subscriberCount),
    viewCount: formatViewCount(video.statistics.viewCount),
    publishedAt: new Date(video.snippet.publishedAt).toLocaleDateString(),
  };
};

export const getRelatedVideos = async (videoId: string) => {
  const params = new URLSearchParams({
    part: 'snippet,statistics',
    relatedToVideoId: videoId,
    type: 'video',
    maxResults: '15',
    key: YOUTUBE_API_KEY,
  });

  const response = await fetch(`${YOUTUBE_API_BASE}/search?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Failed to fetch related videos');
  }

  return {
    items: data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
      viewCount: formatViewCount(item.statistics?.viewCount),
    })),
  };
};

export const getVideoComments = async (videoId: string) => {
  const params = new URLSearchParams({
    part: 'snippet',
    videoId,
    order: 'relevance',
    maxResults: '50',
    key: YOUTUBE_API_KEY,
  });

  const response = await fetch(`${YOUTUBE_API_BASE}/commentThreads?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  return {
    items: data.items.map((item: any) => ({
      id: item.id,
      authorDisplayName: item.snippet.topLevelComment.snippet.authorDisplayName,
      authorProfileImageUrl: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
      textDisplay: item.snippet.topLevelComment.snippet.textDisplay,
      likeCount: formatLikeCount(item.snippet.topLevelComment.snippet.likeCount),
      publishedAt: formatCommentDate(item.snippet.topLevelComment.snippet.publishedAt),
    })),
  };
};

// Mock function for getting video URL (would be implemented on server side with yt-dlp)
const getVideoUrl = async (videoId: string) => {
  // This would actually call yt-dlp on the server
  return `https://example.com/video/${videoId}`;
};

const formatViewCount = (count: string) => {
  const num = parseInt(count, 10);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatSubscriberCount = (count: string) => {
  const num = parseInt(count, 10);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatLikeCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const formatCommentDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};