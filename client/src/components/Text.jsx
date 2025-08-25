export function Title({ children }) {
  return <h1 className="text-2xl font-semibold mb-2">{children}</h1>;
}

export function Subtitle({ children }) {
  return <h2 className="text-sm text-gray-500 mb-2">{children}</h2>;
}

export function Description({ children }) {
  return <p className="text-gray-500">{children}</p>;
}

export function Tooltip({ children }) {
  return (
    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
      {children}
    </span>
  );
}