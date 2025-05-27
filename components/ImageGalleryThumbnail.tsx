import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Counter from 'yet-another-react-lightbox/plugins/counter'

// Import styles
import 'swiper/css'
import 'swiper/css/free-mode'
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
    const [activeIndex, setActiveIndex] = useState(0)
    const [lightboxOpen, setLightboxOpen] = useState(false)

    const handleThumbnailClick = (index: number) => {
        setActiveIndex(index)
        setLightboxOpen(true)
    }

    return (
        <div className='product-gallery-container'>
            {/* Thumbnail slider only */}
            <div className='thumbnail-gallery'>
                <Swiper
                    slidesPerView='auto'
                    spaceBetween={10}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode]}
                    className='thumbnail-swiper'
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={image.id} className='thumbnail-slide'>
                            <div
                                className={`thumbnail-container`}
                                style={{
                                    opacity: 1
                                }}
                                onClick={() => handleThumbnailClick(index)}
                            >
                                <img
                                    src={image.src}
                                    alt={`Thumbnail ${image.alt}`}
                                    style={{
                                        borderRadius: '10px'
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Lightbox for fullscreen view */}
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
