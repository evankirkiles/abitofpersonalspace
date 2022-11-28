/*
 * about.tsx
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import Header from '../components/Header/Header';
import s from '../styles/About.module.scss';

const AboutPage: React.FC = function AboutPage() {
  return (
    <>
      <Head>
        <title>guide - abitofpersonalspace</title>
        <NextSeo
          canonical={'https://abitofpersonal.space/about'}
          description={'about the A Bit of Personal Space project.'}
        />
      </Head>
      <Header />
      <div className={s.container}>
        <div className={s.contents}></div>
      </div>
    </>
  );
};

export default AboutPage;
