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
import { useEffect, useState } from 'react';
import { getSignedFileUrl } from '../../util/s3client';

type SpaceCardProps = {
  space: APIt.Space;
};

const SpaceCard: React.FC<SpaceCardProps> = function SpaceCard({ space }) {
  // gets the image src from the file
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  useEffect(() => {
    if (space.file_door) {
      getSignedFileUrl(space.file_door.object.key).then((img) => {
        setImgSrc(img);
      });
    }
  }, []);

  return (
    <div className={s.container}>
      <div className={s.img_preview}>
        <Image src={DOOR} className={s.door_image} alt={'a door'} />
      </div>
      <Link href={`/spaces/${space.id}`}>
        <div className={s.shadow_overlay}></div>
      </Link>
      <Link href={`/spaces/${space.id}`}>
        <div className={s.img_container}>
          {imgSrc !== null ? (
            <img src={imgSrc} className={s.door_image} alt={'a door'} />
          ) : null}
          {/* <Image src={DOOR} className={s.door_image} alt={'a door'} /> */}
          <div className={s.meta_info}>
            {space.location ? (
              <div className={s.location}>{space.location}</div>
            ) : null}
            <div className={s.title}>{space.title}</div>
            {space.author ? (
              <div className={s.author}>{space.author}</div>
            ) : null}
          </div>
        </div>
      </Link>

      <div className={s.created_at}>
        {new Date(space.created_at).toDateString()}
      </div>
    </div>
  );
};

export default SpaceCard;
