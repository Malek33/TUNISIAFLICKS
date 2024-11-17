"use client";
import React, { useEffect, useState } from 'react'
import getMovieData from './actions'

import { EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import './carousel.style.css'
import { FaHeart } from "react-icons/fa6";
import { Button } from '@/components/ui/button';
import { FaPlay } from "react-icons/fa6";
import { cn } from "@/lib/utils"
import { FaBookmark } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';



function Page({ params }: { params: { id: string } }) {

  const streamServices = [
    {
      // https://www.superembed.stream/#install
      name: 'MultiEmbed',
      url: `https://multiembed.mov/?video_id=${params.id}&tmdb=1`
    },
    {
      // https://www.2embed.cc/
      // https://www.2embed.skin/
      name: '2embed.cc',
      url: `https://www.2embed.cc/embed/${params.id}`
    },
    {
      // https://2embed.pro
      name: '2embed.pro',
      url: `https://2embed.pro/embed/movie/${params.id}`
    },
  ]

  const [data, setData] = useState(null)
  const [backdrops, setBackdrops] = useState([])
  const [logos, setLogos] = useState([])
  const [loader, setLoader] = useState(true)

  const OPTIONS: EmblaOptionsType = { loop: true }

  useEffect(() => {
    async function fetchMovieData() {
      try {
        const moviesData = await getMovieData(params.id)
        setData(moviesData)
        setLoader(false)
        console.log(moviesData)
        setBackdrops(moviesData.images.backdrops)
        setLogos(moviesData.images.logos)
      } catch (error) {
        console.error("Error fetching movie:", error)
        setLoader(false)
      }
    }

    fetchMovieData()
  }, [params.id])


  const handleWatchNow = () => {
    // Implement watch now functionality
  };

  const handleWatchTrailer = () => {
    // Implement watch trailer functionality
  };

  const handleAddToFavorites = () => {
    // Implement add to favorites functionality
  };

  const handleSaveForLater = () => {
    // Implement save for later functionality
  };

  const handleShare = () => {
    // Implement share functionality
  };



  return (
    loader ? <div className='w-full h-96 bg-gray-800 animate-pulse' /> :
      <div className='w-full h-full -mt-6' >
        <div className='h-[calc(100%-20vh)] w-full relative'>
          <BackdropsCarousel slides={backdrops} options={OPTIONS} />
          <div className='absolute bottom-0 h-2/6 w-full' style={{ background: 'linear-gradient(transparent, #0d0c0f)' }} />
          <div className='absolute left-0 bottom-0 h-full w-1/2' style={{ background: 'linear-gradient(to left, transparent, #0d0c0f)' }} />
          <div className='w-full h-full absolute left-0 bottom-0' />
          <div className='absolute pl-10 top-1/4 w-2/5 h-full'>
            {
              logos.length == 0 ?
                <Image src={`https://image.tmdb.org/t/p/original${data.poster_path}`} className='w-44 rounded-xl' width={500} height={100} alt="Movie LOGO" /> :
                <Image src={`https://image.tmdb.org/t/p/original${logos.filter((item) => item.iso_639_1 == 'en')[0].file_path || logos[0].file_path}`} className='w-80' width={500} height={100} alt="Movie LOGO" />
            }
            <p className='flex items-center gap-3 mt-5'>
              <p><Image src={`https://flagsapi.com/${data.origin_country}/flat/32.png`} width={32} height={32} alt='slm' /></p>
              <p className='flex gap-1 items-center'><FaHeart className='text-red-500' /><p className='text-red-500 font-bold'>{Math.round(data.vote_average * 10)}%</p> Likes</p>
              <p>•</p>
              <p>{data.release_date.substring(0, 4)}</p>
              {
                data.adult &&
                <div className='flex gap-3'>
                  <p>•</p>
                  <p className='bg-red-500 px-3 rounded-xl'>+18</p>
                </div>
              }
              <p>•</p>
              <p>{data.genres.map((item, index) => data.genres.length - 1 !== index ? item.name + ", " : item.name)}</p>
            </p>
            <p className='mt-3 text-gray-300'>{data.overview}</p>
            <div className='mt-3'>
              <p>CASTS:</p>
              <div className='flex gap-2 mt-2 select-none'>
                {data.credits.cast.slice(0, 8).map((item, index) => (
                  <div className='flex gap-3 items-center cursor-pointer' key={index}>
                    <Image src={`https://image.tmdb.org/t/p/w300${item.profile_path}`} title={item.name} className='w-14 h-14 object-cover rounded-full' style={{ objectPosition: '0 30%' }} width={100} height={100} alt={item.name} />
                  </div>
                ))}
                <div className='w-14 h-14 bg-gray-500 bg-opacity-40 border-opacity-70 border-2 border-gray-200 rounded-full text-wrap text-center text-xs flex items-center justify-center cursor-pointer' >
                  View All
                </div>
              </div>
            </div>


            <div className='flex gap-4 mt-5'>
              <Button onClick={handleWatchNow} className='text-white-500 bg-red-500 hover:bg-red-400'>
                <FaPlay className="mr-1"/> Watch Now
              </Button>
              <Button onClick={handleWatchTrailer} variant='outline' className='border-white bg-transparent'>
                Watch Trailer
              </Button>
              <InteractiveButton clicked={handleAddToFavorites} icon={<FaHeart className='w-5 h-5'/>} title="Add to Favories" titleled="Favorited!"/>
              <InteractiveButton clicked={handleSaveForLater} icon={<FaBookmark className='w-5 h-5'/>} title="Save for Later" titleled="Saved!"/>
              <InteractiveButton clicked={handleShare} icon={<FaShareAlt className='w-5 h-5'/>} title="Share" titleled="Shared"/>
            </div>
          </div>

        </div>


        {/* Recommendations */}
        {/* https://api.themoviedb.org/3/movie/{movie_id}/recommendations */}

        <div className='flex justify-center'>
        <Carousel className='w-full sm:w-[90%] lg:w-[96%] xl:w-[90"%]'>
        <CarouselContent>
          {
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((movie) => {
              return (
                <CarouselItem key={movie} className="transition-transform ease-in-out duration-400 select-none basis-[145px]
               md:basis-[167px] my-4 p-0 ml-4 hover:scale-110 hover:z-10">
                <div className='w-full h-56 bg-red-500 rounded-xl'></div>
                </CarouselItem>
              )
            })}
        </CarouselContent>
        <div className='hidden sm:block'>
          {/* <CarouselPrevious /> */}
          {/* <CarouselNext /> */}
        </div>
      </Carousel>
      </div>

        {/* <iframe src={`https://multiembed.mov/?video_id=${params.id}&tmdb=1`} className='w-full h-full' allowFullScreen></iframe> */}
      </div>
  )
}



type PropType = {
  slides: any[]
  options?: EmblaOptionsType
}

const BackdropsCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay({ delay: 3000 })])
  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((item, index) => (
            <div className="embla__slide h-full" key={index}>
              <div className='w-full h-full embla__slide__element'
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${item.file_path})`, backgroundPosition: 'top',
                  backgroundSize: 'cover', backgroundRepeat: 'no-repeat'
                }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
const InteractiveButton = ({icon, title, titleled, clicked}: any) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const handleClick = () => {
    setIsFavorite(!isFavorite)
    clicked()
  }

  return (
    <Button
      variant="outline"
      className={cn(
        "relative overflow-hidden group bg-transparent",
        "w-10 h-10 rounded-full",
        "hover:w-40 hover:rounded-full",
        "transition-all duration-300 ease-in-out",
        isFavorite ? "bg-red-500 text-primary-foreground hover:bg-red-500" : "bg-transparent hover:text-red-500 border-white hover:bg-transparent"
      )}
      onClick={() => handleClick()}
    >
      <span className={cn(
        "absolute inset-y-0 left-0 flex items-center justify-center",
        "w-10 h-10 transition-all duration-300 ease-in-out",
        "group-hover:scale-110"
      )}>
        <span className={cn(
            " -ml-[2px]",
            "transition-all duration-300 ease-in-out",
            isFavorite ? "fill-primary-foreground" : "stroke-current group-hover:fill-primary"
          )}>{icon}</span>
      </span>
      <span 
        className={cn(
          "absolute left-10 opacity-0 transition-all duration-300 ease-in-out whitespace-nowrap",
          "group-hover:opacity-100"
        )}
      >
        {isFavorite ? titleled : title}
      </span>
    </Button>
  )
}

export default Page