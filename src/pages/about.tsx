/*
 * about.tsx
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */
import Header from '../components/Header/Header';
import s from '../styles/About.module.scss';

const AboutPage: React.FC = function AboutPage() {
  return (
    <div className={s.container}>
      <Header />
    </div>
  );
};

export default AboutPage;
