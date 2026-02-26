'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export type MenuData = {
  id: number
  img: string
  imgAlt: string
  userAvatar: string
  userComment: string
}

interface ImagePose {
  angle: number
  offsetX: number
  offsetY: number
}

interface ImageStackState {
  startImageIndex: number
  visibleCount: number
  posesByImageIndex: Record<number, ImagePose>
  variantByImageIndex: Record<number, string>
  variantCursor: number
}

const STACK_DEPTH = 4
const CARD_SCALE = 1.2
const VARIANTS = ['történet', 'mosoly', 'pillanat', 'ölelés', 'meglepetés', 'emlék']

const randomInRange = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min)
}

const createRandomPose = (): ImagePose => {
  return {
    angle: randomInRange(-8, 8),
    offsetX: randomInRange(-40, 40),
    offsetY: randomInRange(-40, 40)
  }
}

const getVisibleIndices = (startImageIndex: number, imageCount: number, visibleCount: number): number[] => {
  const safeDepth = Math.min(Math.max(visibleCount, 0), STACK_DEPTH, imageCount)

  return Array.from({ length: safeDepth }, (_, depth) => (startImageIndex + depth) % imageCount)
}

const getNextStackState = (previousStack: ImageStackState, imageCount: number): ImageStackState => {
  const maxDepth = Math.min(STACK_DEPTH, imageCount)
  const canGrow = previousStack.visibleCount < maxDepth

  const nextVisibleCount = canGrow ? previousStack.visibleCount + 1 : previousStack.visibleCount
  const nextStartImageIndex = canGrow ? previousStack.startImageIndex : (previousStack.startImageIndex + 1) % imageCount
  const nextVisibleIndices = getVisibleIndices(nextStartImageIndex, imageCount, nextVisibleCount)
  const nextPosesByImageIndex: Record<number, ImagePose> = {}
  const nextVariantByImageIndex: Record<number, string> = {}
  const nextTopImageIndex = nextVisibleIndices[nextVisibleIndices.length - 1]
  const nextTopVariant = VARIANTS[previousStack.variantCursor % VARIANTS.length]

  nextVisibleIndices.forEach(imageIndex => {
    nextPosesByImageIndex[imageIndex] = previousStack.posesByImageIndex[imageIndex] ?? createRandomPose()
    nextVariantByImageIndex[imageIndex] = previousStack.variantByImageIndex[imageIndex] ?? nextTopVariant
  })

  nextVariantByImageIndex[nextTopImageIndex] = nextTopVariant

  return {
    startImageIndex: nextStartImageIndex,
    visibleCount: nextVisibleCount,
    posesByImageIndex: nextPosesByImageIndex,
    variantByImageIndex: nextVariantByImageIndex,
    variantCursor: previousStack.variantCursor + 1
  }
}

const HeroSection = ({ menudata }: { menudata: MenuData[] }) => {
  const [imageStack, setImageStack] = useState(() => {
    const imageCount = menudata.length
    const initialVisibleCount = imageCount > 0 ? 1 : 0
    const visibleIndices = imageCount > 0 ? getVisibleIndices(0, imageCount, initialVisibleCount) : []
    const posesByImageIndex: Record<number, ImagePose> = {}
    const variantByImageIndex: Record<number, string> = {}

    visibleIndices.forEach(imageIndex => {
      posesByImageIndex[imageIndex] = createRandomPose()
      variantByImageIndex[imageIndex] = VARIANTS[0]
    })

    return {
      startImageIndex: 0,
      visibleCount: initialVisibleCount,
      posesByImageIndex,
      variantByImageIndex,
      variantCursor: 1
    }
  })

  const [activeVariantIndex, setActiveVariantIndex] = useState(0)

  useEffect(() => {
    if (menudata.length <= 1) {
      return
    }

    const imageIntervalId = window.setInterval(() => {
      setImageStack(previousStack => getNextStackState(previousStack, menudata.length))
    }, 5000)

    return () => {
      window.clearInterval(imageIntervalId)
    }
  }, [menudata])

  useEffect(() => {
    const textIntervalId = window.setInterval(() => {
      setActiveVariantIndex(previousIndex => (previousIndex + 1) % VARIANTS.length)
    }, 5000)

    return () => {
      window.clearInterval(textIntervalId)
    }
  }, [])

  const stackImageIndices = getVisibleIndices(imageStack.startImageIndex, menudata.length, imageStack.visibleCount)

  const getCardTransform = (pose: ImagePose): string => {
    return `translate(-50%, -50%) translate(${pose.offsetX}px, ${pose.offsetY}px) rotate(${pose.angle}deg) scale(${CARD_SCALE})`
  }

  return (
    <section
      id='home'
      className='from-muted/60 to-background relative min-h-[calc(100svh-4rem)] w-full bg-gradient-to-br py-8 sm:py-12 lg:py-16'
    >
      <div className='mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8'>
        <div className='flex flex-col items-start justify-center'>
          <h1
            className='text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-7xl'
            style={{ fontFamily: 'Charlotte, cursive' }}
          >
            Egy szál virág...
          </h1>
          <p className='text-muted-foreground mt-8 max-w-sm text-base leading-relaxed sm:text-lg'>
            Természetes, személyes, időtálló virágdekorációkat tervezünk a ti történetetekhez, mindig szeretettel.
          </p>
        </div>

        <div className='relative h-[32rem] w-full overflow-visible sm:h-[38rem] lg:h-[42rem]'>
          <div className='from-muted/20 to-background absolute inset-0 rounded-2xl bg-gradient-to-br' />
          <AnimatePresence mode='sync'>
            {stackImageIndices.map((imageIndex, zIndex) => {
              const item = menudata[imageIndex]
              const isBottomCard = zIndex === 0
              const isTopCard = zIndex === stackImageIndices.length - 1
              const pose = imageStack.posesByImageIndex[imageIndex] ?? createRandomPose()
              const cardVariant = imageStack.variantByImageIndex[imageIndex] ?? VARIANTS[activeVariantIndex]

              if (isTopCard) {
                return (
                  <motion.div
                    key={`top-${item.id}-${imageStack.startImageIndex}`}
                    className='absolute top-1/2 left-1/2 w-[75%] max-w-[25rem] rounded-[5px] border border-black/12 bg-white p-3 pb-20 shadow-[0_10px_25px_rgba(0,0,0,0.18)]'
                    style={{ zIndex: 30 + zIndex }}
                    initial={{
                      transform: `translate(-50%, -50%) translate(480px, -30px) rotate(14deg) scale(${CARD_SCALE})`,
                      opacity: 0
                    }}
                    animate={{
                      transform: getCardTransform(pose),
                      opacity: [0, 1, 1]
                    }}
                    transition={{
                      duration: 0.9,
                      ease: 'easeOut',
                      opacity: {
                        duration: 0.9,
                        times: [0, 0.3, 1],
                        ease: 'linear'
                      }
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.imgAlt}
                      className='h-[18rem] w-full rounded-[5px] object-cover sm:h-[22rem]'
                      loading='lazy'
                    />
                    <p
                      className='text-primary absolute right-0 bottom-6 left-0 text-center text-2xl font-medium tracking-wide sm:text-3xl'
                      style={{ fontFamily: 'Charlotte, cursive' }}
                    >
                      ...egy {cardVariant}
                    </p>
                  </motion.div>
                )
              }

              return (
                <motion.div
                  key={`${item.id}-${zIndex}`}
                  className='absolute top-1/2 left-1/2 w-[75%] max-w-[25rem] rounded-[5px] border border-black/12 bg-white p-3 pb-20 shadow-[0_10px_25px_rgba(0,0,0,0.18)]'
                  style={{
                    zIndex: 30 + zIndex,
                    transform: getCardTransform(pose)
                  }}
                  initial={false}
                  exit={isBottomCard ? { opacity: 0, transition: { duration: 0.8, ease: 'easeOut' } } : undefined}
                >
                  <img
                    src={item.img}
                    alt={item.imgAlt}
                    className='h-[18rem] w-full rounded-[5px] object-cover sm:h-[22rem]'
                    loading='lazy'
                  />
                  <p
                    className='text-primary absolute right-0 bottom-6 left-0 text-center text-2xl font-medium tracking-wide sm:text-3xl'
                    style={{ fontFamily: 'Charlotte, cursive' }}
                  >
                    ...egy {cardVariant}
                  </p>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
