import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BlockConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  username: string;
  isBlocking: boolean;
}

const BlockConfirmModal: React.FC<BlockConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  username,
  isBlocking,
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${theme === 'light' ? 'bg-white' : 'bg-[#1a1a1a]'} rounded-2xl w-full max-w-md border ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'} shadow-2xl`}>
        
        {/* Icon */}
        <div className="p-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          {/* Title */}
          <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>
            {isBlocking ? 'Block User' : 'Unblock User'}
          </h2>

          {/* Message */}
          <p className={`text-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {isBlocking ? (
              <>
                Are you sure you want to block <strong className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{username}</strong>?
                <br />
                <br />
                They won't be able to:
                <ul className="text-left mt-2 space-y-1 mx-auto inline-block">
                  <li>• Send you messages</li>
                  <li>• See when you're online</li>
                  <li>• Add you as a friend</li>
                </ul>
              </>
            ) : (
              <>
                Unblock <strong className={theme === 'light' ? 'text-gray-900' : 'text-white'}>{username}</strong>?
                <br />
                They will be able to message you again.
              </>
            )}
          </p>
        </div>

        {/* Buttons */}
        <div className={`p-6 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'} flex gap-3`}>
          <button
            onClick={onClose}
            className={`flex-1 py-3 ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} rounded-xl font-semibold transition cursor-pointer`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-semibold transition cursor-pointer ${
              isBlocking
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isBlocking ? '🚫 Block' : '✅ Unblock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockConfirmModal;