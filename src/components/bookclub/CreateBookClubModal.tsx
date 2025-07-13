import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { X, Users } from 'lucide-react';

interface CreateBookClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClub: (club: { name: string, description: string }) => void;
}

const CreateBookClubModal: React.FC<CreateBookClubModalProps> = ({ isOpen, onClose, onCreateClub }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      onCreateClub({ name, description });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Users className="mr-2" />
            Create Book Club
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X />
          </Button>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Club Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Spicy Romance Readers"
              fullWidth
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of your club"
              className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 text-white"
              rows={3}
              required
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Create Club
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateBookClubModal;
