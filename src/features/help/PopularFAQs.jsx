import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PopularFAQs = () => {
  const [openId, setOpenId] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I cancel my booking?',
      answer:
        'You can cancel your booking directly from your account dashboard. Go to "My Bookings," select the tour you wish to cancel, and click the "Cancel Booking" button. Please note that cancellation policies vary by tour and may affect your refund amount.',
    },
    {
      id: 2,
      question: 'When will I receive my refund?',
      answer:
        'Refunds are typically processed within 7-10 business days after cancellation. The exact timeframe depends on your payment method and bank. You can track your refund status in your account under "Transaction History."',
    },
    {
      id: 3,
      question: 'Can I change the dates of my tour?',
      answer:
        'Yes, you can reschedule your tour to different dates if availability permits. Visit your booking details and select "Change Dates." Please note that date changes may be subject to availability and potential price differences.',
    },
    {
      id: 4,
      question: 'Is travel insurance included?',
      answer:
        'Travel insurance is not automatically included with your booking, but we offer optional insurance packages at checkout. These cover trip cancellations, medical emergencies, and baggage loss. You can review and add insurance during the booking process.',
    },
  ];

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Popular FAQs
      </h2>

      <div className="space-y-3 max-w-3xl mx-auto">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all"
          >
            <button
              onClick={() => toggleFAQ(faq.id)}
              className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                {faq.question}
              </span>
              <ChevronDown
                size={20}
                className={`text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                  openId === faq.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openId === faq.id && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <a
          href="#"
          className="text-primary font-semibold hover:underline inline-flex items-center gap-2"
        >
          View all FAQs
          <span>→</span>
        </a>
      </div>
    </div>
  );
};

export default PopularFAQs;
