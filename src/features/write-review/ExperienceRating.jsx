import React from 'react';

export default function ExperienceRating({ rating, setRating }) {
  const ratings = [
    { value: 1, emoji: '😞', label: 'Terrible' },
    { value: 2, emoji: '😕', label: 'Poor' },
    { value: 3, emoji: '😐', label: 'OK' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😄', label: 'Excellent' }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">How was your experience?</h2>
      
      <div className="flex gap-4 justify-center">
        {ratings.map((item) => (
          <button
            key={item.value}
            onClick={() => setRating(item.value)}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
              rating === item.value
                ? 'bg-orange-100 dark:bg-orange-900/30'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="text-4xl">{item.emoji}</span>
            <span className={`text-xs font-medium ${
              rating === item.value
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
