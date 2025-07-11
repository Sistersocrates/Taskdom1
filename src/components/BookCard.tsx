import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { Card, CardBody } from './ui/Card';
import ProgressBar from './ui/ProgressBar';
import ReadingProgressIndicator from './ReadingProgressIndicator';
import SpiceRating from './SpiceRating';
import { cn } from '../utils/cn';
import { BookOpen, Bookmark, Loader2, Image, Play } from 'lucide-react';
import { bookCoverService } from '../services/bookCoverService';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
  className?: string;
  showSyncedProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onClick, 
  className,
  showSyncedProgress = true,
  size = 'md'
}) => {
  const [coverImage, setCoverImage] = useState<string>(book.coverImage);
  const [isLoadingCover, setIsLoadingCover] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const progress = Math.round((book.currentPage / book.totalPages) * 100) || 0;

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-32',
      cover: 'h-48', // 9:16 ratio for small
      title: 'text-sm',
      author: 'text-xs',
      spacing: 'space-y-2'
    },
    md: {
      container: 'w-40',
      cover: 'h-60', // 9:16 ratio for medium
      title: 'text-base',
      author: 'text-sm',
      spacing: 'space-y-3'
    },
    lg: {
      container: 'w-48',
      cover: 'h-72', // 9:16 ratio for large
      title: 'text-lg',
      author: 'text-base',
      spacing: 'space-y-4'
    }
  };

  const config = sizeConfig[size];

  // Fetch enhanced cover image
  useEffect(() => {
    const fetchEnhancedCover = async () => {
      if (retryCount > 2) return; // Limit retries
      if (!book.title && !book.isbn) return;

      setIsLoadingCover(true);
      setCoverError(false);

      try {
        console.log(`Fetching enhanced cover for BookCard: ${book.title}`);
        const enhancedCover = await bookCoverService.getBestCoverImage(book);
        
        if (enhancedCover && enhancedCover !== coverImage) {
          console.log(`Setting enhanced cover for ${book.title}`);
          setCoverImage(enhancedCover);
        }
      } catch (error) {
        console.error(`Error fetching enhanced cover for ${book.title}:`, error);
        setCoverError(true);
      } finally {
        setIsLoadingCover(false);
      }
    };

    fetchEnhancedCover();
  }, [book, retryCount]);

  const handleImageError = async () => {
    setCoverError(true);
    setRetryCount(prev => prev + 1);
    
    try {
      setIsLoadingCover(true);
      // Try to get a fallback cover
      const fallbackCover = await bookCoverService.getBestCoverImage({
        ...book,
        coverImage: undefined // Force a fresh search
      });
      
      if (fallbackCover && fallbackCover !== coverImage) {
        setCoverImage(fallbackCover);
        setCoverError(false);
      } else {
        // Ultimate fallback
        setCoverImage('https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg');
      }
    } catch (error) {
      console.error(`Failed to fetch fallback cover for ${book.title}:`, error);
      setCoverImage('https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg');
    } finally {
      setIsLoadingCover(false);
    }
  };
  
  // Render status badge
  const renderStatusBadge = () => {
    const statusStyles = {
      currentlyReading: 'bg-accent/20 text-accent-text border-accent/50',
      wantToRead: 'bg-secondary-600/20 text-secondary-300 border-secondary-600/50',
      finished: 'bg-success-600/20 text-success-300 border-success-600/50',
      dnf: 'bg-neutral-600/20 text-neutral-300 border-neutral-600/50'
    };
    
    const statusLabels = {
      currentlyReading: 'Reading',
      wantToRead: 'Want to Read',
      finished: 'Finished',
      dnf: 'DNF'
    };
    
    return (
      <span className={cn(
        'text-xs px-2 py-1 rounded-full font-medium border backdrop-blur-sm',
        statusStyles[book.status]
      )}>
        {statusLabels[book.status]}
      </span>
    );
  };
  
  return (
    <Card 
      className={cn(
        'transition-all duration-300 hover:shadow-red cursor-pointer overflow-hidden',
        config.container,
        className
      )}
      hover
    >
      <div onClick={onClick} className={cn('flex flex-col h-full', config.spacing)}>
        {/* Book Cover with 9:16 Aspect Ratio */}
        <div className={cn('relative overflow-hidden rounded-lg', config.cover)}>
          {isLoadingCover && (
            <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          )}
          
          {coverError ? (
            <div className="w-full h-full bg-card flex items-center justify-center border border-border rounded-lg">
              <div className="text-center p-4">
                <Image className="h-8 w-8 text-border mx-auto mb-2" />
                <p className="text-xs text-secondary-text">No cover available</p>
              </div>
            </div>
          ) : (
            <img 
              src={coverImage} 
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={handleImageError}
              loading="lazy"
            />
          )}
          
          {/* Status Badge Overlay */}
          <div className="absolute top-2 right-2">
            {renderStatusBadge()}
          </div>

          {/* Progress Overlay for Currently Reading */}
          {book.status === 'currentlyReading' && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <div className="text-xs text-white mb-1">
                {progress}% complete
              </div>
              <ProgressBar value={progress} height="sm" color="primary" />
            </div>
          )}
        </div>
        
        {/* Book Information */}
        <CardBody className="flex flex-col flex-grow p-3">
          <h3 className={cn('font-bold mb-1 line-clamp-2 font-cinzel text-primary-text', config.title)}>
            {book.title}
          </h3>
          <p className={cn('text-secondary-text mb-2 line-clamp-1', config.author)}>
            {book.author}
          </p>
          
          {/* Spice Rating */}
          <div className="mb-2">
            <SpiceRating 
              value={book.spiceRating} 
              readonly 
              size={size === 'sm' ? 'sm' : 'md'} 
            />
          </div>

          {/* Reading Progress for Currently Reading Books */}
          {book.status === 'currentlyReading' && showSyncedProgress && (
            <div className="mb-2">
              <ReadingProgressIndicator 
                bookId={book.id} 
                showDetails={false}
              />
            </div>
          )}

          {/* Spicy Scenes Count */}
          {book.spicyScenes && book.spicyScenes.length > 0 && (
            <div className="flex items-center text-xs text-accent mb-2">
              <Bookmark size={12} className="mr-1" />
              {book.spicyScenes.length} spicy scene{book.spicyScenes.length !== 1 ? 's' : ''}
            </div>
          )}
          
          {/* Tropes */}
          {book.tropes && book.tropes.length > 0 && (
            <div className="mt-auto">
              <div className="flex flex-wrap gap-1">
                {book.tropes.slice(0, 2).map((trope, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-card text-secondary-text px-2 py-0.5 rounded-full border border-border"
                  >
                    {trope}
                  </span>
                ))}
                {book.tropes.length > 2 && (
                  <span className="text-xs text-secondary-text">
                    +{book.tropes.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </CardBody>
      </div>
    </Card>
  );
};

export default BookCard;