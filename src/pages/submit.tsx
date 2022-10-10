/*
 * submit.tsx
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */

import { NextPage } from 'next';
import Head from 'next/head';
import s from '../styles/Submit.module.scss';

const SubmitPage: NextPage = function SubmitPage() {
  return (
    <>
      <Head></Head>
      <div className={s.container}></div>
    </>
  );
};

export default SubmitPage;
