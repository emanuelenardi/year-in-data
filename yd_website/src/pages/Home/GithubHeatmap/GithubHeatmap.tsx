import { useEffect, useState } from "react"
import styles from "./GithubHeatmap.module.css"
import { drawGithubHeatmap, } from "../heatmapUtils"
import { fetchData } from "../../../api/axiosClient"
import { DistinctRepos, GithubData } from "../../../types/dataTypes"
// @ts-expect-error cal-heatmap library don't have declration files :(
import CalHeatmap from 'cal-heatmap';
import ItemCarousel from "./ItemCarousel/ItemCarousel"

const GithubHeatmap = () => {
  const [selectedItem, setSelectedItem] = useState<string>("")
  const [distinctItems, setDistinctItems] = useState<DistinctRepos[]>([])
  const [activityData, setActivityData] = useState<GithubData[]>()
  const [cal,] = useState(new CalHeatmap())

  useEffect(() => {
    async function getData() {
      const data = await fetchData<GithubData[]>("/github-data?year=2024")
      const distinctRepos = await fetchData<DistinctRepos[]>("/distinct-github-repos?year=2024")
      setActivityData(data)
      drawGithubHeatmap(cal, data)
      setDistinctItems(distinctRepos)
    }
    getData()
  }, [])

  useEffect(() => {
    if (activityData) {
      const newActivity = activityData.filter((data) => data["repository_name"].includes(selectedItem))
      drawGithubHeatmap(cal, newActivity)
    }
  }, [selectedItem])

  return (
    <div
      className={styles.dataSection}
    >
      <h2>Github Activity (From Gitlab)</h2>
      <div id="github-heatmap" style={{ height: "7rem" }}></div>
      <div id="github-legend"></div>
      <ItemCarousel
        items={distinctItems}
        selectedValue={selectedItem}
        setSelectedValue={setSelectedItem}
      />
      <p>
        2024 was the year I learned how to code (properly). I learned react, spring boot,
        typescript, vite, rest apis, graphql queries and so much moree. Although having
        done all that I was not able to land a single web dev job offer 💀.
      </p>
    </div>
  );
}

export default GithubHeatmap;
