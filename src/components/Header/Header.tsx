/*
 * Header.tsx
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logo from '../Logo/Logo';
import s from './Header.module.scss';

const Header: React.FC = function Header() {
  return (
    <div className={s.container}>
      <div className={s.visible_bar}>
        <Link href="/about">
          <div>{'<- '}about</div>
        </Link>
        <Logo strokeWidth={5} />
        <Link href="/credits">
          <div>credits{' ->'}</div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
