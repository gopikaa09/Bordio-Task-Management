import { IconText } from '@/components/shared'
import { Avatar, Card } from '@/components/ui'
import React from 'react'
import { FaPhoneFlip } from 'react-icons/fa6'
import { HiMail, HiOutlineUser } from 'react-icons/hi'
import { MdAccessTime, MdEmail, MdMarkEmailRead, MdPerson } from 'react-icons/md'

const MainDetails = () => {
  return (
    <>
      <Card>
        <div className='flex flex-col items-center gap-2'>
          <div className=''>
            <Avatar shape="circle" src='https://elstar.themenate.net/img/avatars/thumb-1.jpg' icon={<HiOutlineUser className='' />} className='size-24' />
          </div>
          <div>
            <p className='font-bold'>Gopika Guduru</p>
          </div>
          <div className='flex flex-col gap-2'>
            <IconText
              icon={<HiMail />}
            >
              gopika@gmail.com
            </IconText>
            <IconText
              icon={<FaPhoneFlip />}
            >
              99999 88888
            </IconText>
          </div>
        </div>

      </Card >
    </ >
  )
}

export default MainDetails
