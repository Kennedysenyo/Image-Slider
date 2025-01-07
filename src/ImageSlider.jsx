import { useEffect, useState } from "react";
import {BsArrowLeftCircleFill, BsArrowRightCircleFill} from "react-icons/bs"


const ImageSlider = ({ url = "https://picsum.photos/v2/list", page = 1,  limit = 5}) => {
 
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchImages(getUrl) {
    try {
      setLoading(true)
      const response = await fetch(`${getUrl}?page=${page}&limit=${limit}`);
      const data = await response.json()

      if (Array.isArray(data)) {
        setImages(data.filter(dataItem => dataItem.download_url))
        setLoading(false)
      }else {
        setErrorMsg("Invalid data format");
      }
    }catch (error) {
      setErrorMsg(error.message);
      setLoading(false)
    }
  }

  function handlePrevious() {
    setCurrentSlide((currentSlide === 0 )? images.length - 1 : currentSlide - 1)
  }

  function handleNext() {
    setCurrentSlide((currentSlide === images.length -1) ? 0 : currentSlide + 1)
  }

  useEffect(() => {
    if(url !== "") fetchImages(url)
  } , [url])


  // Add autoplay to looping images
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 3000);
    return () => clearInterval(interval)
  }, [currentSlide]);

 
  if (errorMsg !== null) {
    return <div>Error occured! {errorMsg}</div>
  }


 return (
  <div className="container">
    <BsArrowLeftCircleFill 
      onClick={handlePrevious} 
      className="arrow arrow-left"
      aria-label="Previous Slide"
    />
    {
      loading ? <div className="image-placeholder">Loading Image...</div> : 
        images && images.length ?
        images.map((imageItem, index) => (
          <img 
            key={imageItem.id}
            src={imageItem.download_url}  
            alt={imageItem.download_url}
            className={currentSlide === index ? "current-image" : "current-image hide-current-image"}
          />
        ))
        :null
      }
    
    <BsArrowRightCircleFill 
      onClick={handleNext} 
      className="arrow arrow-right" 
      aria-label="Next Slide"
    />

    <span className="circle-indicators">
      {
        images && images.length ?
        images.map((_, index) => <button
          key={index}
          className={
            currentSlide === index ? "current-indicator" : "current-indicator inactive-indicator"
          }
          onClick={() => setCurrentSlide(index)}
        ></button>)
        : null
      }
    </span>
  </div>
 )
}

export default ImageSlider;