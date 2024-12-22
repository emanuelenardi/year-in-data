import { useEffect, useState } from "react"
import styles from "./GithubHeatmap.module.css"
import { drawGithubHeatmap, } from "../heatmapUtils"
import { fetchData } from "../../../api/axiosClient"
import { DistinctRepos, GithubData } from "../../../types/dataTypes"
// @ts-expect-error cal-heatmap library don't have declration files :(
import CalHeatmap from 'cal-heatmap';
import FilterCarousel from "../../../components/FilterCarousel/FilterCarousel"

const GithubHeatmap = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [distinctRepos, setDistinctRepos] = useState<DistinctRepos[]>([])
  const [activity, setActivity] = useState<GithubData[]>()
  const [cal,] = useState(new CalHeatmap())

  useEffect(() => {
    async function getData() {
      const data = await fetchData<GithubData[]>("/github-data?year=2024")
      const distinctRepos = await fetchData<DistinctRepos[]>("/distinct-github-repos?year=2024")
      setActivity(data)
      drawGithubHeatmap(cal, data)
      setDistinctRepos(distinctRepos)
    }
    getData()
  }, [])

  useEffect(() => {
    if (activity) {
      let newActivity = activity
      if (selectedIndex !== -1) {
        newActivity = activity.filter((data) => {
          return data["repository_name"] === distinctRepos[selectedIndex]["repository_name"]
        })
      }
      drawGithubHeatmap(cal, newActivity)
    }
  }, [selectedIndex])

  return (
    <div
      className={styles.dataSection}
    >
      <h2>Github Activity (From Gitlab)</h2>
      <div id="github-heatmap" style={{ height: "7rem" }}></div>
      <div id="github-legend"></div>
      <FilterCarousel
        items={distinctRepos.map((repo) => {
          return {
            "name": repo["repository_name"],
            "imageUrl": repo["repository_image"]
          }
        })}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
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
