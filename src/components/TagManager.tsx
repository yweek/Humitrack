import React, { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';
import { UserTag } from '../types';
import { defaultTags } from '../data/cigarDatabase';

interface TagManagerProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  userTags: UserTag[];
  onCreateTag: (tag: Omit<UserTag, 'id'>) => void;
}

const tagColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-red-100 text-red-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-gray-100 text-gray-800'
];

export default function TagManager({ selectedTags, onTagsChange, userTags, onCreateTag }: TagManagerProps) {
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(tagColors[0]);

  const allTags = [...defaultTags, ...userTags];

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter(t => t !== tagName));
    } else {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      onCreateTag({
        name: newTagName.trim(),
        color: selectedColor
      });
      setNewTagName('');
      setShowCreateTag(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <button
          type="button"
          onClick={() => setShowCreateTag(!showCreateTag)}
          className="text-amber-600 hover:text-amber-700 flex items-center space-x-1 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Create Tag</span>
        </button>
      </div>

      {showCreateTag && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <div className="flex flex-wrap gap-2">
              {tagColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${color} ${
                    selectedColor === color ? 'border-amber-500' : 'border-transparent'
                  }`}
                >
                  Sample
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowCreateTag(false)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTag}
                className="px-3 py-1 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggleTag(tag.name)}
            className={`px-3 py-1 rounded-full text-sm font-medium border-2 transition-all ${tag.color} ${
              selectedTags.includes(tag.name) 
                ? 'border-amber-500 ring-2 ring-amber-200' 
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-1">
              <Tag className="h-3 w-3" />
              <span>{tag.name}</span>
              {selectedTags.includes(tag.name) && (
                <X className="h-3 w-3" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}