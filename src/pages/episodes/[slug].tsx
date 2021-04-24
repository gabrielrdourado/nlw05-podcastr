import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link'
import Image from 'next/image';
import { api } from '../../services/api';
import { parseISO, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import style from './episode.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';
import Head from 'next/head';

type Episode = {
    id: string;
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    description: string;
    durationAsString: string;
    url: string;
    publishedAt: string;
};

type EpisodeProps = {
    episode: Episode;
};

export default function Episode({episode}: EpisodeProps){
    const route = useRouter();

    const { play } = usePlayer();

    return (
        <div className={style.episode}>

            <Head>
                <title>
                Podcastr - {episode.title}
                </title>
             </Head>

            <div className={style.thumbnailContainer}>
                <Link href='/'>
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
                <Image width={700} height={350} src={episode.thumbnail} alt={episode.title} objectFit='cover'/>
                <button type="button" onClick={()=>play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={style.description} dangerouslySetInnerHTML={{__html:episode.description}}/>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', { 
        params: { 
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id
            }
        }
    })

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async(ctx)=> {

    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`);

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        thumbnail: data.thumbnail,
        description: data.description,
        url: data.file.url,
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
    }

    return {
        props: {
            episode
        },
        revalidate: 60*60*24, //24 hours
    };
}