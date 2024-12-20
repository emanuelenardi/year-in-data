import styles from "./BookCarousel.module.css"

const BookCarousel = (
  {
    asinCodes,

  }: {
    asinCodes: string[]
  }
) => {

  const bookImages = asinCodes.map((asin, index) => {
    if (isValidASIN(asin)) {
      const productImage = `https://images.amazon.com/images/P/${asin}.jpg`
      return (
        <div 
          className={styles.bookImage}
          key={`book-${index}`}
        >
          <img  src={productImage}/>
        </div>
      )
    }
  })

  return (
    <div className={styles.bookCarousel}>
      {bookImages}
    </div>
  );
}

export default BookCarousel;

function isValidASIN(asin: string): boolean {
  const asinRegex = /^[A-Z0-9]{10}$/;
  return asinRegex.test(asin);
}