export interface PaginationProps {
    newsPerPage: number,
    totalNews: number,
    paginate: (pageNumber: number) => void
}