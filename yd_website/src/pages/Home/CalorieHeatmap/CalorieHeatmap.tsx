import { useEffect, useState } from "react"
import styles from "./CalorieHeatmap.module.css"
import { drawHeatmap } from "../heatmapUtils"
import { fetchData } from "../../../api/axiosClient"
// @ts-expect-error cal-heatmap library don't have declration files :(
import CalHeatmap from 'cal-heatmap';
import FilterCarousel from "../../../components/FilterCarousel/FilterCarousel"

interface CalorieData {
  date: string,
  value: number
}

const CalorieHeatmap = () => {
  const filters = [1000, 2000, 3000]
  const filterNameMap: { [key: string]: string } = {
    500: "500",
    1000: "1000",
    2000: "2000",
    3000: "3000"
  }
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [activity, setActivity] = useState<CalorieData[]>([])
  const [cal,] = useState(new CalHeatmap())


  useEffect(() => {
    async function getData() {
      const data = await fetchData<CalorieData[]>("/calorie-data?year=2024")
      setActivity(data)
      drawCalorieHeatmap(cal, data)
    }
    getData()
  }, [cal])

  useEffect(() => {
    let newActivity = activity
    if (selectedIndex !== -1) {
      newActivity = activity.filter((data) => {
        let output = data["value"] >= filters[selectedIndex]
        if (selectedIndex + 1 < filters.length)
          output = output && data["value"] < filters[selectedIndex + 1]
        return output
      })
    }
    drawCalorieHeatmap(cal, newActivity)
  }, [selectedIndex])

  return (
    <div
      className={styles.dataSection}
    >
      <h2>Daily Calories (From Fitbit)</h2>
      <div id="calorie-heatmap"></div>
      <div id="calorie-legend"></div>

      <FilterCarousel
        items={filters.map((element) => {
          return {
            "name": filterNameMap[element.toString()]
          }
        })}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        height={5}
      />
      <p>

      </p>
    </div>
  );
}

function drawCalorieHeatmap(cal: CalHeatmap, data: CalorieData[]) {
  drawHeatmap(
    {
      cal: cal,
      data: data,
      dateCol: "date",
      valueCol: "value",
      name: "calorie",
      legendLabel: "Calories burned per day",
      color: {
        domain: [1000, 2000, 3000],
        scheme: "Purples"
      },
      units: "calories",
    }
  )
}

export default CalorieHeatmap;
