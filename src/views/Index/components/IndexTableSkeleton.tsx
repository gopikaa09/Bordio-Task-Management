import Skeleton from '@/components/ui/Skeleton'
import Container from '@/components/shared/Container'

export const IndexTableSkeleton = () => {

    return (
        <>

            {/* <Container className='h-full overflow-auto'> */}
                <div className="mb-4">
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 12 }, (_,index) => (
                            <div key={index}>
                                <Skeleton height={50} animation={true}/>
                            </div>
                        ))}
                    </div>
                </div>
            {/* </Container> */}
        </>
    )
}