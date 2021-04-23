import { createContext } from 'react';

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
    play: (episode: Episode) => void,
    togglePlay: () => void,
    setPlayingState: (state: boolean) => void,
    isPlaying: boolean
}

export const PlayerContext = createContext({} as PlayerContextData);

