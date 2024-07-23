import Skeleton from '@/components/ui/Skeleton'
import Container from '@/components/shared/Container'

export const IndexGridSkeleton = () => {

    return (
        <>
            <div className='h-full overflow-auto'>
                <div className="mb-4">
                    <div className="grid grid-cols-1 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mt-2 mb-2">
                        {Array.from({ length: 10 }, (_,index) => (
                            <div key={index}>
                                <Skeleton height={400} animation={true}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}