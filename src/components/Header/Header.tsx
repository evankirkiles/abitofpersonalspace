/*
 * Header.tsx
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */
import Link from 'next/link';
import { useState } from 'react';
import Logo from '../Logo/Logo';
import NavLink from '../NavLink/NavLink';
import s from './Header.module.scss';
import Hamburger from 'hamburger-react';
import NavMenu from '../NavMenu/NavMenu';

const Header: React.FC = function Header() {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <>
      <NavMenu toggled={navOpen} setToggled={setNavOpen} />
      <div className={s.container}>
        <div className={s.visible_bar}>
          <Link href="/">
            <div className={s.title_and_logo}>
              <Logo strokeWidth={5} />A Bit of Personal Space.
            </div>
          </Link>
          <div style={{ flex: 1 }}></div>
          <div className={s.links_container}>
            <NavLink href="/submit">submit</NavLink>
            <NavLink href="/guide">guide</NavLink>
            <NavLink href="/about">about</NavLink>
            <NavLink href="/credits">credits</NavLink>
          </div>
          <div className={s.menu} onClick={() => setNavOpen(!navOpen)}>
            <div className={s.menu_text}>{navOpen ? 'CLOSE' : 'MENU'}</div>
            <Hamburger size={20} toggled={navOpen} toggle={setNavOpen} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
