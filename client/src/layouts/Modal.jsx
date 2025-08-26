export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-8 overflow-y-auto custom-scrollbar">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[calc(100vh-4rem)] overflow-y-auto p-6">
        <button onClick={onClose} className="absolute top-2 right-6 text-4xl text-gray-500 hover:text-gray-700">&times;</button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}
