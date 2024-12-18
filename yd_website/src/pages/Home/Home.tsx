import { useEffect, useState } from "react";
import styles from "./Home.module.css"
import { fetchData } from "../../api/axiosClient";
import CalHeatmap from 'cal-heatmap';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import Legend from 'cal-heatmap/plugins/Legend';
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

interface ReadingData {
  "ASIN": string,
  "date": string,
  "total_reading_milliseconds": number
}


const Home = () => {
  const [workoutCal,] = useState(new CalHeatmap())
  const [readingCal,] = useState(new CalHeatmap())

  useEffect(() => {
    const getData = async () => {
      try {
        const workoutData = await fetchData<Workout[]>("/workout-data");
        const readingData = await fetchData<ReadingData[]>("/kindle-data");
        drawWorkoutHeatmap(workoutCal, workoutData)
        drawKindleHeatmap(readingCal, readingData)
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
        <p>
          I feel my reading habit comes and goes in waves. Although from september onward
          I've been locked in. That's when I started daily driving the Hisense A9 as my
          phone. It has an e-ink screen so it meant I didn't have to go find my kindle 
          to read.
        </p>
      </div>
    </div>
  );
}
export default Home;

const baseOptions = {
  domain: {
    type: "month",
    gutter: 6,
    label: {
      position: 'top'
    }

  },
  subDomain: {
    type: "day",
    radius: 2,
    gutter: 3,
    label: {
      position: 'left'
    }
  },
  date: {
    start: new Date("2024-01-01"),
    locale: {
      weekStart: 1
    }
  },
  theme: "dark"
}

const basePlugins = [
  [
    CalendarLabel,
    {
      position: 'left',
      key: 'left',
      text: () => ["", "", 'Mon', '', '', 'Thu', '', '', 'Sun'],
      textAlign: 'start',
      width: 30,
      padding: [0, 0, 0, 0],
    },
  ],
]


function drawWorkoutHeatmap(cal: CalHeatmap, data: Workout[]) {
  const plugins = [...basePlugins]
  plugins.push([
    Legend,
    {
      label: 'Duration in ms',
      itemSelector: '#workout-legend',
    },
  ])
  const options = {
    ...baseOptions,
    data: {
      source: data,
      x: "date",
      y: "workout_duration",
      groupY: "min"
    },
    itemSelector: '#workout-heatmap',
    scale: {
      color: {
        scheme: "Cool",
        domain: [1.8e+6, 7.2e+6],
      }
    }
  }
  cal.paint(options, plugins);
}

function drawKindleHeatmap(cal: CalHeatmap, data: ReadingData[]) {
  const plugins = [...basePlugins]
  plugins.push([
    Legend,
    {
      label: 'Duration in ms',
      itemSelector: '#reading-legend',
    },
  ])
  const options = {
    ...baseOptions,
    data: {
      source: data,
      x: "date",
      y: "total_reading_milliseconds",
      groupY: "min"
    },
    itemSelector: '#reading-heatmap',
    scale: {
      color: {
        scheme: "Greens",
        domain: [1e+6, 7.2e+6],
      }
    }
  }
  cal.paint(options, plugins);
}