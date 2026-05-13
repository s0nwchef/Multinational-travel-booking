import React from 'react';
import { getLoyaltyStatus } from '../../../utils/loyalty.js';
import payment from '../img/paypal.png';

const SummaryCard = ({ points, onViewRewards }) => {
    const loyalty = getLoyaltyStatus(points || 1);
    
    return (
        <div className="bg-gray-900 text-white rounded-xl p-6">
            <div className="flex items-center gap-2 text-[#64748B]">
                <img src={payment} alt="icon"/>
                <h3 className="text-lg font-semibold text-white">Financial Summary</h3>
            </div>
            <div className="mb-4">
                <p className="text-sm">Điểm tích lũy</p>
                <p className="text-2xl font-bold">{points?.toLocaleString() || '0'} pts</p>
            </div>
            <div className="flex justify-between mb-4">
                <div>
                    <p className="text-sm">Hạng thành viên</p>
                    <p className="text-xl font-semibold">{loyalty.currentTierName}</p>
                </div>
                <div className="mb-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">{loyalty.currentTierName}</span>
                </div>
            </div>

            <button 
                onClick={onViewRewards}
                className="bg-orange-500 text-white rounded-lg px-4 py-2 w-full hover:bg-orange-600 transition-colors"
            >
                View Rewards
            </button>
        </div>
    );
};

export default SummaryCard;
