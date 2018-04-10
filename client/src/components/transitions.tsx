import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import '../css/transitions.css';

type FadeProps = {
  key: string;
};
type FadeChildren = {
  children: React.ComponentClass | React.StatelessComponent;
};
type FadeFunc = (children: FadeChildren, props: FadeProps) => void;

export const Fade: FadeFunc = ({ children, ...props }) => (
    <CSSTransition {...props} timeout={300} classNames="fade">
      {children}
    </CSSTransition>
  );
  
export const Fader: FadeFunc = ({ children, ...props }) => (
    <CSSTransition {...props} timeout={300} classNames="fader">
      {children}
    </CSSTransition>
  );