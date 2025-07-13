import React from 'react';
import { Share2 } from 'lucide-react';
import SocialShareButton from './social/SocialShareButton';
import { useSocialShare } from '../hooks/useSocialShare';
import { Book } from '../types';
import { cn } from '../utils/cn';

interface QuickShareButtonsProps {
  type: 'progress' | 'streak' | 'achievement';
  data: {
    book?: Book;
    streakDays?: number;
    achievement?: string;
    achievementData?: any;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'minimal' | 'full';
}

const QuickShareButtons: React.FC<QuickShareButtonsProps> = ({
  type,
  data,
  className,
  size = 'sm',
  variant = 'minimal'
}) => {
  const {
    shareProgress,
    shareStreak,
    shareAchievement,
    shareToFacebook,
    shareToInstagram,
    shareToSnapchat,
    openShareModal,
  } = useSocialShare();

  const handleShare = (platform: 'facebook' | 'instagram' | 'snapchat' | 'twitter' | 'copy' | 'modal') => {
    let content;
    switch (type) {
      case 'progress':
        if (data.book) content = { text: `I'm reading ${data.book.title}!`, url: window.location.href };
        break;
      case 'streak':
        if (data.streakDays) content = { text: `I'm on a ${data.streakDays}-day reading streak!`, url: window.location.href };
        break;
      case 'achievement':
        if (data.achievement) content = { text: `I just unlocked the ${data.achievement} achievement!`, url: window.location.href };
        break;
    }

    if (!content) return;

    switch (platform) {
      case 'facebook':
        shareToFacebook(content);
        break;
      case 'instagram':
        shareToInstagram(content);
        break;
      case 'snapchat':
        shareToSnapchat(content);
        break;
      case 'modal':
        openShareModal(content);
        break;
    }
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={() => handleShare('modal')}
        className={cn(
          'inline-flex items-center text-gray-400 hover:text-red-400 transition-colors',
          className
        )}
        title="Share this achievement"
      >
        <Share2 size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
      </button>
    );
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <span className="text-sm text-gray-400">Share:</span>
      <div className="flex space-x-1">
        <SocialShareButton
          platform="facebook"
          onClick={() => handleShare('facebook')}
          variant="icon"
          size={size}
        />
        <SocialShareButton
          platform="instagram"
          onClick={() => handleShare('instagram')}
          variant="icon"
          size={size}
        />
        <SocialShareButton
          platform="snapchat"
          onClick={() => handleShare('snapchat')}
          variant="icon"
          size={size}
        />
        <SocialShareButton
          platform="twitter"
          onClick={() => handleShare('twitter')}
          variant="icon"
          size={size}
        />
        <SocialShareButton
          platform="copy"
          onClick={() => handleShare('copy')}
          variant="icon"
          size={size}
        />
      </div>
    </div>
  );
};

export default QuickShareButtons;