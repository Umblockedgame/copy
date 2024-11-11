import React from 'react';
import { Link } from 'react-router-dom';
import type { Video } from '../types';

interface VideoCardProps {
  video: Video;
  compact?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, compact }) => {
  if (compact) {
    return (
      <Link
        to={`/watch/${video.id}`}
        className="flex gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-40 aspect-video object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold line-clamp-2">{video.title}</h3>
          <p className="text-xs text-gray-600 mt-1">{video.channelTitle}</p>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <span>{video.viewCount} views</span>
            <span className="mx-1">•</span>
            <span>{video.publishedAt}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <Link to={`/watch/${video.id}`} className="block">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2 mb-2">{video.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <span>{video.channelTitle}</span>
            <span className="mx-2">•</span>
            <span>{video.viewCount} views</span>
            <span className="mx-2">•</span>
            <span>{video.publishedAt}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;