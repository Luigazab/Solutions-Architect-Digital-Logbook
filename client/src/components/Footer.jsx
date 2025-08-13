export default function Footer(){
    return(
        <footer className="bg-sky-950 inset-shadow-2xl sm:flex sm:items-center sm:justify-between p-4 sm:p-6 xl:p-6 dark:bg-gray-800 antialiased">
            <p className="mb-4 text-sm text-center text-amber-50 dark:text-gray-400 sm:mb-0">
                &copy; 2025 <a href="https://www.macrologic.com.ph/" className="hover:underline" target="_blank">Macrologic.com.ph</a> Product/Solutions Management. All rights reserved.
            </p>
            <div className="flex justify-center items-center space-x-1">
                <a href="https://docs.google.com/document/d/17G0Ze8ezBo0jYu_6JjcHQtiLr_LbTx21z5wKCrM66Q4/edit?usp=sharing" data-tooltip-target="tooltip-documentation" className="inline-flex justify-center p-2 text-amber-50 rounded-lg cursor-pointer dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" xmlSpace="preserve"><path fill="none" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" d="M25 28H7V4h12l6 6z"/><path fill="none" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" d="M19 4v6h6"/><path d="M11 21h10v2H11zm0-4h10v2H11zm0-4h10v2H11z"/></svg>
                    <span className="sr-only">Documentation</span>
                </a>
                <div id="tooltip-documentation" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
                    Read the documentation for more details
                    <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
                <a href="https://www.linkedin.com/company/macrologic-diversified-technologies-inc-official/" data-tooltip-target="tooltip-linkedin" className="inline-flex justify-center p-2 text-amber-50 rounded-lg cursor-pointer dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2M8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.57 1.57 0 1 1 0 3.12m12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06Z"/></svg>
                    <span className="sr-only">LinkedIn</span>
                </a>
                <div id="tooltip-linkedin" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
                    Connect with Macrologic
                    <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
                <a href="https://github.com/Luigazab/OJT" data-tooltip-target="tooltip-github" className="inline-flex justify-center p-2 text-amber-50 rounded-lg cursor-pointer dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd"/>
                    </svg>
                    <span className="sr-only">Github</span>
                </a>
                <div id="tooltip-github" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
                    Project Repository
                    <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
            </div>
        </footer>
    );
}