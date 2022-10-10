/*
 * index.tsx
 * author: evan kirkiles
 * created on Sun Oct 09 2022
 * 2022 the nobot space,
 */
import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header/Header';
import Logo from '../components/Logo/Logo';
import s from '../styles/Home.module.scss';

export default function Home() {
  return (
    <div className={s.container}>
      <div className={s.header_container}>
        <div className={s.main_container}>
          <h1 className={s.title}>A&nbsp;BIT&nbsp;OF PERSONAL&nbsp;SPACE</h1>
          <div className={s.subtext}>
            is an exploration into the places we call home. the spaces embodied
            here are <i>us</i>––they define our selves and our interactions with
            the world. yet what happens when we share these entirely personal
            places? is their magic lost, or does it regain power through the
            eyes of another beholder? who would even want to share their own
            personal space? enter and see for yourself. and please, take off
            your shoes.
          </div>
        </div>
        <div className={`${s.logo_column} ${s.subtext}`}>
          <div className={s.logo}>
            <Logo />
          </div>
          <span>
            by{' '}
            <a
              href="https://evankirkiles.com"
              target="_blank"
              rel="noopener noreferrer"
              className={s.link}
            >
              evan kirkiles
            </a>
            .
          </span>
          <span className={s.date}>
            <i>winter 2022</i>
          </span>
        </div>
      </div>
      <Header />
      <div className={s.filter_bar}>
        <span>{'>> studios'}</span>
        <span>{'>> homes'}</span>
        <span>{'>> stations'}</span>
        <span>{'>> dorms'}</span>
      </div>
      <div className={s.door_grid}>
        <div className={s.door}>peter kirkiles</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
        <div className={s.door}>HI</div>
      </div>
    </div>
  );
}
