import { useEffect, useState } from "react";
import styles from "./Home.module.css"
import { fetchData } from "../../api/axiosClient";

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
        console.log(result)
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
    </div>
   );
}
 
export default Home;