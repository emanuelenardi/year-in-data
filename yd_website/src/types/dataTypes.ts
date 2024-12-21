export interface DataResponseType<T> {
  "distinct_categories": { [key: string]: number },
  "data": T
}

export interface WorkoutData {
  "date": string,
  "Workout_name": string,
  "workout_duration": number,
  "volume": number
}

export interface ReadingData {
  "date": string,
  "total_reading_minutes": number
  "ASIN": string,
}

export interface GithubData {
  "date": string,
  "repository_name": string,
  "repository_url": string,
  "repository_image": string,
  "total_commits": string,
}

export interface DistinctRepos {
  "index": number,
  "date": string,
  "repository_name": string,
  "repository_url": string,
  "repository_image": string,
}

export interface SleepData {
  "data": string,
  "start_time": string,
  "end_time": string,
  "total_duration_hours": number
}