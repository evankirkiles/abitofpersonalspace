/*
 * Header.tsx
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */
import { useEffect, useState } from 'react';
import Logo from '../Logo/Logo';
import s from './Header.module.scss';

const Header: React.FC = function Header() {
  return (
    <div className={s.container}>
      <div className={s.visible_bar}>
        <div>{'<- '}about</div>
        <Logo strokeWidth={5} />
        <div>credits{' ->'}</div>
      </div>
    </div>
  );
};

export default Header;
