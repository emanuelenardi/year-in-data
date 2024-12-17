import styles from "./Home.module.css"

const Home = () => {


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