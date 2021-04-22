import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

import style from './style.module.scss';

export function Header(){
    const currentData = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR,
    })

    return (
        <header className={style.headerContainer}>
            <Link href="/">
                <a><img src="/logo.svg" alt="Podcastr"/></a>
            </Link>

            <p>O melhor para você ouvir, sempre</p>

            <span>{currentData}</span>
        </header>
    );
}