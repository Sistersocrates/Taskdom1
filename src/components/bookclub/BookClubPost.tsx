import React from 'react';
import { Card, CardBody } from '../ui/Card';
import { MessageSquare, ThumbsUp } from 'lucide-react';

interface BookClubPostProps {
  post: {
    id: string;
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    timestamp: string;
    likes: number;
    comments: number;
  };
}

const BookClubPost: React.FC<BookClubPostProps> = ({ post }) => {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-white">
            {post.author.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white">{post.author.name}</p>
              <p className="text-xs text-gray-500">{post.timestamp}</p>
            </div>
            <p className="text-gray-300 mt-1">{post.content}</p>
            <div className="flex items-center space-x-4 mt-4 text-gray-400">
              <button className="flex items-center space-x-1 hover:text-primary-500">
                <ThumbsUp size={16} />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-primary-500">
                <MessageSquare size={16} />
                <span>{post.comments}</span>
              </button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default BookClubPost;
