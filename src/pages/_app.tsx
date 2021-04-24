import "../styles/global.scss";

import { Header } from "../Components/Header";
import { Player } from "../Components/Player";

import style from "../styles/app.module.scss";
import { PlayerContextProvider } from "../contexts/PlayerContext";

function MyApp({ Component, pageProps }) {
  return(
    <PlayerContextProvider>
      <div className={style.wrapper}>
        <main>
          <Header/>
          <Component {...pageProps} />
        </main>
        <Player/>
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
