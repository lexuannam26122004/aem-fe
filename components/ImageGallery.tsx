import { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs, FreeMode } from 'swiper/modules'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import type { Swiper as SwiperType } from 'swiper'

// Import styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import './ImageGallery.css'

interface ImageType {
    id: number
    src: string
    alt: string
}

interface ImageGalleryProps {
    images: ImageType[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [lightboxOpen, setLightboxOpen] = useState(false)

    const handleMainSlideChange = (swiper: SwiperType) => {
        setActiveIndex(swiper.activeIndex)
    }

    const openLightbox = () => {
        setLightboxOpen(true)
    }

    return (
        <div className='product-gallery-container'>
            {/* Main image slider */}
            <div className='main-gallery'>
                <Swiper
                    slidesPerView={1}
                    navigation
                    modules={[Navigation, Thumbs]}
                    thumbs={{ swiper: thumbsSwiper }}
                    onSlideChange={handleMainSlideChange}
                    className='main-swiper'
                >
                    {images.map(image => (
                        <SwiperSlide key={image.id}>
                            <div
                                className='image-container'
                                onClick={e => {
                                    const target = e.target as HTMLElement
                                    const container = e.currentTarget as HTMLElement

                                    console.log('target', target)
                                    console.log('container', container)

                                    // Nếu click vào bên trong nút điều hướng Swiper
                                    const isClickInsideNav =
                                        container.querySelector('.swiper-button-next')?.contains(target) ||
                                        container.querySelector('.swiper-button-prev')?.contains(target)

                                    if (isClickInsideNav) {
                                        return // Không mở lightbox
                                    }

                                    openLightbox() // Chỉ mở nếu không click vào nút Swiper
                                }}
                            >
                                <img src={image.src} alt={image.alt} />
                            </div>
                        </SwiperSlide>
                    ))}
                    <div className='slide-counter'>
                        {activeIndex + 1}/{images.length}
                    </div>
                </Swiper>
            </div>

            {/* Thumbnail slider */}
            <div className='thumbnail-gallery'>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    slidesPerView='auto'
                    spaceBetween={10}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className='thumbnail-swiper'
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={image.id} className='thumbnail-slide'>
                            <div className={`thumbnail-container ${index === activeIndex ? 'active' : ''}`}>
                                <img src={image.src} alt={`Thumbnail ${image.alt}`} />
                                {/* {index === images.length - 1 && images.length > 8 && (
                                    <div className='more-images'>+{images.length - 8}</div>
                                )} */}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={images.map(img => ({ src: img.src, alt: img.alt }))}
                index={activeIndex}
                plugins={[Zoom, Thumbnails, Counter]}
                counter={{ container: { style: { top: '30px', right: '30px' } } }}
                thumbnails={{
                    position: 'bottom',
                    width: 80,
                    height: 80,
                    gap: 10
                }}
                zoom={{
                    maxZoomPixelRatio: 3,
                    zoomInMultiplier: 1.5
                }}
            />
        </div>
    )
}

export default ImageGallery
