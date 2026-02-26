'use client'

import { useEffect, useRef, useState } from 'react'

export type MenuData = {
  id: number
  img: string
  imgAlt: string
  userAvatar: string
  userComment: string
}

const imageRotationAngles = [0, 10, 20, 30, 40]

const HeroSection = ({ menudata }: { menudata: MenuData[] }) => {
  const [imageStack, setImageStack] = useState({ startImageIndex: 0, rotationOffset: 0 })
  const [activeVariantIndex, setActiveVariantIndex] = useState(0)
  const [isTopCardEntering, setIsTopCardEntering] = useState(false)
  const hasMountedRef = useRef(false)
  const variants = ['történet', 'mosoly', 'pillanat', 'ölelés', 'meglepetés', 'emlék']

  useEffect(() => {
    if (menudata.length <= 1) {
      return
    }

    const imageIntervalId = window.setInterval(() => {
      setImageStack(prevStack => ({
        startImageIndex: (prevStack.startImageIndex + 1) % menudata.length,
        rotationOffset: (prevStack.rotationOffset + 1) % imageRotationAngles.length
      }))
    }, 2000)

    return () => {
      window.clearInterval(imageIntervalId)
    }
  }, [menudata])

  useEffect(() => {
    const textIntervalId = window.setInterval(() => {
      setActiveVariantIndex(previousIndex => (previousIndex + 1) % variants.length)
    }, 2000)

    return () => {
      window.clearInterval(textIntervalId)
    }
  }, [variants.length])

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true

      return
    }

    const resetTimeoutId = window.setTimeout(() => {
      setIsTopCardEntering(false)
    }, 900)

    const animationFrameId = window.requestAnimationFrame(() => {
      setIsTopCardEntering(true)
    })

    return () => {
      window.clearTimeout(resetTimeoutId)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [imageStack])

  const stackImageIndices = Array.from({ length: Math.min(3, menudata.length) }, (_, depth) => {
    return (imageStack.startImageIndex + depth) % menudata.length
  })

  const getCardTransform = (imageRotationOffset: number, zIndex: number, isEntering: boolean): string => {
    if (isEntering) {
      //      return 'translate(420px, -22px) translate(-50%, -50%) rotate(13deg)'
      return 'translate(150%, 20%)'
    }

    const rotationAngle = imageRotationAngles[(imageRotationOffset + zIndex) % imageRotationAngles.length]

    return `translate(-50%, -50%) translate(0px, 0px) rotate(${rotationAngle}deg)`
  }

  return (
    <section
      id='home'
      className='from-muted/60 to-background relative min-h-[calc(100svh-4rem)] w-full bg-gradient-to-br py-8 sm:py-12 lg:py-16'
    >
      <div className='mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8'>
        <div className='flex flex-col items-start justify-center'>
          <h1 className='text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-7xl'>
            Egy szál virág...
          </h1>
          <h2 className='text-primary mt-3 translate-x-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-7xl'>
            ...egy {variants[activeVariantIndex]}
          </h2>
          <p className='text-muted-foreground mt-8 max-w-sm text-base leading-relaxed sm:text-lg'>
            Természetes, személyes, időtálló virágdekorációkat tervezünk a ti történetetekhez, mindig szeretettel.
          </p>
        </div>

        <div className='relative h-[32rem] w-full overflow-visible sm:h-[38rem] lg:h-[42rem]'>
          <div className='from-muted/20 to-background absolute inset-0 rounded-2xl bg-gradient-to-br' />
          {stackImageIndices.map((imageIndex, zIndex) => {
            const item = menudata[imageIndex]
            const isTopCard = zIndex === stackImageIndices.length - 1

            return (
              <div
                key={`${item.id}-${zIndex}`}
                className={`absolute top-1/2 left-1/2 w-[75%] max-w-[25rem] rounded-lg bg-white p-3 pb-14 shadow-2xl ${
                  isTopCard && isTopCardEntering ? 'transition-transform duration-[900ms] ease-out' : 'transition-none'
                }`}
                style={{
                  zIndex: 30 + zIndex,
                  transform: `${getCardTransform(imageStack.rotationOffset, zIndex, isTopCard && isTopCardEntering)}`
                }}
              >
                <img
                  src={item.img}
                  alt={item.imgAlt}
                  className='h-[18rem] w-full rounded-sm object-cover sm:h-[22rem]'
                  loading='lazy'
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
