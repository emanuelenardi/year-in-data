import { useEffect, useState } from "react";
import styles from "./Home.module.css"
import { fetchData } from "../../api/axiosClient";
import CalHeatmap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';


interface Workout {
  "index": number,
  "Date": string,
  "Workout Name": string,
  "Exercise Name": string,
  "Set Order": number,
  "Weight": number,
  "Reps": number,
  "Distance": number,
  "Seconds": number,
  "Notes": string,
  "Workout Duration": number,
  "Volume": number
}


const Home = () => {
  const [, setWorkoutData] = useState<Workout[]>([])

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData<Workout[]>("/workout-data");
        setWorkoutData(result);
        const cal = new CalHeatmap();
        cal.paint({
          domain: {
            type: "month"
          },  
          subDomain: {
            type: "day"
          },
          date: {
            start: new Date("2024-01-01")
          },
          data: {
            source: result,
            x: "Date",
            y: "Volume",
            groupY: "min"
          }
        });
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
        2024 is over, it was meh. Here is what I was doing this year represented through
        a yearly heatmap.
      </p>

      <div
      className={styles.workoutContainer}
      >
        <h2>Workout Activity</h2>
        <div id="cal-heatmap"></div>
        <p>
          Damn I fell off. Although I feel like I've still been gaining muscle more now.
          I started my first job near the end of April. You can see how the frequency
          decreases after this point.
        </p>
      </div>
    </div>
   );
}
 
export default Home;