/*
 * submit.tsx
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */

import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import Header from '../components/Header/Header';
import SubmitForm from '../components/SubmitForm/SubmitForm';
import s from '../styles/Submit.module.scss';

const SubmitPage: NextPage = function SubmitPage() {
  return (
    <>
      <Head>
        <title>submit - abitofpersonalspace</title>
        <NextSeo
          canonical={'https://abitofpersonal.space/submit'}
          description={'submit your own personal space.'}
        />
      </Head>
      <Header />
      <div className={s.container}>
        {/* <div className={s.form_container}> */}
        <SubmitForm />
        {/* </div> */}
      </div>
    </>
  );
};

export default SubmitPage;
