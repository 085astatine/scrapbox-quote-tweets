import React from 'react';
import { Transition } from 'react-transition-group';

export interface CollapseProps {
  in?: boolean;
  duration?: number | { enter?: number; exit?: number };
}

const defaultCollapseDuration = 300;

export const Collapse: React.FC<CollapseProps> = ({
  in: inProps = false,
  duration = defaultCollapseDuration,
}: CollapseProps) => {
  // ref
  const ref = React.useRef<HTMLDivElement>(null);
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
  }, []);
  const onEntering = React.useCallback(() => {
    if (ref.current) {
      const scrollHeight = ref.current.scrollHeight;
      ref.current.style.height = `${scrollHeight}px`;
      ref.current.style.transition = `height ${timeout.enter}ms ease`;
      ref.current.style.overflow = 'hidden';
    }
  }, [timeout.enter]);
  const onEntered = React.useCallback(() => {
    if (ref.current) {
      ref.current.style.height = '';
      ref.current.style.transition = '';
      ref.current.style.overflow = '';
    }
  }, []);
  // collapsing
  const onExit = React.useCallback(() => {
    if (ref.current) {
      const scrollHeight = ref.current.scrollHeight;
      ref.current.style.height = `${scrollHeight}px`;
      ref.current.style.overflow = 'hidden';
      // reading a dimension prop will cause the browser to recalculate
      ref.current.scrollHeight;
    }
  }, []);
  const onExiting = React.useCallback(() => {
    if (ref.current) {
      ref.current.style.height = '0';
      ref.current.style.overflow = 'hidden';
      ref.current.style.transition = `height ${timeout.exit}ms ease`;
    }
  }, [timeout.exit]);
  const onExited = React.useCallback(() => {
    if (ref.current) {
      ref.current.style.height = '';
      ref.current.style.overflow = '';
      ref.current.style.transition = '';
      ref.current.style.display = 'none';
    }
  }, []);
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
      <div ref={ref}>
        {[...Array(10).keys()].reverse().map((i) => (
          <React.Fragment key={i}>
            {'a'.repeat(i + 1)}
            <br />
          </React.Fragment>
        ))}
      </div>
    </Transition>
  );
};
