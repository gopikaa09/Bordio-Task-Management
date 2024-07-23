import Skeleton from '@/components/ui/Skeleton'
import Container from '@/components/shared/Container'

export const IndexListSkeleton = () => {

    return (
        <>

            <Container className='h-full overflow-auto'>
                <div className="mb-4">
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 12 }, (_,index) => (
                            <div key={index}>
                                <Skeleton height={100} animation={true}/>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </>
    )
}