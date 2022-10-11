/*
 * Space.tsx
 * author: evan kirkiles
 * created on Tue Oct 11 2022
 * 2022 the nobot space,
 */
import { useEffect, useRef } from 'react';
import * as APIt from '../../supabase/types';
import { World } from './game/world/World';
import s from './Space.module.scss';

type SpaceProps = {
  world: string;
};

const Space: React.FC<SpaceProps> = function Space({ world }) {
  // connect canvas to game
  const canvasRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<World | null>(null);

  // initialize the world immediately
  useEffect(() => {
    // if there is a world, destroy it
    if (worldRef.current) {
      worldRef.current.destroy();
    }
    // now rebuild it with the better world
    worldRef.current = new World(canvasRef.current!, world);
  }, [world]);

  return <div className={s.container} ref={canvasRef} />;
};

export default Space;
