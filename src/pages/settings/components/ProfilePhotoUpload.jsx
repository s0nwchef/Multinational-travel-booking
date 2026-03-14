import React from 'react';

const ProfilePhotoUpload = () => {
  return (
    <div className="flex items-center mb-6">
      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
      <div className="ml-4">
          <div>
              <h1 className="text-black">Profile Photo</h1>
              <span className="text-sm">This will be displayed on your profile</span>
          </div>
        <button className="text-blue-500 hover:underline mr-4">Update</button>
        <button className="text-red-500 hover:underline">Remove</button>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
