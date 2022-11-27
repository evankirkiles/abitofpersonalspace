/*
 * Space.tsx
 * author: evan kirkiles
 * created on Tue Oct 11 2022
 * 2022 the nobot space,
 */
import { useEffect, useRef, useState } from 'react';
import * as APIt from '../../supabase/types';
import { World } from './game/world/World';
import { AiOutlineCamera, AiOutlineUser } from 'react-icons/ai';
import s from './Space.module.scss';

type SpaceProps = {
  world: string;
};

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(dm)} ${sizes[i]}`;
}

const Space: React.FC<SpaceProps> = function Space({ world }) {
  // connect canvas to game
  const canvasRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<World | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const loadingDRef = useRef<HTMLDivElement>(null);
  const loadingTRef = useRef<HTMLDivElement>(null);
  const viewToggleRef = useRef<HTMLDivElement>(null);

  // loading state
  const [isLoading, setIsLoading] = useState(true);
  const [camView, setCamView] = useState(false);

  // initialize the world immediately
  useEffect(() => {
    // if there is a world, destroy it
    if (worldRef.current) {
      worldRef.current.destroy();
    }
    // now rebuild it with the better world
    worldRef.current = new World(canvasRef.current!, world, {
      onDownloadFinish: () => setIsLoading(false),
      onDownloadProgress: (p: number, d: number, t: number) => {
        if (loadingRef.current && loadingDRef.current && loadingTRef.current) {
          loadingRef.current.style.transform = `scaleX(${p})`;
          loadingDRef.current.textContent = formatBytes(d, 1);
          loadingTRef.current.textContent = formatBytes(t, 1);
        }
      },
    });
  }, [world]);

  return (
    <div className={s.container} ref={canvasRef}>
      {isLoading ? (
        <div className={s.loading_container}>
          <div>Loading...</div>
          <div className={s.loading_bar}>
            <div className={s.loading_percentage} ref={loadingRef}></div>
          </div>
          <div className={s.loading_numbers}>
            <div className={s.loading_numbers_downloaded} ref={loadingDRef}>
              0mb
            </div>
            <div>/</div>
            <div className={s.loading_numbers_total} ref={loadingTRef}>
              0mb
            </div>
          </div>
        </div>
      ) : null}
      <div
        className={s.view_button}
        ref={viewToggleRef}
        style={{
          display:
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            (navigator as any).msMaxTouchPoints > 0
              ? 'flex'
              : 'none',
        }}
        onMouseDown={() => {
          if (
            worldRef.current &&
            worldRef.current.inputManager.onButtonPress()
          ) {
            setCamView(!camView);
          }
        }}
      >
        {camView ? <AiOutlineCamera /> : <AiOutlineUser />}
      </div>
    </div>
  );
};

export default Space;
