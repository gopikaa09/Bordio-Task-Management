import { MdWarningAmber } from "react-icons/md"
 
const IndexGridView = ({ data, item: Item, grid, gap, isSelectable }: any) => {
    return (
        <>
            {data.length > 0 ? (
 
                <div
                >
                    {isSelectable ?
                        <>
                            {data && data.length > 0 &&
 
                                <Item item={data} />
 
                            }
                        </> :
                        <div className={`grid grid-cols-${grid?.std} xl:grid-cols-${grid?.xl} lg:grid-cols-${grid?.lg} md:grid-cols-${grid?.md} sm:grid-cols-${grid?.sm} xs:grid-cols-${grid?.xs} gap-${gap} mt-2 mb-2`}>
                            {data && data.length > 0 && (
                                data.map((item,index) => (
                                    <Item key={index} item={item} data={data} />
                                )))
                            }
                        </div>}
                </div>
            ) : (
                <div className="text-center ">
                    <h5 className="flex gap-3 items-center my-10">
                        <MdWarningAmber className='text-xl' />
                        No Data Available
                    </h5>
                </div>
            )}
        </>
    )
}
 
export default IndexGridView