import { useEffect, useState } from "react"
import styles from "./TimeSeriesHeatmap.module.css"
import { fetchData } from "../../api/axiosClient"
// @ts-expect-error cal-heatmap library don't have declration files :(
import CalHeatmap from 'cal-heatmap';
import FilterCarousel from "../FilterCarousel/FilterCarousel";
import { drawHeatmap } from "./heatmapUtils";


interface TimeSeriesData {
  date: string,
  value: number
}

const TimeSeriesHeatmap = (
  {
    name,
    filterMap,
    dataUrl,
    title,
    description,
    colorScheme="Greens"
  } :
  {
    name: string,
    filterMap: { [key: number]: string },
    dataUrl: string,
    title: string,
    description: string,
    colorScheme?: string
  }
) => {
  const filters: number[] = Object.keys(filterMap).map(value => Number(value))
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [activity, setActivity] = useState<TimeSeriesData[]>([])
  const [cal,] = useState(new CalHeatmap())
  const drawTimeSeriesHeatmap = (data: TimeSeriesData[]) => {
    drawHeatmap(
      {
        cal: cal,
        data: data,
        dateCol: "date",
        valueCol: "value",
        name: name,
        legendLabel: `${name}s burned per day`,
        color: {
          domain: filters,
          scheme: colorScheme
        },
        units: `${name}s`,
      }
    )
  }

  useEffect(() => {
    async function getData() {
      const data = await fetchData<TimeSeriesData[]>(dataUrl)
      setActivity(data)
      drawTimeSeriesHeatmap(data)
    }
    getData()
  }, [cal])

  useEffect(() => {
    let newActivity = activity
    if (selectedIndex !== -1) {
      newActivity = activity.filter((data) => {
        let output = false
        if (filters.length <= 1) {
          output = true
        }
        else if (selectedIndex === 0) {
          output = data["value"] < filters[selectedIndex + 1]
        }
        else if (selectedIndex === filters.length -1) {
          output = data["value"] >= filters[selectedIndex]
        } else {
          output = data["value"] >= filters[selectedIndex] && data["value"] < filters[selectedIndex + 1]
        }
        return output
      })
    }
    drawTimeSeriesHeatmap(newActivity)
  }, [selectedIndex])

  return (
    <div
      className={styles.dataSection}
    >
      <h2>{title}</h2>
      <div id={`${name}-heatmap`}></div>
      <div id={`${name}-legend`}></div>

      <FilterCarousel
        items={filters.map((element: number) => {
          return {
            "name": filterMap[element]
          }
        })}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        height={5}
      />
      <p>
        {description}
      </p>
    </div>
  );
}

export default TimeSeriesHeatmap;
