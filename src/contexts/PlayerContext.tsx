import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
    title: string;
    thumbnail: string;
    members: string;
    url: string;
    duration: number;
}

type PlayerContextData = {
    episodeList: Episode[],
    currentEpisodeIndex: number,
    isPlaying: boolean,
    hasNextEpisode: boolean,
    hasPreviousEpisode: boolean,
    isLooping: boolean,
    isShuffling: boolean,    
    play: (episode: Episode) => void,
    togglePlay: () => void,
    setPlayingState: (state: boolean) => void,
    playList: (list: Episode[], index: number) => void,
    nextEpisode: () => void,
    previousEpisode: () => void,
    toggleLoop: () => void,
    toggleShuffle: () => void,
    clearPlayerState: () => void
}

type PlayerContextProviderProps = {
    children: ReactNode,
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({children}:PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  const hasPreviousEpisode = currentEpisodeIndex > 0;
  const hasNextEpisode =  isShuffling || currentEpisodeIndex + 1 < episodeList.length;

  function nextEpisode(){
    if (isShuffling) {
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);

        setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNextEpisode) { 
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        setIsPlaying(true);
    }
  }

  function previousEpisode(){
    if (hasPreviousEpisode) { 
        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        setIsPlaying(true);
    }
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function setPlayingState (state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState () {
      setEpisodeList([]);
      setCurrentEpisodeIndex(0);
      setIsPlaying(false);
  }

  return (
    <PlayerContext.Provider value={{
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        hasNextEpisode,
        hasPreviousEpisode,
        isLooping,
        isShuffling,
        play, 
        togglePlay, 
        setPlayingState, 
        playList, 
        nextEpisode,
        previousEpisode,
        toggleLoop,
        toggleShuffle,
        clearPlayerState
    }}>
        {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}