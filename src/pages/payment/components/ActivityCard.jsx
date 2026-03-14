import React from 'react';
import ActivityItem from './ActivityItem';
import plane from '../img/plane.png'
import bed from '../img/bed.png'
const ActivityCard = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border border-b-black border-transparent">
          <h3 className="text-lg text-black font-semibold p-6">Primary Card Activity</h3>
      </div>
      <p className="text-sm text-[#64748B] p-4">Last 30 days spend</p>
      <div className="w-[80%] bg-gray-200 rounded-full h-2 mx-auto">
        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '70%' }}></div>
      </div>
      <div className="space-y-2 p-4 text-black">
          <p className='text-[#64748B]'>RECENT CHARGES</p>
        <ActivityItem merchant="Kenya Safari" amount="$1,250.00" icon={plane}/>
        <ActivityItem merchant="Hilton Hotel" amount="$450.00" icon={bed}/>
      </div>
        <div className="flex mx-auto text-orange-600 font-bold p-4">
            <a href="">View Full Statement</a>
        </div>
    </div>
  );
};

export default ActivityCard;
