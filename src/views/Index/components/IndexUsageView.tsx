import { MdWarningAmber } from "react-icons/md"

const IndexUsageView =({data, item:Item}:any) => {

    return(
        <>
            {data.length > 0 ? (
                <div>
                    {data?.map((item:any) =>(
                            <Item key={item.uid} item={item}/>
                        ))}
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

export default IndexUsageView