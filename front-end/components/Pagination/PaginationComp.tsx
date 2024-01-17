import { Pagination, PaginationItem, Stack } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { PaginationProps } from './types';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';



const PaginationComp: FC<PaginationProps> = ({
  newsPerPage,
  totalNews,
  paginate,
}) => {

  const pageNumbers = Math.ceil(totalNews / newsPerPage);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if(page > pageNumbers) {
      setPage(1)
      paginate(1)
    }
  }, [page, pageNumbers]);

  return (
    <div>
      <Stack spacing={2} alignItems="center" m={4}>
        <Pagination
          count={Math.ceil(totalNews / newsPerPage)}
          onChange={(_, value) => {
            setPage(value)
            paginate(value) 
          }}
          page={page}
          renderItem={(item) => (
            <div>
              <PaginationItem
                components={{ previous: ArrowBackIos, next: ArrowForwardIos }}
                {...item}
              />
            </div>
          )}
        />
      </Stack>
    </div>
  )
}

export default PaginationComp;
