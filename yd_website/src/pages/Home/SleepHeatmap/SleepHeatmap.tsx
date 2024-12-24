import { useEffect, useState } from "react"
import styles from "./SleepHeatmap.module.css"
import { drawSleepHeatmap } from "../heatmapUtils"
import { fetchData } from "../../../api/axiosClient"
import { SleepData } from "../../../types/dataTypes"
// @ts-expect-error cal-heatmap library don't have declration files :(
import CalHeatmap from 'cal-heatmap';
import FilterCarousel from "../../../components/FilterCarousel/FilterCarousel"

const SleepHeatmap = () => {
  const filters = [5, 6, 7, 8, 9]
  const filterNameMap: { [key: string]: string } = {
    5: "poor",
    6: "meh",
    7: "alright",
    8: "pretty good",
    9: "very good"
  }
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [activity, setActivity] = useState<SleepData[]>([])
  const [cal,] = useState(new CalHeatmap())


  useEffect(() => {
    async function getData() {
      const data = await fetchData<SleepData[]>("/sleep-data?year=2024")
      setActivity(data)
      drawSleepHeatmap(cal, data)

    }
    getData()
  }, [cal])

  useEffect(() => {

    let newActivity = activity
    if (selectedIndex !== -1) {
      newActivity = activity.filter((data) => {
        return (data["total_duration_hours"] >= filters[selectedIndex] && data["total_duration_hours"] < filters[selectedIndex] + 1)
      })
    }
    drawSleepHeatmap(cal, newActivity)
  }, [selectedIndex])

  return (
    <div
      className={styles.dataSection}
    >
      <h2>Sleep Activity (From Fitbit)</h2>
      <div id="sleep-heatmap"></div>
      <div id="sleep-legend"></div>

      <FilterCarousel
        items={filters.map((hour) => {
          return {
            "name": filterNameMap[hour.toString()]
          }
        })}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        height={5}
      />


      <p>
        Sleep was much better than expected. Especially recently in December, I am
        getting days when I sleep for 10 hours :0. Lol you can see when I lost my Fitbit
        in February. I am also surprised at how often I have my fitbit on.
      </p>
    </div>
  );
}

export default SleepHeatmap;
