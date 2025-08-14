function Loader(){
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 transition-opacity duration-300 z-50 text-center">
        <div>
            <div className="w-16 h-16 animate-spin border-sky-500 mx-auto"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0 8 4H3v5l-3 3 3 3v6h6l3 3 3-3h6v-6l3-3-3-3V4h-5z" fill="#f39c12" /><path d="M21 11.936a9 9 0 1 1-18 0 9 9 0 0 1 18 0" fill="#f1c40f" /></svg></div>
            <h2 className="text-zinc-900 dark:text-white mt-4">Loading with efforts...</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
                We are working hard to get this page ready for you. Please wait a moment while we prepare everything.
            </p>
        </div>
    </div>
  );
}
export default Loader;