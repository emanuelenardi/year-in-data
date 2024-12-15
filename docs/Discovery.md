# Discovery

Following information on gathering the data and finding what parts of data I require.

I plan on first gathering the data, standardize it and then store them in sqllite tables.

## Initial Idea
The end product should be a yearly activity heatmap for each peice of data. There should
be activity heatmaps for:
* Top priority:
    * What books I read
    * My gym workouts
    * What coding projects I completed
* Less priority:
    * My park run times
    * My running sessions
    * My sleep schedule
    * My steps
    * Calories burned per day

I also want to make notes on top of the heatmap. This is to mark specific events and
see what impact they had. These events include:
* Getting a new phone
* Starting my first job
* Getting a macbook

The data will be gathered from multiple places:
* Amazon Kindle data
* Strong Workout data
* Google fitbit data
* Parkrun api (I don't know if this exists)
* Github activity data

## Folder structure
```
|-- data (Not in git)
|   |-- input
|       |-- Kindle
|       |-- Takeout
|       |   `-- Fitbit
|       `-- strong23...21.csv
|-- docs (For taking nots)
|-- frontend
`-- pipeline
```