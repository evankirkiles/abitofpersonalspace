/*
 * Logo.tsx
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */
import s from './Logo.module.scss';

type LogoProps = {
  strokeWidth?: number;
};

const Logo: React.FC<LogoProps> = function Logo({ strokeWidth = 2 }) {
  return (
    <svg
      width="166"
      height="103"
      viewBox="-10 -10 186 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={s.container}
    >
      <path
        d="M1 65.3997V49.195V30.0567C16.2007 30.0567 19.2687 41.5118 19.2687 49.195H71.2857C64.9172 49.195 52.1803 44.4733 52.1803 25.5864C52.1803 6.69959 67.9388 1 83 1C98.0612 1 113.82 6.69959 113.82 25.5864C113.82 44.4733 101.083 49.195 94.7143 49.195H146.731C146.731 41.5118 149.799 30.0567 165 30.0567V49.195V65.3997H113.82V102H83H52.1803V65.3997H1Z"
        stroke="black"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default Logo;
