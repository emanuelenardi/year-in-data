export interface WorkoutData {
  "date": string,
  "Workout_name": string,
  "workout_duration": number,
  "volume": number
}

export interface ReadingData {
  "date": string,
  "total_reading_milliseconds": number
  "ASIN": string,
}

export interface GithubData {
  "date": string,
  "repository_name": string
  "total_commits": string,
}