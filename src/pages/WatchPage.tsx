import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import VideoCard from '../components/VideoCard';
import CommentSection from '../components/CommentSection';
import { getVideoDetails, getRelatedVideos, getVideoComments } from '../services/youtube';
import type { VideoDetails, Video, Comment } from '../types';

const WatchPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideoData = async () => {
      if (!videoId) return;
      setLoading(true);
      try {
        const [videoData, relatedData, commentsData] = await Promise.all([
          getVideoDetails(videoId),
          getRelatedVideos(videoId),
          getVideoComments(videoId)
        ]);
        setVideo(videoData);
        setRelatedVideos(relatedData.items);
        setComments(commentsData.items);
      } catch (error) {
        console.error('Error loading video data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideoData();
  }, [videoId]);

  if (loading || !video) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1">
        <VideoPlayer video={video} />
        <CommentSection comments={comments} />
      </div>
      
      <div className="w-[400px] flex-shrink-0">
        <h2 className="text-lg font-semibold mb-4">Related Videos</h2>
        <div className="space-y-3">
          {relatedVideos.map((video) => (
            <VideoCard key={video.id} video={video} compact />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;