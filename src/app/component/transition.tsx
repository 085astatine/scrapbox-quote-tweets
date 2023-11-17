import React from 'react';
import { Transition } from 'react-transition-group';

export interface CollapseProps {
  nodeRef: React.RefObject<HTMLElement>;
  target: React.ReactNode;
  in?: boolean;
  duration?: number | { enter?: number; exit?: number };
}

const defaultCollapseDuration = 300;

export const Collapse: React.FC<CollapseProps> = ({
  nodeRef: ref,
  target,
  in: inProps = false,
  duration = defaultCollapseDuration,
}: CollapseProps) => {
  // timeout
  const timeout =
    typeof duration === 'number'
      ? { enter: duration, exit: duration }
      : {
          ...{ enter: defaultCollapseDuration, exit: defaultCollapseDuration },
          ...duration,
        };
  // expanding
  const onEnter = React.useCallback(() => {
    if (ref.current) {
      ref.current.style.display = '';
      ref.current.style.height = '0';
      ref.current.style.overflow = 'hidden';
    }
  }, [ref]);
  const onEntering = React.useCallback(() => {
    if (ref.current) {
      const scrollHeight = ref.current.scrollHeight;
      ref.current.style.height = `${scrollHeight}px`;
      ref.current.style.transition = `height ${timeout.enter}ms ease`;
      ref.current.style.overflow = 'hidden';
    }
  }, [ref, timeout.enter]);
  const onEntered = React.useCallback(() => {
    if (ref.current) {
      ref.current.style.height = '';
      ref.current.style.transition = '';
      ref.current.style.overflow = '';
    }
  }, [ref]);
  // collapsing
  const onExit = React.useCallback(() => {
    if (ref.current) {
      const scrollHeight = ref.current.scrollHeight;
      ref.current.style.height = `${scrollHeight}px`;
      ref.current.style.overflow = 'hidden';
      // reading a dimension prop will cause the browser to recalculate
      ref.current.scrollHeight;
    }
  }, [ref]);
  const onExiting = React.useCallback(() => {
    if (ref.current) {
      ref.current.style.height = '0';
      ref.current.style.overflow = 'hidden';
      ref.current.style.transition = `height ${timeout.exit}ms ease`;
    }
  }, [ref, timeout.exit]);
  const onExited = React.useCallback(() => {
    if (ref.current) {
      ref.current.style.height = '';
      ref.current.style.overflow = '';
      ref.current.style.transition = '';
      ref.current.style.display = 'none';
    }
  }, [ref]);
  return (
    <Transition
      nodeRef={ref}
      in={inProps}
      timeout={timeout}
      onEnter={onEnter}
      onEntering={onEntering}
      onEntered={onEntered}
      onExit={onExit}
      onExiting={onExiting}
      onExited={onExited}>
      {target}
    </Transition>
  );
};
