function Loader(){
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/40 transition-opacity duration-300 z-50 text-center">
        <div>
            <div className="w-16 h-16 animate-spin border-sky-500 mx-auto"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 299.637 299.637" xmlSpace="preserve"><g strokeWidth="0"/><g strokeLinecap="round" strokeLinejoin="round"/><path fill="#f39c12" d="M46.818 196.618 0 149.818 46.818 103V46.8h56.201L149.818.001 196.627 46.8h56.201v56.201l46.809 46.818-46.809 46.809v56.219h-56.21l-46.799 46.79-46.809-46.799H46.818z"/><path fill="#f1c40f" d="M149.818 37.456c62.053 0 112.364 50.311 112.364 112.364s-50.311 112.364-112.364 112.364S37.455 211.872 37.455 149.818 87.765 37.456 149.818 37.456"/></svg></div>
            <h2 className="text-zinc-900 text-white mt-4">Loading with efforts...</h2>
            <p className="text-zinc-900 text-zinc-400">
                We are working hard to get this page ready for you. Please wait a moment while we prepare everything.
            </p>
        </div>
    </div>
  );
}
export default Loader;