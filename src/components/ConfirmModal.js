import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-sm sm:max-w-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{message}</p>
        
        <div className="flex justify-end space-x-2 sm:space-x-3">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 