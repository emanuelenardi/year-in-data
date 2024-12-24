import styles from "./Home.module.css"
import ReadingHeatmap from "./ReadingHeatmap/ReadingHeatmap";
import GithubHeatmap from "./GithubHeatmap/GithubHeatmap";
import WorkoutHeatmap from "./WorkoutHeatmap/WorkoutHeatmap";
import SleepHeatmap from "./SleepHeatmap/SleepHeatmap";

const Home = () => {

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

        <SleepHeatmap />
      </div>
    </div>
  );
}

export default Home;