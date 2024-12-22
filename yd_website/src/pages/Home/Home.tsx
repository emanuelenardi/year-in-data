import { useEffect, useState } from "react";
import styles from "./Home.module.css"
import { fetchData } from "../../api/axiosClient";
// @ts-expect-error cal-heatmap library don't have declration files :(
import CalHeatmap from 'cal-heatmap';
import { DataResponseType, SleepData } from "../../types/dataTypes";
import {  drawSleepHeatmap } from "./heatmapUtils";
import ReadingHeatmap from "./ReadingHeatmap/ReadingHeatmap";
import GithubHeatmap from "./GithubHeatmap/GithubHeatmap";
import WorkoutHeatmap from "./WorkoutHeatmap/WorkoutHeatmap";

const Home = () => {
  const [sleepCal,] = useState(new CalHeatmap())
  useEffect(() => {
    const getData = async () => {
      try {
        const sleepData = await fetchData<DataResponseType<SleepData[]>>("/sleep-data");
        drawSleepHeatmap(sleepCal, sleepData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [])

  return (
    <div
      className={styles.home}
    >
      <h1>Year in Data</h1>
      <p>
        2024 is over, 2025 is here. Here is what I was doing this year represented through
        yearly heatmaps.
      </p>

      <div
        className={styles.mainContent}
      >

        <WorkoutHeatmap />

        <ReadingHeatmap />

        <GithubHeatmap />

        <div
          className={styles.dataSection}
        >
          <h2>Sleep Activity (From Fitbit)</h2>
          <div id="sleep-heatmap"></div>
          <div id="sleep-legend"></div>
          <p>
            Sleep was much better than expected. Especially recently in December, I am
            getting days when I sleep for 10 hours :0. Lol you can see when I lost my Fitbit
            in February. I am also surprised at how often I have my fitbit on.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;