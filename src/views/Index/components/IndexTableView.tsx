import React, { useState, useMemo } from 'react';
import { DataTable, OnSortParam } from "@/components/shared";
import { MdWarningAmber } from "react-icons/md";
import CustomDataTable from '@/components/custom/CustomDataTable';

const IndexTableView = ({ data, query, columns, loading }: any) => {

  const [sort, setSort] = useState<{ order: '' | 'asc' | 'desc'; key: string | number }>({ order: '', key: '' });


  const sortedData = useMemo(() => {
    if (sort.order === 'asc') {
      return [...data].sort((a, b) => {
        const aValue = String(a[sort.key]).toLowerCase();
        const bValue = String(b[sort.key]).toLowerCase();
        if (aValue > bValue) return 1;
        if (aValue < bValue) return -1;
        return 0;
      });
    } else if (sort.order === 'desc') {
      return [...data].sort((a, b) => {
        const aValue = String(a[sort.key]).toLowerCase();
        const bValue = String(b[sort.key]).toLowerCase();
        if (aValue < bValue) return 1;
        if (aValue > bValue) return -1;
        return 0;
      });
    } else {
      return data;
    }
  }, [sort, data]);
  
  

  
  const handleSort = ({ order, key }: OnSortParam) => {
      setSort({ order, key });
  };


  return (
    <div>
      {data.length > 0 ? (
        <div className="bg-white dark:bg-transparent mb-3">
          <DataTable
            columns={columns}
            data={sortedData}
            pagingData={{
                total: data?.length,
                pageIndex : query?.pageNumber,
                pageSize:query?.pageSize
            }}
            showPagination={false}
            onSort={handleSort}
          />
        </div>
      
      ) : (
        <div className="text-center ">
                    <h5 className="flex gap-3 items-center my-10">
                        <MdWarningAmber className='text-xl' />
                        No Data Available
                    </h5>
                </div>
      )}
    </div>
  );
};

export default IndexTableView;
