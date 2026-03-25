import React from 'react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const colorStyles = {
    danger: "bg-red-600 hover:bg-red-700 shadow-red-500/20",
    warning: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
    info: "bg-violet-600 hover:bg-violet-700 shadow-violet-500/20"
  };

  const iconColors = {
    danger: "bg-red-50 dark:bg-red-500/10 text-red-500",
    warning: "bg-amber-50 dark:bg-amber-500/10 text-amber-500",
    info: "bg-violet-50 dark:bg-violet-500/10 text-violet-500"
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-[#1a1a2e] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-gray-200 dark:border-white/10 animate-cardAppear text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`w-20 h-20 ${iconColors[type]} rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl`}>
          {type === 'danger' ? '🗑️' : type === 'warning' ? '⚠️' : 'ℹ️'}
        </div>

        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-white/40 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white rounded-2xl font-bold hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-4 ${colorStyles[type]} text-white rounded-2xl font-bold shadow-lg transition-all hover:-translate-y-1 active:scale-95`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
