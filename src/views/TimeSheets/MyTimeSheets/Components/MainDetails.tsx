import { Avatar, Card } from '@/components/ui'
import React from 'react'
import { HiOutlineUser } from 'react-icons/hi'

const MainDetails = () => {
  return (
    <div>
      <Card className='py-5 px-10'>
        <div className='flex justify-center my-4'>
          <div className='flex flex-col items-center gap-2'>
            <div>
              <Avatar shape="circle" size="lg" icon={<HiOutlineUser className='size-12' />} className='size-32' />

            </div>
            <p>Gopika</p>
          </div>
        </div>
        <div className='flex flex-col gap-6'>
          <div>
            <p className='font-semibold'>Email</p>
            <p>gopika.guduru@gmail.com</p>
          </div>
          <div>
            <p className='font-semibold'>Email</p>
            <p>gopika.guduru@gmail.com</p>
          </div>
          {/* <div>
            <p className='font-semibold'>Email</p>
            <p>gopika.guduru@gmail.com</p>
          </div>
          <div>
            <p className='font-semibold'>Email</p>
            <p>gopika.guduru@gmail.com</p>
          </div> */}
        </div>
      </Card>
    </div>
  )
}

export default MainDetails
