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
import Link from 'next/link';

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
        <div className={s.contents}>
          <h1 className={s.title}>about</h1>
          <p>
            Welcome to{' '}
            <span className={s.p_title}>A Bit of Personal Space</span>––a public
            exploration of the spaces we inhabit, work, and find comfort in.
            Building upon existing, free methods of photogrammetry,{' '}
            <span className={s.p_title}>A Bit of Personal Space</span> offers a
            web-based engine for exploring three-dimensional mapped spaces,
            along with a corresponding platform for playing and submitting
            archived geometries.
          </p>
          <p>
            This project began in November of 2022 ago as a simple game engine I
            had fashioned as a present for my girlfriend––the idea being to
            forever capture and make replayable the rooms in which we have lived
            throughout our relationship. The desire to share my work led to a
            more public-facing version with cleaner controls and a database of
            spaces, which, after much iteration, finally settled into the more
            polished version you see before you.
          </p>
          <h2 className={s.section_title}>scope</h2>
          <p>
            The scope of{' '}
            <span className={s.p_title}>A Bit of Personal Space</span>{' '}
            encompasses all places one might find to be per- sonal. However, the
            focus lies mainly in studios and bedrooms––where the owner themself
            is visible in the makeup of the space.
          </p>
          <p>
            {' '}
            For example, the project allows for an interesting juxtaposition
            between the only two artists whose studios are currently in the
            system: on the one hand, sculptor Peter Kirkiles’ larger-than-life
            metal recreations of small rulers and tools give to an
            industrial-feeling studio, strewn haphazardly with heavy cables and
            massive equipment––the staples of metalwork. Yet we also have
            painter and sculptor Joe Fig with a tiny, perfectly organized
            workspace––in which he replicates in miniature form, with the same
            degree of perfection and tidiness that his own studio possesses, the
            studios of artists like Pollock and Rauschenberg. For both Kirkiles
            and Fig, their bits of personal spaces are an exact reflection of
            their work.
          </p>
          <h2 className={s.section_title}>context</h2>
          <p>
            <span className={s.p_title}>A Bit of Personal Space</span> exists in
            the context of much effort taken towards mapping spaces and studios
            through digital means––recently, for example,{' '}
            <a
              href="https://www.media-engine.com/portfolio-item/nature-morte-still-life-bruce-nauman/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bruce Nauman&apos;s 2020 &quot;Nature Morte&quot;
            </a>{' '}
            at the Sperone Westwater Gallery, where Nauman allowed traversal of
            a small mapped portion of his studio through an iPad interface.
            Where my project tries to find its niche is in scope and
            accessibility––by possessing an ever-growing collection of spaces,
            and by being accessible on the web, from any device, perpetually.
            Furthermore, the code is all{' '}
            <a
              href="https://github.com/evankirkiles/abitofpersonalspace"
              target="_blank"
              rel="noopener noreferrer"
            >
              open source
            </a>
            , and I gladly welcome any contributions.
          </p>
          <p>
            This is hardly a static project, and the catalogue of spaces will
            continue to grow into the future––with more studios, and more spaces
            in general. If you have a space or studio you would like to
            contribute and are unsure of the process, or if you have any
            questions or comments at all, do not hesitate to reach out to me at{' '}
            <a href="mailto:evan.kirkiles@yale.edu">evan.kirkiles@yale.edu</a>.
          </p>
          <p>Enjoy!</p>
          <p style={{ marginTop: '4em' }}>
            <span className={s.p_title}>A Bit of Personal Space</span> was shown
            at Yale&apos;s Center for Collaborative Arts and Media from December
            1 to December 2, 2022. View the original wall text accompanying it{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="/assets/a_bit_of_personal_space.pdf"
            >
              here
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
