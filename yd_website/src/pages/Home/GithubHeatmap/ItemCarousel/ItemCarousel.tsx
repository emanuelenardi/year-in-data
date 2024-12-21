import styles from "./ItemCarousel.module.css"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { DistinctRepos } from "../../../../types/dataTypes";

const ItemCarousel = (
  {
    items,
    selectedValue,
    setSelectedValue
  }: {
    items: DistinctRepos[],
    selectedValue: string,
    setSelectedValue: CallableFunction
  }
) => {

  const itemImages = items.map((item, index) => {
    if (index === 0) {
      return 
    }

      return (
        <div
          className={[styles.itemImage, styles.showAll].join(" ")}
          key={`book-${index}`}
          onClick={() => setSelectedValue(item.repository_name)}
          style={selectedValue === item.repository_name ? { border: "solid 3px #FE9928" } : {}}
        >
          <img src={item.repository_image} />
        </div>
      )
  })

  itemImages.unshift(<div
    className={styles.itemImage}
    key={`item-0`}
    onClick={() => setSelectedValue("")}
    style={selectedValue === "" ? { border: "solid 3px #FE9928" } : {}}
  >
    Show all
  </div>)

  return (
    <div className={styles.itemCarousel}>
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
      {itemImages}
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

export default ItemCarousel;