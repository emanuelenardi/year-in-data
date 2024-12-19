// @ts-expect-error cal-heatmap library don't have declration files :(
import CalHeatmap from 'cal-heatmap';
// @ts-expect-error cal-heatmap library don't have declration files :(
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
// @ts-expect-error cal-heatmap library don't have declration files :(
import Legend from 'cal-heatmap/plugins/Legend';
// @ts-expect-error cal-heatmap library don't have declration files :(
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import 'cal-heatmap/cal-heatmap.css';
import { Dayjs } from "dayjs";
import { GithubData, ReadingData, WorkoutData } from '../../types/dataTypes';


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

function createTooltip(unit: string) {
  return [
    Tooltip,
    {
      enabled: true,
      text: function (_timestamp: string, value: string, dayjsDate: Dayjs ) {
        return `${value}  ${unit} --- ${dayjsDate.toDate().toDateString()}`;
      }
    }
  ]
}


export function drawWorkoutHeatmap(cal: CalHeatmap, data: WorkoutData[]) {
  const plugins = [...basePlugins]
  plugins.push([
    Legend,
    {
      label: 'Duration in minutes',
      itemSelector: '#workout-legend',
    },
  ])
  plugins.push(createTooltip("minutes"))
  const options = {
    ...baseOptions,
    data: {
      source: data,
      x: "date",
      y: "workout_duration_minutes",
      groupY: "min"
    },
    itemSelector: '#workout-heatmap',
    scale: {
      color: {
        scheme: "YlGnBu",
        domain: [-10, 100],
      }
    }
  }
  cal.paint(options, plugins);
}

export function drawKindleHeatmap(cal: CalHeatmap, data: ReadingData[]) {
  const plugins = [...basePlugins]
  plugins.push([
    Legend,
    {
      label: 'Duration in minutes',
      itemSelector: '#reading-legend',
    },
  ])
  plugins.push(createTooltip("minutes"))
  const options = {
    ...baseOptions,
    data: {
      source: data,
      x: "date",
      y: "total_reading_minutes",
      groupY: "min"
    },
    itemSelector: '#reading-heatmap',
    scale: {
      color: {
        scheme: "YlOrBr",
        domain: [-50, 150],
      }
    }
  }
  cal.paint(options, plugins);
}

export function drawGithubHeatmap(cal: CalHeatmap, data: GithubData[]) {
  const plugins = [...basePlugins]
  plugins.push([
    Legend,
    {
      label: 'Number of commits',
      itemSelector: '#github-legend',
    },
  ])
  plugins.push(createTooltip("commits"))
  const options = {
    ...baseOptions,
    data: {
      source: data,
      x: "date",
      y: "total_commits",
      groupY: "min"
    },
    itemSelector: '#github-heatmap',
    scale: {
      color: {
        scheme: "Greens",
        domain: [-10, 20],
      }
    }
  }
  cal.paint(options, plugins);
}