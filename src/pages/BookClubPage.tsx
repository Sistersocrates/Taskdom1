import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BookOpen, Users, Calendar, MessageCircle, Settings, Plus } from 'lucide-react';
import { useVoicePraiseStore } from '../store/voicePraiseStore';
import { mockBooks } from '../utils/mockData';
import BookClubChat from '../components/bookclub/BookClubChat';
import BookClubProgress from '../components/bookclub/BookClubProgress';
import BookClubDiscussion from '../components/bookclub/BookClubDiscussion';
import ReadingTimer from '../components/ReadingTimer';
import BookClubPost from '../components/bookclub/BookClubPost';

const BookClubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'chat' | 'progress' | 'discussion'>('posts');
  const [isSyncReading, setSyncReading] = useState(false);
  const playPraise = useVoicePraiseStore(state => state.playPraise);
  const [posts, setPosts] = useState([
    {
      id: '1',
      author: { name: 'Alexandria', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg' },
      content: 'Just finished chapter 10! That spicy scene was 🔥🔥🔥',
      timestamp: '2 hours ago',
      likes: 12,
      comments: 3,
    },
    {
      id: '2',
      author: { name: 'BookBae', avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg' },
      content: 'I can\'t believe what happened with the main character. I\'m shook!',
      timestamp: '1 day ago',
      likes: 5,
      comments: 1,
    },
  ]);
  const [newPostContent, setNewPostContent] = useState('');

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      const newPost = {
        id: Date.now().toString(),
        author: { name: 'You', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' },
        content: newPostContent,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    }
  };

  // Mock club data
  const clubData = {
    name: "Feral Fae Book Club",
    theme: "Fantasy Romance",
    currentBook: mockBooks[0],
    memberCount: 42,
    onlineCount: 12,
    nextReadAlong: new Date(Date.now() + 86400000), // Tomorrow
    progress: 65 // Percentage
  };

  const handleReadAlongComplete = () => {
    playPraise('session_end');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{clubData.name}</h1>
            <p className="text-neutral-500">{clubData.theme}</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" className="flex items-center">
              <Settings size={18} className="mr-2" />
              Club Settings
            </Button>
            <Button className="flex items-center">
              <Plus size={18} className="mr-2" />
              Invite Members
            </Button>
          </div>
        </div>

        {/* Club Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="flex items-center space-x-4">
              <BookOpen className="h-10 w-10 text-primary-500" />
              <div>
                <p className="text-sm text-neutral-500">Current Book</p>
                <p className="font-medium truncate">{clubData.currentBook.title}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center space-x-4">
              <Users className="h-10 w-10 text-primary-500" />
              <div>
                <p className="text-sm text-neutral-500">Members</p>
                <p className="font-medium">{clubData.onlineCount} / {clubData.memberCount} online</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center space-x-4">
              <Calendar className="h-10 w-10 text-primary-500" />
              <div>
                <p className="text-sm text-neutral-500">Next Read-Along</p>
                <p className="font-medium">Tomorrow at 8 PM</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center space-x-4">
              <MessageCircle className="h-10 w-10 text-primary-500" />
              <div>
                <p className="text-sm text-neutral-500">Club Progress</p>
                <p className="font-medium">{clubData.progress}% Complete</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Book Info & Timer */}
          <div className="space-y-6">
            <Card>
              <CardBody>
                <div className="flex items-center space-x-4">
                  <img
                    src={clubData.currentBook.coverImage}
                    alt={clubData.currentBook.title}
                    className="w-24 h-36 object-cover rounded-lg shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{clubData.currentBook.title}</h3>
                    <p className="text-neutral-500">{clubData.currentBook.author}</p>
                    <div className="mt-2">
                      <Button
                        variant={isSyncReading ? 'primary' : 'outline'}
                        onClick={() => setSyncReading(!isSyncReading)}
                        size="sm"
                      >
                        {isSyncReading ? 'Leave Sync' : 'Join Sync Reading'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {isSyncReading && (
              <Card>
                <CardHeader>
                  <h3 className="font-bold">Sync Reading Session</h3>
                </CardHeader>
                <CardBody>
                  <ReadingTimer
                    defaultMinutes={30}
                    onComplete={handleReadAlongComplete}
                  />
                </CardBody>
              </Card>
            )}
          </div>

          {/* Right Column: Chat & Discussion */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <div className="flex space-x-4">
                  <Button
                    variant={activeTab === 'posts' ? 'primary' : 'ghost'}
                    onClick={() => setActiveTab('posts')}
                  >
                    Posts
                  </Button>
                  <Button
                    variant={activeTab === 'chat' ? 'primary' : 'ghost'}
                    onClick={() => setActiveTab('chat')}
                  >
                    Live Chat
                  </Button>
                  <Button
                    variant={activeTab === 'progress' ? 'primary' : 'ghost'}
                    onClick={() => setActiveTab('progress')}
                  >
                    Progress
                  </Button>
                  <Button
                    variant={activeTab === 'discussion' ? 'primary' : 'ghost'}
                    onClick={() => setActiveTab('discussion')}
                  >
                    Discussion
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {activeTab === 'posts' && (
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="flex-1 p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 text-white"
                        rows={2}
                      />
                      <Button onClick={handleCreatePost}>Post</Button>
                    </div>
                    <div className="space-y-4">
                      {posts.map(post => (
                        <BookClubPost key={post.id} post={post} />
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'chat' && <BookClubChat />}
                {activeTab === 'progress' && <BookClubProgress />}
                {activeTab === 'discussion' && <BookClubDiscussion />}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookClubPage;