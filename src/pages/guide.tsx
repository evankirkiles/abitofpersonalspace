/*
 * guide.tsx
 * author: evan kirkiles
 * created on Sun Nov 27 2022
 * 2022 the nobot space,
 */

import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header/Header';
import SubmitForm from '../components/SubmitForm/SubmitForm';
import s from '../styles/Guide.module.scss';

const GuidePage: NextPage = function SubmitPage() {
  return (
    <>
      <Head>
        <title>guide - abitofpersonalspace</title>
        <NextSeo
          canonical={'https://abitofpersonal.space/guide'}
          description={'how to prepare a space for submission.'}
        />
      </Head>
      <Header />
      <div className={s.container}>
        <div className={s.contents}>
          <h1 className={s.title}>mapping a space</h1>
          <p>
            <span className={s.p_title}>A Bit of Personal Space</span> is open
            to public submissions––in fact, we heavily encourage it. if
            you&apos;d like to submit your own space for public archival, you
            will need two tools:
          </p>
          <ul>
            <li>
              a device with a LiDAR sensor, i.e. any of iPhone 12 Pro / Pro Max,
              iPhone 13 Pro / Pro Max, iPad Pro 2020 / 2021 / 2022 (or later).
            </li>
            <li>
              the{' '}
              <a
                href="https://poly.cam"
                target="_blank"
                rel="noopener noreferrer"
                className={s.polycam}
              >
                Polycam app
              </a>{' '}
              for performing the scan.
            </li>
          </ul>
          <p>
            you may also attempt to use Polycam with the photo scanning mode,
            available on any platform which the Polycam app allows. however,
            your mileage may vary, and all of the scans currently on the website
            were done with LiDAR.
          </p>
          <h2 className={s.section_title}>1) scan your space</h2>
          <p>
            begin by opening up the Polycam app and accessing the scan
            interface. using LiDAR mode, begin recording, and move the camera
            around a bit. you will begin to see the projected digital model of
            your real space. as you walk around and move the camera, the
            projection will reach new areas and gain definition. once you have
            your desired level of detail, and have reached all the areas you
            want included in your scan, end the recording. now, by processing
            the model, the point cloud will be converted into a model made of
            triangles, readable by traditional modeling softwares.
          </p>
          <p>
            at this point, also remember to take a preview picture of the space
            you are scanning––you will need it to upload to our platform in step
            3. do this with your phone&apos;s regular camera!
          </p>
          <h2 className={s.section_title}>2) download your scan</h2>
          <p>
            you now need to download a <b>.glb</b> (<b>G</b>raphics <b>L</b>
            anguage <b>B</b>inary) representation of your scan, which packages
            together the scanned geometry and textures into a single compressed
            binary file. we recommend doing this by first clicking the little
            cloud icon in the Polycam app to upload the model to Polycam
            servers, and then downloading the <b>.glb</b> on your computer from{' '}
            <a
              href="https://poly.cam/captures"
              target="_blank"
              rel="noopener noreferrer"
              className={s.polycam}
            >
              Polycam&apos;s web platform
            </a>
            .
          </p>
          <h2 className={s.section_title}>3) upload your scan</h2>
          <p>
            the last step is to upload the room to{' '}
            <span className={s.p_title}>A Bit of Personal Space</span>. Go to{' '}
            <Link href="/submit" target="_blank" rel="noopener noreferrer">
              the submission page
            </Link>{' '}
            and fill in the form with as much information about your space as
            you deem sharable. use the file upload fields to provide the{' '}
            <b>.glb</b> you downloaded previously, as well as the preview
            picture.
          </p>
          <p>
            once you submit, your file will be uploaded to our servers, at which
            point we will review the space, add in physics collision boxes, and
            then release your space on{' '}
            <span className={s.p_title}>A Bit of Personal Space</span>. and
            thank you for participating!
          </p>
        </div>
      </div>
    </>
  );
};

export default GuidePage;
