import React from 'react'
import { Skeleton } from '../../../components/ui'

const IndexBoardSkeleton = () => {
    return (
        <div>
            <div className="scrumboard  w-full h-full mb-2">
                <div className="scrumboard-body flex flex-col flex-auto max-w-full overflow-x-auto h-full mt-4">
                    <div className="grid gap-3 grid-cols-6 mb-3">
                        {Array.from({ length: 6 }, (_, index) => (
                            <div key={index}>
                                <Skeleton height={40} animation={true} />
                            </div>
                        ))}
                    </div>
                    <div className="grid gap-3 grid-cols-6">
                        {Array.from({ length: 6 }, (_, index) => (
                            <div key={index}>
                                {Array.from({ length: 4 }, (_, index) => (
                                    <div key={index} className='mb-2'>
                                        <Skeleton
                                            height={150}
                                            animation={true}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IndexBoardSkeleton
