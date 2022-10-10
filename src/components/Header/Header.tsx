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
        <Link href="/">
          <div className={s.title_and_logo}>
            <Logo strokeWidth={5} />A Bit of Personal Space.
          </div>
        </Link>
        <div style={{ flex: 1 }}></div>
        <Link href="/submit">
          <div>submit</div>
        </Link>
        <Link href="/about">
          <div>about</div>
        </Link>
        <Link href="/credits">
          <div>credits</div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
