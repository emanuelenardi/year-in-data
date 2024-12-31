import styles from "./Home.module.css"
import ReadingHeatmap from "./ReadingHeatmap/ReadingHeatmap";
import GithubHeatmap from "./GithubHeatmap/GithubHeatmap";
import WorkoutHeatmap from "./WorkoutHeatmap/WorkoutHeatmap";
import SleepHeatmap from "./SleepHeatmap/SleepHeatmap";
import TimeSeriesHeatmap from "../../components/TimeSeriesHeatmap/TimeSeriesHeatmap";

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

        <TimeSeriesHeatmap
          name="calorie"
          filterMap={{
            1500: "low",
            2000: "normal",
            3000: "active",
            3500: "very active"
          }}
          units="calories"
          dataUrl="/calorie-data"
          title="Calories burned (From Fitbit)"
          description="Shows how many calories I burned. I don't know what to do with this
          information but here it is. Apparently the average person burns 2500 per day.
          Fitbit overestimates how many calories a person burns per day."
          colorScheme="YlOrRd"
        />

        <TimeSeriesHeatmap
          name="step"
          filterMap={{
            1000:"low",
            5000:"mid",
            10000:"high"
          }}
          units="steps"
          dataUrl="/steps-data"
          title="Steps per day (From Fitbit)"
          description="I walk alot on saturdays 🚶‍♂️"
          colorScheme="PuBuGn"
        />

        <TimeSeriesHeatmap
          name="running"
          filterMap={{
            1:"1 km",
            2:"2 km",
            3:"3 km",
            5:"5 km"
          }}
          units="kilometers"
          dataUrl="/running-data"
          dateCol="date"
          valueCol="distance"
          title="Running (From Fitbit)"
          description="I keep forgetting to charge/press start on my fitbit so some of my
          runs have been lost."
          colorScheme="Greens"
        />


      </div>
    </div>
  );
}

export default Home;