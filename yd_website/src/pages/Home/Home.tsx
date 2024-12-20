import { useEffect, useState } from "react";
import styles from "./Home.module.css"
import { fetchData } from "../../api/axiosClient";
// @ts-expect-error cal-heatmap library don't have declration files :(
import CalHeatmap from 'cal-heatmap';
import { DataResponseType, GithubData, ReadingData, SleepData, WorkoutData } from "../../types/dataTypes";
import { drawGithubHeatmap, drawKindleHeatmap, drawSleepHeatmap, drawWorkoutHeatmap } from "./heatmapUtils";
import BookCarousel from "../../components/BookCarousel/BookCarousel";

const Home = () => {
  const [workoutCal,] = useState(new CalHeatmap())
  const [readingCal,] = useState(new CalHeatmap())
  const [githubCal,] = useState(new CalHeatmap())
  const [sleepCal,] = useState(new CalHeatmap())
  const [books, setBooks] = useState<string[]>([])

  useEffect(() => {
    const getData = async () => {
      try {
        const workoutData = await fetchData<DataResponseType<WorkoutData[]>>("/workout-data");
        const readingData = await fetchData<DataResponseType<ReadingData[]>>("/kindle-data?year=2024");
        const githubData = await fetchData<DataResponseType<GithubData[]>>("/github-data");
        const sleepData = await fetchData<DataResponseType<SleepData[]>>("/sleep-data");
        drawWorkoutHeatmap(workoutCal, workoutData["data"])
        drawKindleHeatmap(readingCal, readingData)
        setBooks(Object.keys(readingData["distinct_categories"]))
        drawGithubHeatmap(githubCal, githubData["data"])
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

      <div
        className={styles.dataSection}
      >
        <h2>Reading Activity (From Amazon Kindle)</h2>
        <div id="reading-heatmap"></div>
        <div id="reading-legend"></div>
        <BookCarousel asinCodes={books} />
        <p>
          I feel my reading habit comes and goes in waves. Although from september onward
          I've been locked in. That's when I started daily driving the Hisense A9 as my
          phone. It has an e-ink screen so it meant I didn't have to go find my kindle 
          to read.
        </p>
      </div>

      <div
        className={styles.dataSection}
      >
        <h2>Github Activity (From Gitlab)</h2>
        <div id="github-heatmap"></div>
        <div id="github-legend"></div>
        <p>
          2024 was the year I learned how to code (properly). I learned react, spring boot,
          typescript, vite, rest apis, graphql queries and so much moree. Although having
          done all that I was not able to land a single web dev job offer 💀.
        </p>
      </div>

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
  );
}

export default Home;