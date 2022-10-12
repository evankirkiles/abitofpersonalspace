/*
 * NavMenu.tsx
 * author: evan kirkiles
 * created on Tue Oct 11 2022
 * 2022 the nobot space,
 */

import { useRouter } from 'next/router';
import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import NavLink from '../NavLink/NavLink';
import s from './NavMenu.module.scss';

type NavMenuProps = {
  toggled?: boolean;
  setToggled: (newToggle: boolean) => void;
};

const NavMenu: React.FC<NavMenuProps> = function NavMenu({
  toggled,
  setToggled,
}) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // this will be used a lot, so let's not redefine everywhere
  const closeMenu = () => setToggled(false);

  return (
    <>
      <CSSTransition appear in={toggled} timeout={300} nodeRef={backdropRef}>
        <div
          className={s.nav_menu_backdrop}
          ref={backdropRef}
          onClick={closeMenu}
        ></div>
      </CSSTransition>
      <CSSTransition appear in={toggled} timeout={300} nodeRef={menuRef}>
        <div className={s.nav_container} ref={menuRef}>
          <div className={s.nav_content}>
            <div className={s.nav_column}>
              <NavLink href="/submit">→ submit</NavLink>
              <NavLink href="/guide">→ guide</NavLink>
              <NavLink href="/about">→ about</NavLink>
              <NavLink href="/credits">→ credits</NavLink>
            </div>
            <div className={s.nav_column_2}>
              <div>Contact:</div>
              <div className={s.contact_info}>
                <a href="mailto:evan.kirkiles@yale.edu">
                  evan.kirkiles@yale.edu
                </a>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    </>
  );
};

export default NavMenu;
