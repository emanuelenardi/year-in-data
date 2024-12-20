import styles from "./BookCarousel.module.css"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const BookCarousel = (
  {
    asinCodes,
    selectedValue,
    setSelectedValue
  }: {
    asinCodes: string[],
    selectedValue: string,
    setSelectedValue: CallableFunction
  }
) => {

  const bookImages = ["", ...asinCodes].map((asinCode, index) => {
    if (index === 0) {
      return <div
        className={styles.bookImage}
        key={`book-${index}`}
        onClick={() => setSelectedValue(asinCode)}
        style={selectedValue === asinCode ? { border: "solid 3px #FE9928" } : {}}
      >
        Show all books
      </div>
    }

    if (isValidASIN(asinCode)) {
      const productImage = `https://images.amazon.com/images/P/${asinCode}.jpg`
      return (
        <div
          className={[styles.bookImage, styles.showAll].join(" ")}
          key={`book-${index}`}
          onClick={() => setSelectedValue(asinCode)}
          style={selectedValue === asinCode ? { border: "solid 3px #FE9928" } : {}}
        >
          <img src={productImage} />
        </div>
      )
    }
  })

  return (
    <div className={styles.bookCarousel}>
      <div
        id={styles.navLeft}
        className={styles.navigation}
        onClick={(event) => {
          const parentElement = event.currentTarget.parentElement
          if (!parentElement) return
          parentElement.scrollBy(-0.8 * parentElement.offsetWidth, 0)
        }} >
        <FaArrowLeft />
      </div>
      {bookImages}
      <div
        id={styles.navRight}
        className={styles.navigation}
        onClick={(event) => {
          const parentElement = event.currentTarget.parentElement
          if (!parentElement) return
          parentElement.scrollBy(0.8 * parentElement.offsetWidth, 0)
        }} >
        <FaArrowRight />
      </div>
    </div>
  );
}

export default BookCarousel;

function isValidASIN(asin: string): boolean {
  const asinRegex = /^[A-Z0-9]{10}$/;
  return asinRegex.test(asin);
}