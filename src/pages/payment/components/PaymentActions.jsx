import React from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

const PaymentActions = ({ isDefault }) => {
    return (
        <div className="flex items-center gap-6 text-sm">


            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                <FiEdit />
                Edit
            </button>


            {!isDefault && (
                <button className="flex items-center gap-1 text-gray-500 hover:text-yellow-500">
                    Set as Default
                </button>
            )}


            <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
                <FiTrash />
                Remove
            </button>

        </div>
    );
};

export default PaymentActions;