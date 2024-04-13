import {useCallback, useEffect} from "react";
import {usePagination} from "../../hooks/usePagination.ts";

export function Pagination({from, to,  currentPage, totalPage, onPageChange}: {
    from: number,
    to: number,
    currentPage: number,
    totalPage: number,
    onPageChange: (page: number) => void
}) {
    const {pages, arrayNumberPage} = usePagination()

    useEffect(() => {
        arrayNumberPage({from: from, to: to, total_pages: totalPage})
    }, [from, to, totalPage])

    const handlePageChange = useCallback(
        (page: number) => {
            if (page < 1 || page > totalPage) {
                return;
            }
            onPageChange(page);
        },
        [totalPage, onPageChange]
    );

    return <div className="max-w-screen-xl mx-auto mt-12 px-4 text-gray-600 md:px-8">
        <div className="hidden items-center justify-between sm:flex" aria-label="Pagination">
            <a onClick={currentPage > 1 ? () => handlePageChange(currentPage - 1) : undefined}
               className={`${currentPage > 1 ? 'cursor-pointer hover:text-indigo-600 flex items-center gap-x-2' : 'text-gray-400 flex items-center gap-x-2'} `}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd"
                          d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z"
                          clipRule="evenodd"/>
                </svg>
                Previous
            </a>

            <ul className="flex items-center gap-1">
                {
                    pages.map((item, idx) => (
                        <li key={idx} className="text-sm">
                            {
                                item === "..." ? (
                                    <div>
                                        {item}
                                    </div>
                                ) : (

                                    <a
                                        onClick={currentPage !== item ? () => handlePageChange(Number(item)) : undefined}
                                        aria-current={currentPage === item ? "page" : false}
                                        className={`cursor-pointer px-3 py-2 rounded-lg duration-150 hover:text-indigo-600 hover:bg-indigo-50 ${currentPage === item ? "cursor-default bg-indigo-50 text-indigo-600 font-medium" : ""}`}
                                    >
                                        {item}
                                    </a>
                                )
                            }
                        </li>
                    ))
                }
            </ul>

            <a onClick={currentPage < totalPage ? () => handlePageChange(currentPage + 1) : undefined}
               className={`${currentPage < totalPage ? 'cursor-pointer hover:text-indigo-600 flex items-center gap-x-2' : 'text-gray-400 flex items-center gap-x-2'} `}>
                Next
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd"
                          d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                          clipRule="evenodd"/>
                </svg>
            </a>
        </div>
        {/* On mobile version */}
        <div className="flex items-center justify-between text-sm text-gray-600 font-medium sm:hidden">
            <a onClick={() => handlePageChange(currentPage - 1)}
               className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50">Previous</a>
            <div className="font-medium">
                Page {currentPage} of {pages.length}
            </div>
            <a onClick={() => handlePageChange(currentPage + 1)}
               className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50">Next</a>
        </div>
    </div>
}