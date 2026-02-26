import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

import BistroLogo from '@/assets/svg/bistro-logo'
import { footerData } from '@/assets/data/footer'

const Footer = () => {
  return (
    <footer className='bg-muted' style={{ clipPath: 'polygon(0 16px, 100% 0, 100% 100%, 0 100%)' }}>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8'>
        <a href='/#home'>
          <div className='flex items-center gap-3'>
            <BistroLogo className='gap-3' />
            <span className='text-primary text-[20px] font-semibold'>Mimóza Memories</span>
          </div>
        </a>

        <div className='flex items-center gap-5 whitespace-nowrap'>
          {footerData.map(item => (
            <a
              key={item.title}
              href={item.href}
              className='text-foreground hover:text-primary text-base! hover:bg-transparent'
            >
              {item.title}
            </a>
          ))}
        </div>

        <div className='flex items-center gap-4'>
          <a href='https://www.facebook.com/mimozadesign' className='hover:text-primary' target='_blank' rel='noreferrer'>
            <FacebookIcon className='size-5' />
          </a>
          <a
            href='https://www.instagram.com/mimozamemories'
            className='hover:text-primary'
            target='_blank'
            rel='noreferrer'
          >
            <InstagramIcon className='size-5' />
          </a>
          <a href='mailto:liza@mimozamemories.hu' className='hover:text-primary'>
            <TwitterIcon className='size-5' />
          </a>
          <a href='mailto:liza@mimozamemories.hu' className='hover:text-primary'>
            <YoutubeIcon className='size-5' />
          </a>
        </div>
      </div>

      <Separator />

      <div className='mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6'>
        <p className='text-muted-foreground text-center text-balance'>
          {`©${new Date().getFullYear()}`}{' '}
          <a href='/#home' className='hover:underline'>
            Mimóza Memories
          </a>
          , természetes és személyes esküvői dekoráció.
        </p>
      </div>
    </footer>
  )
}

export default Footer
