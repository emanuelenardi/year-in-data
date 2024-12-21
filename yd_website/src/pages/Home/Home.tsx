import { useEffect, useState } from "react";
import styles from "./Home.module.css"
import { fetchData } from "../../api/axiosClient";
// @ts-expect-error cal-heatmap library don't have declration files :(
import CalHeatmap from 'cal-heatmap';
import { DataResponseType, SleepData, WorkoutData } from "../../types/dataTypes";
import {  drawSleepHeatmap, drawWorkoutHeatmap } from "./heatmapUtils";
import ReadingHeatmap from "./ReadingHeatmap/ReadingHeatmap";
import GithubHeatmap from "./GithubHeatmap/GithubHeatmap";

const Home = () => {
  const [workoutCal,] = useState(new CalHeatmap())
  const [sleepCal,] = useState(new CalHeatmap())
  useEffect(() => {
    const getData = async () => {
      try {
        const workoutData = await fetchData<DataResponseType<WorkoutData[]>>("/workout-data");
        const sleepData = await fetchData<DataResponseType<SleepData[]>>("/sleep-data");
        drawWorkoutHeatmap(workoutCal, workoutData["data"])
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

        <div
          className={styles.dataSection}
        >
          <h2>Workout Activity (From Strong workout app)</h2>
          <div id="workout-heatmap"></div>
          <div id="workout-legend"></div>
          <p>
            Damn I fell off. Although I feel like I've still been gaining muscle more now.
            I started my first job near the end of April. You can see how the frequency
            decreases after this point.
          </p>
        </div>

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