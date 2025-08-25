export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 md:fixed flex items-center justify-center overflow-y-auto">
      <div className="m-4 bg-white rounded-lg shadow-lg w-full max-w-xl p-6 absolute top-0 md:relative">
        <button onClick={onClose} className="absolute top-2 right-6 text-4xl text-gray-500 hover:text-gray-700">&times;</button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}
