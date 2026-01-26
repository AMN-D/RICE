export const getPaginationRange = (currentPage: number, totalPages: number, maxVisible: number = 5) => {
    const items: (number | 'ellipsis')[] = [];

    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
            items.push(i);
        }
        return items;
    }

    const sidePages = Math.floor((maxVisible - 3) / 2);
    let startPage = Math.max(2, currentPage - sidePages);
    let endPage = Math.min(totalPages - 1, currentPage + sidePages);

    if (currentPage <= sidePages + 2) {
        endPage = maxVisible - 2;
    } else if (currentPage >= totalPages - sidePages - 1) {
        startPage = totalPages - maxVisible + 3;
    }

    items.push(1);

    if (startPage > 2) {
        items.push('ellipsis');
    }

    for (let i = startPage; i <= endPage; i++) {
        items.push(i);
    }

    if (endPage < totalPages - 1) {
        items.push('ellipsis');
    }

    items.push(totalPages);

    return items;
};
