import React from 'react';
import { ThumbsUp } from 'lucide-react';
import type { Comment } from '../types';

interface CommentSectionProps {
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <img
              src={comment.authorProfileImageUrl}
              alt={comment.authorDisplayName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.authorDisplayName}</span>
                <span className="text-sm text-gray-500">{comment.publishedAt}</span>
              </div>
              <p className="mt-1">{comment.textDisplay}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <ThumbsUp className="w-4 h-4" />
                <span>{comment.likeCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;