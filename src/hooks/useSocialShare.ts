import { useState } from 'react';
import { ShareableContent, ShareableContentGenerator } from '../components/social/ShareableContentGenerator';
import { Book, User } from '../types';
import { useUserStore } from '../store/userStore';

export const useSocialShare = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareContent, setShareContent] = useState<ShareableContent | null>(null);
  const { user } = useUserStore();

  const openShareModal = (content: ShareableContent) => {
    setShareContent(content);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setShareContent(null);
  };

  const shareProgress = (book: Book) => {
    if (!user) return;
    const content = ShareableContentGenerator.generateProgressShare(book, user);
    openShareModal(content);
  };

  const shareStreak = (streakDays: number) => {
    if (!user) return;
    const content = ShareableContentGenerator.generateStreakShare(streakDays, user);
    openShareModal(content);
  };

  const shareTBR = (books: Book[]) => {
    if (!user) return;
    const content = ShareableContentGenerator.generateTBRShare(books, user);
    openShareModal(content);
  };

  const shareReadingList = (books: Book[]) => {
    if (!user) return;
    const content = ShareableContentGenerator.generateReadingListShare(books, user);
    openShareModal(content);
  };

  const shareAchievement = (achievement: string, data: any = {}) => {
    if (!user) return;
    const content = ShareableContentGenerator.generateAchievementShare(achievement, data, user);
    openShareModal(content);
  };

  const shareBookReview = (book: Book, review: string, rating: number) => {
    if (!user) return;
    const content = ShareableContentGenerator.generateBookReviewShare(book, review, rating, user);
    openShareModal(content);
  };

  return {
    isShareModalOpen,
    shareContent,
    openShareModal,
    closeShareModal,
    shareProgress,
    shareStreak,
    shareTBR,
    shareReadingList,
    shareAchievement,
    shareBookReview,
    shareToFacebook,
    shareToInstagram,
    shareToSnapchat
  };

  function shareToFacebook(content: ShareableContent) {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content.url || window.location.href)}&quote=${encodeURIComponent(content.text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function shareToInstagram(content: ShareableContent) {
    // Instagram sharing from web is limited. The common approach is to copy the text and let the user paste it.
    navigator.clipboard.writeText(`${content.text} ${content.url || ''}`);
    alert('Copied to clipboard! You can now paste this in your Instagram story or post.');
  }

  function shareToSnapchat(content: ShareableContent) {
    // Snapchat sharing is also limited.
    navigator.clipboard.writeText(`${content.text} ${content.url || ''}`);
    alert('Copied to clipboard! You can now paste this in your Snapchat story.');
  }
};