/*
 * Modal.tsx
 * author: evan kirkiles
 * created on Sun Nov 27 2022
 * 2022 the nobot space,
 */
import s from './Modal.module.scss';
import Draggable from 'react-draggable';
import { CSSTransition } from 'react-transition-group';
import { HTMLAttributes, useRef, useState } from 'react';

type ModalProps = {
  on: boolean;
  setOn: (onVal: boolean) => void;
  title: string;
  children?: React.ReactNode;
  style?: HTMLAttributes<HTMLDivElement>['style'];
};

const Modal: React.FC<ModalProps> = function Modal({
  on,
  setOn,
  title,
  children,
  style,
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  return (
    <CSSTransition
      appear
      nodeRef={modalRef}
      timeout={100}
      in={on}
      mountOnEnter
      unmountOnExit
    >
      <Draggable
        handle={`.${s.modal_handle}`}
        nodeRef={modalRef}
        bounds={'parent'}
      >
        <div className={s.modal} ref={modalRef} style={style}>
          <div className={s.modal_handle}>
            <div className={s.close_button} onClick={() => setOn(!on)}>
              X
            </div>
            {title}
          </div>
          <div className={s.modal_contents}>{children}</div>
        </div>
      </Draggable>
    </CSSTransition>
  );
};

export default Modal;
