import React from 'react'
import styles from '../styles/Index.module.css'

const Index = () => {
  return (
    <div className={styles.index__container}>
        <main className={styles.main__container}>
            <div className={styles.div__container}>
                <img src="./img/games.jpg" alt="" className={styles.cover__page}/>
                <div className={styles.cover__div}></div>
            </div>
            <h1 className={styles.title}>Welcome to next, the amazing platform of games, where you can play, share, relate and more...</h1>
        </main>
    </div>
  )
}

export default Index