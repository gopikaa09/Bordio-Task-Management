import { IconText } from '@/components/shared'
import { Avatar, Card } from '@/components/ui'
import React from 'react'
import { FaPhoneFlip } from 'react-icons/fa6'
import { HiMail, HiOutlineUser } from 'react-icons/hi'
import { MdEmail, MdMarkEmailRead, MdPerson } from 'react-icons/md'

const MainDetails = () => {
  return (
    <div>
      <Card>
        <div className='grid grid-cols-3'>
          <div className=''>
            <Avatar shape="circle" size="lg" icon={<HiOutlineUser className='' />} className='size-16' />
          </div>
          <div className='flex flex-col gap-2 col-span-2'>
            <IconText
              icon={<MdPerson />}
            >
              Gopika Guduru
            </IconText>
            <IconText
              icon={<HiMail />}
            >
              gopika@gmail.com
            </IconText>
            <IconText
              icon={<FaPhoneFlip />}
            >
              Gopika Guduru
            </IconText>
          </div>
        </div>
        <div>
          <p>Admin</p>
        </div>
      </Card >
    </div >
  )
}

export default MainDetails
