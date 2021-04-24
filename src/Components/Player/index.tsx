import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import { usePlayer } from '../../contexts/PlayerContext';

import style from './style.module.scss';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player(){
    const audioRef = useRef<HTMLAudioElement>();

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        togglePlay,
        setPlayingState,
        nextEpisode,
        previousEpisode,
        hasNextEpisode,
        hasPreviousEpisode,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayerState
    } = usePlayer();

    const episode = episodeList[currentEpisodeIndex];

    const [progress, setProgress] = useState(0);

    function setupProgressListener(){
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', ()=>setProgress(Math.floor(audioRef.current.currentTime)))
    }

    function updateTime(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if(hasNextEpisode) {
            nextEpisode();
        } else {
            clearPlayerState()
        }
    }

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
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={style.slider}>
                        { episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}                                
                                onChange={updateTime}
                                trackStyle={{backgroundColor: '#04d361'}}
                                railStyle={{backgroundColor: '#9f75ff'}}
                                handleStyle={{borderColor: '#04d361', borderWidth: 4}}
                            />
                        ) : (
                            <div className={style.emptySlider}/>
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio                         
                        src={episode.url} 
                        autoPlay                         
                        loop={isLooping}
                        ref={audioRef}
                        onEnded={()=>handleEpisodeEnded()} 
                        onPlay={() => setPlayingState(true)} 
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={()=>setupProgressListener()}
                    />
                )}

                <div className={style.buttons}>
                    <button 
                        className={isShuffling ? style.isActive : ''} 
                        type="button" 
                        disabled={!episode || episodeList.length == 1} 
                        onClick={toggleShuffle}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode || !hasPreviousEpisode} onClick={() => previousEpisode()}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button type="button" className={style.buttonPlay} disabled={!episode} onClick={togglePlay}>
                        { !isPlaying || !episode ? (
                            <img src="/play.svg" alt="Pausar"/>
                        ) : (
                            <img src="/pause.svg" alt="Tocar"/>
                        )}
                    </button>
                    <button type="button" disabled={!episode || !hasNextEpisode} onClick={()=>nextEpisode()}>
                        <img src="/play-next.svg" alt="Tocar a próxima"/>
                    </button>
                    <button 
                        className={isLooping ? style.isActive : ''} 
                        type="button" 
                        disabled={!episode} 
                        onClick={toggleLoop}
                    >
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}