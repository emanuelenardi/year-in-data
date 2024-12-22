import { DistinctBooks } from "../../../../types/dataTypes";
import styles from "./BookCarousel.module.css"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const BookCarousel = (
  {
    books,
    selectedValue,
    setSelectedValue
  }: {
    books: DistinctBooks[],
    selectedValue: string,
    setSelectedValue: CallableFunction
  }
) => {

  const bookImages = books.map((book, index) => {

    return (
      <div
        className={[styles.bookImage, styles.showAll].join(" ")}
        key={`book-${index}`}
        onClick={() => setSelectedValue(book["ASIN"])}
        style={selectedValue === book["ASIN"] ? { border: "solid 3px #FE9928" } : {}}
      >
        <img src={book["book_image"]} />
      </div>
    )
  })


  bookImages.unshift(<div
    className={styles.bookImage}
    key={`book--1`}
    onClick={() => setSelectedValue("")}
    style={selectedValue === "" ? { border: "solid 3px #FE9928" } : {}}
  >
    Show all books
  </div>)

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
