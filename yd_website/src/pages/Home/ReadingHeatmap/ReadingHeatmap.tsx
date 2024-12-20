import { useEffect, useState } from "react"
import styles from "./ReadingHeatmap.module.css"
import { drawKindleHeatmap } from "../heatmapUtils"
import { fetchData } from "../../../api/axiosClient"
import { DataResponseType, ReadingData } from "../../../types/dataTypes"
// @ts-expect-error cal-heatmap library don't have declration files :(
import CalHeatmap from 'cal-heatmap';
import BookCarousel from "./BookCarousel/BookCarousel"

const ReadingHeatmap = () => {
  const [selectedBook, setSelectedBook] = useState<string>("")
  const [books, setBooks] = useState<string[]>([])
  const [readingActivity, setReadingActivity] = useState<ReadingData[]>()
  const [readingCal,] = useState(new CalHeatmap())

  useEffect(() => {
    async function getData() {
      const readingData = await fetchData<DataResponseType<ReadingData[]>>("/kindle-data?year=2024")
      setReadingActivity(readingData["data"])
      drawKindleHeatmap(readingCal, readingData["data"])
      setBooks(Object.keys(readingData["distinct_categories"]))
    }
    getData()
  }, [])

  useEffect(() => {
    if (readingActivity) {
      const newActivity = readingActivity.filter((data) => data["ASIN"].includes(selectedBook))
      drawKindleHeatmap(readingCal, newActivity)
    }
  }, [selectedBook])

  return (
    <div
      className={styles.dataSection}
    >
      <h2>Reading Activity (From Amazon Kindle)</h2>
      <div id="reading-heatmap" style={{ height: "7rem" }}></div>
      <div id="reading-legend"></div>
      <BookCarousel
        asinCodes={books}
        selectedValue={selectedBook}
        setSelectedValue={setSelectedBook}
      />
      <p>
        I feel my reading habit comes and goes in waves. Although from september onward
        I've been locked in. That's when I started daily driving the Hisense A9 as my
        phone. It has an e-ink screen so it meant I didn't have to go find my kindle
        to read.
      </p>
    </div>
  );
}

export default ReadingHeatmap;