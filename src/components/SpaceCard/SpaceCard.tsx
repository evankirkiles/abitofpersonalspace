/*
 * SpaceCard.tsx
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */
import * as APIt from '../../supabase/types';
import s from './SpaceCard.module.scss';
import Image from 'next/future/image';
import DOOR from '../../../public/test/door.png';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getSignedFileUrl } from '../../util/s3client';
import { CSSTransition } from 'react-transition-group';
import OptimizedImage from '../OptimizedImage/OptimizedImage';

type SpaceCardProps = {
  space: APIt.Space;
};

const SpaceCard: React.FC<SpaceCardProps> = function SpaceCard({ space }) {
  const enterEffectRef = useRef<HTMLDivElement>(null);
  const [enter, setIsEntered] = useState(false);

  return (
    <div
      className={`${s.container} ${
        space.door_handle_on_right ? 'open-right' : ''
      }`}
    >
      <div className={s.img_preview}>
        {/* <Image src={DOOR} className={s.door_image} alt={'a door'} /> */}
      </div>
      <Link href={`/spaces/${space.id}`}>
        <div
          className={s.shadow_overlay}
          onClick={() => setIsEntered(true)}
        ></div>
      </Link>
      <div className={s.img_container}>
        {/* <OptimizedImage
          src={space.file_door?.object.key}
          className={s.door_image}
          alt={'a door'}
          sizes={`
            (max-width: 767px) 150px,
            (max-width: 1500px) 200px,
            300px 
            `}
        /> */}
        {/* <Image src={DOOR} className={s.door_image} alt={'a door'} /> */}
        <div className={s.meta_info}>
          {space.location ? (
            <div className={s.location}>{space.location}</div>
          ) : null}
          <div className={s.title}>{space.title}</div>
          {space.author ? <div className={s.author}>{space.author}</div> : null}
        </div>
        <div className={s.door_handle}></div>
      </div>
      <div className={s.created_at}>
        {new Date(space.created_at).toDateString()}
      </div>
      <CSSTransition
        in={enter}
        timeout={3000}
        nodeRef={enterEffectRef}
        mountOnEnter
      >
        <div className={s.enter_effect} ref={enterEffectRef}>
          <div
            className={s.enter_effect_filler}
            style={{ gridArea: 'b0' }}
          ></div>
          <div
            className={s.enter_effect_filler}
            style={{ gridArea: 'b1' }}
          ></div>
          <svg
            role="none"
            viewBox="0 0 1000 1000"
            className={s.enter_effect_center}
          >
            <defs>
              <radialGradient id="maskGradient">
                <stop offset="10%" stop-color="black" />
                <stop offset="95%" stop-color="white" />
              </radialGradient>
            </defs>
            <mask
              id="masking"
              maskUnits="objectBoundingBox"
              maskContentUnits="objectBoundingBox"
            >
              <rect x="0" y="0" width="1" height="1" fill="white" />
              <circle cx=".5" cy=".5" r=".3" fill="url('#maskGradient')" />
            </mask>
            <rect
              x="0"
              y="0"
              width="1000"
              height="1000"
              fill="black"
              mask="url('#masking')"
            />
          </svg>
          <div
            className={s.enter_effect_filler}
            style={{ gridArea: 'b2' }}
          ></div>
          <div
            className={s.enter_effect_filler}
            style={{ gridArea: 'b3' }}
          ></div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default SpaceCard;
