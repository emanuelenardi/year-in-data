import styles from "./FilterCarousel.module.css"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface ItemType {
  name: string,
  imageUrl: string,
}

const FilterCarousel = (
  {
    items,
    selectedIndex,
    setSelectedIndex
  }: {
    items: ItemType[],
    selectedIndex: number,
    setSelectedIndex: CallableFunction
  }
) => {

  const itemImageElements = items.map((item, index) => {
    const classes = [styles.itemImage]
    if (selectedIndex === index) {
      classes.push(styles.itemSelected)
    }

    return (
      <div
        className={classes.join(" ")}
        key={`book-${index}`}
        onClick={() => setSelectedIndex(index)}
      >
        <img src={item["imageUrl"]} />
      </div>
    )
  })

  const showAllElement = (
    <div
      id={styles.showAll}
      className={[styles.itemImage, selectedIndex === -1 ? styles.itemSelected: ""].join(" ")}
      key={`book--1`}
      onClick={() => setSelectedIndex(-1)}
    >
      Show all
    </div>
  )

  function scrollParentElement(clickEvent: React.MouseEvent, direction: "left"|"right") {
    const parentElement = clickEvent.currentTarget.parentElement
    if (!parentElement) return
    const sign = direction==="left" ? -1 : 1
    parentElement.scrollBy(0.8 * sign * parentElement.offsetWidth, 0)
  }

  return (
    <div
      className={styles.container}
    >
      {showAllElement}
      <div
        className={styles.itemCarousel}
      >
        <button
          id={styles.navLeft}
          className={styles.navigation}
          onClick={(event) => scrollParentElement(event, "left")}
        >
          <FaArrowLeft /> 
        </button>
        {itemImageElements}
        <button
          id={styles.navRight}
          className={styles.navigation}
          onClick={(event) => scrollParentElement(event, "right")}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
 
export default FilterCarousel;