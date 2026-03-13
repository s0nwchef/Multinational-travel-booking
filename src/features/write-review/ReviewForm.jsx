import React from 'react';

export default function ReviewForm({ title, setTitle, content, setContent }) {
  const maxChars = 5000;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Write your review</h2>
      
      <div>
        <input
          type="text"
          placeholder="Give your review a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="w-full px-4 py-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        
        <textarea
          placeholder="What did you like or dislike? How was the guide? What about the itinerary?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={maxChars}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
        
        <div className="flex justify-end mt-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {content.length} / {maxChars}
          </span>
        </div>
      </div>
    </div>
  );
}
