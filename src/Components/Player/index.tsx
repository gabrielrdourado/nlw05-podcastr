import { useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import { PlayerContext } from '../../contexts/PlayerContext';

import style from './style.module.scss';
import 'rc-slider/assets/index.css';

export function Player(){
    const audioRef = useRef<HTMLAudioElement>();

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        togglePlay,
        setPlayingState 
    } = useContext(PlayerContext);

    const episode = episodeList[currentEpisodeIndex];

    useEffect(()=> {
        if (!audioRef.current){
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        }else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    return (
        <div className={style.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={style.currentEpisode}>
                    <Image 
                        width={592} 
                        height={592} 
                        src={episode.thumbnail} 
                        objectFit="cover" 
                        alt={episode.title} 
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={style.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            

            <footer className={!episode ? style.empty : ''}>
                <div className={style.progress}>
                    <span>00:00</span>
                    <div className={style.slider}>
                        { episode ? (
                            <Slider
                                trackStyle={{backgroundColor: '#04d361'}}
                                railStyle={{backgroundColor: '#9f75ff'}}
                                handleStyle={{borderColor: '#04d361', borderWidth: 4}}
                            />
                        ) : (
                            <div className={style.emptySlider}/>
                        )}
                    </div>
                    <span>00:00</span>
                </div>

                {episode && (
                    <audio src={episode.url} autoPlay ref={audioRef} onPlay={() => setPlayingState(true)} onPause={() => setPlayingState(false)}/>
                )}

                <div className={style.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button type="button" className={style.buttonPlay} disabled={!episode} onClick={togglePlay}>
                        { isPlaying ? (
                            <img src="/pause.svg" alt="Pausar"/>
                        ) : (
                            <img src="/play.svg" alt="Tocar"/>
                        )}
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/play-next.svg" alt="Tocar a próxima"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}