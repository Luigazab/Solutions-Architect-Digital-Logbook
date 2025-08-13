export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-6 text-4xl text-gray-500 hover:text-gray-700">&times;</button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}
