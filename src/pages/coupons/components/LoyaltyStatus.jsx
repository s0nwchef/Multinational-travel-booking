import React from 'react';
import ProgressBar from './ProgressBar';

const LoyaltyStatus = ( {user} ) => {
  return (
    <div className="mb-6 bg-white rounded-[32px] p-10">
      <div className="flex justify-between items-center mb-4">
        <span className="text-3xl font-semibold">
  <span className="text-black">Loyalty Status: </span>
  <span style={{ color: "#FF5A1F" }}>{user.loyaltyStatus}</span> <br/>
            <span className="text-[#6B7280] text-sm">Earn points with every trip to unlock exclusive benefits.</span>
</span>
        <span className="text-lg font-semibold bg-[#FFF7ED] border border-[#FFEDD5] text-[#FF5A1F] p-2 px-4 rounded-[9999px]">{user.currentPoint.toLocaleString()} pts</span>
      </div>
        <div className="flex justify-between items-center mb-4 text-[#6B7280] font-bold">
            <p>Current level</p>
            <p>
              {user.nextLevel
                ? `NEXT: ${user.nextLevel} (${user.nextLevelPoints.toLocaleString()} pts)`
                : "MAX LEVEL"}
            </p>
        </div>
      <ProgressBar value={user.progressPercent} max={100} />
      <div className="text-center mt-2  text-[#6B7280] flex justify-end">
        <p>
          {user.nextLevel
            ? `${user.pointsToNextLevel.toLocaleString()} points to go!`
            : "You reached the highest tier!"}
        </p>
      </div>
    </div>
  );
};

export default LoyaltyStatus;
