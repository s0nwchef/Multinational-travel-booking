import React from 'react';
import payment from '../img/paypal.png'

const SummaryCard = () => {
    return (
        <div className="bg-gray-900 text-white rounded-xl p-6">
            <div className="flex items-center gap-2 text-[#64748B]">
                <img src={payment} alt="icon"/>
                <h3 className="text-lg font-semibold text-white">Financial Summary</h3>
            </div>
            <div className="mb-4">
                <p className="text-sm">Total Spent this Year</p>
                <p className="text-2xl font-bold">$8,245.50</p>
                <p className="text-green-400 text-sm">+12.5% vs last year</p>
            </div>
            <div className="flex justify-between mb-4">
                <div>
                    <p className="text-sm">Points Earned</p>
                    <p className="text-xl font-semibold">2,450 pts</p>
                </div>
                <div className="mb-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">Platinum</span>
                </div>
            </div>

            <button className="bg-orange-500 text-white rounded-lg px-4 py-2 w-full">View Rewards</button>
        </div>
    );
};

export default SummaryCard;
