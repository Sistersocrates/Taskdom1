import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Plus, Users } from 'lucide-react';
import CreateBookClubModal from './CreateBookClubModal';

const BookClubSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clubs, setClubs] = useState([
    { id: '1', name: 'Spicy Romance Readers', members: 24, description: 'A club for fans of spicy romance novels.' },
    { id: '2', name: 'Fantasy Worlds', members: 12, description: 'Exploring new fantasy worlds together.' },
  ]);

  const handleCreateClub = (club: { name: string, description: string }) => {
    setClubs([...clubs, { ...club, id: Date.now().toString(), members: 1 }]);
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Users className="mr-2" />
          Book Clubs
        </h2>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Club
        </Button>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {clubs.map(club => (
            <div key={club.id} className="p-4 bg-gray-800 rounded-lg">
              <h3 className="font-semibold text-white">{club.name}</h3>
              <p className="text-sm text-gray-400">{club.description}</p>
              <div className="text-xs text-gray-500 mt-2">{club.members} members</div>
            </div>
          ))}
        </div>
      </CardBody>
      <CreateBookClubModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateClub={handleCreateClub}
      />
    </Card>
  );
};

export default BookClubSection;
