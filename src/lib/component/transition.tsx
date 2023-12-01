import React from 'react';
import Transition, {
  TransitionStatus,
} from 'react-transition-group/Transition';

type TransitionTarget =
  | React.ReactNode
  | ((
      status: TransitionStatus,
      childProps?: Record<string, unknown>,
    ) => React.ReactNode);

interface Timeout {
  appear: number;
  enter: number;
  exit: number;
}

interface TransitionProps<RefElement extends HTMLElement> {
  nodeRef: React.RefObject<RefElement>;
  target: TransitionTarget;
  in?: boolean;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  appear?: boolean;
  enter?: boolean;
  exit?: boolean;
  duration?: number | Partial<Timeout>;
  onEnter?: (node: RefElement, isAppearing: boolean) => void;
  onEntering?: (node: RefElement, isAppearing: boolean) => void;
  onEntered?: (node: RefElement, isAppearing: boolean) => void;
  onExit?: (node: RefElement) => void;
  onExiting?: (node: RefElement) => void;
  onExited?: (node: RefElement) => void;
}

const defaultCollapseDuration = 300;

export interface CollapseProps<RefElement extends HTMLElement>
  extends TransitionProps<RefElement> {}

export const Collapse = <RefElement extends HTMLElement>({
  nodeRef: ref,
  target,
  duration = defaultCollapseDuration,
  onEnter: onEnterProps,
  onEntering: onEnteringProps,
  onEntered: onEnteredProps,
  onExit: onExitProps,
  onExiting: onExitingProps,
  onExited: onExitedProps,
  ...props
}: CollapseProps<RefElement>) => {
  // timeout
  const timeout = toTimeout(duration, defaultCollapseDuration);
  // expanding
  const onEnter = React.useCallback(
    (isAppearing: boolean) => {
      if (ref.current) {
        ref.current.style.display = '';
        ref.current.style.height = '0';
        ref.current.style.overflow = 'hidden';
        onEnterProps?.(ref.current, isAppearing);
      }
    },
    [ref, onEnterProps],
  );
  const onEntering = React.useCallback(
    (isAppearing: boolean) => {
      if (ref.current) {
        const scrollHeight = ref.current.scrollHeight;
        const duration = isAppearing ? timeout.appear : timeout.enter;
        ref.current.style.height = `${scrollHeight}px`;
        ref.current.style.transition = `height ${duration}ms ease`;
        ref.current.style.overflow = 'hidden';
        onEnteringProps?.(ref.current, isAppearing);
      }
    },
    [ref, onEnteringProps, timeout.appear, timeout.enter],
  );
  const onEntered = React.useCallback(
    (isAppearing: boolean) => {
      if (ref.current) {
        ref.current.style.height = '';
        ref.current.style.transition = '';
        ref.current.style.overflow = '';
        onEnteredProps?.(ref.current, isAppearing);
      }
    },
    [ref, onEnteredProps],
  );
  // collapsing
  const onExit = React.useCallback(() => {
    if (ref.current) {
      const scrollHeight = ref.current.scrollHeight;
      ref.current.style.height = `${scrollHeight}px`;
      ref.current.style.overflow = 'hidden';
      onExitProps?.(ref.current);
      // reading a dimension prop will cause the browser to recalculate
      ref.current.scrollHeight;
    }
  }, [ref, onExitProps]);
  const onExiting = React.useCallback(() => {
    if (ref.current) {
      ref.current.style.height = '0';
      ref.current.style.overflow = 'hidden';
      ref.current.style.transition = `height ${timeout.exit}ms ease`;
      onExitingProps?.(ref.current);
    }
  }, [ref, onExitingProps, timeout.exit]);
  const onExited = React.useCallback(() => {
    if (ref.current) {
      ref.current.style.height = '';
      ref.current.style.overflow = '';
      ref.current.style.transition = '';
      ref.current.style.display = 'none';
      onExitedProps?.(ref.current);
    }
  }, [ref, onExitedProps]);
  return (
    <Transition
      {...props}
      nodeRef={ref}
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

const defaultFadeDuration = 300;

export interface FadeProps<RefElement extends HTMLElement>
  extends TransitionProps<RefElement> {}

export const Fade = <RefElement extends HTMLElement>({
  nodeRef: ref,
  target,
  duration = defaultFadeDuration,
  onEnter: onEnterProps,
  onEntering: onEnteringProps,
  onEntered: onEnteredProps,
  onExit: onExitProps,
  onExiting: onExitingProps,
  onExited: onExitedProps,
  ...props
}: FadeProps<RefElement>) => {
  // timeout
  const timeout = toTimeout(duration, defaultFadeDuration);
  // fade-in
  const onEnter = React.useCallback(
    (isAppearing: boolean) => {
      if (ref.current) {
        ref.current.style.opacity = '0';
        onEnterProps?.(ref.current, isAppearing);
        // reading a dimension prop will cause the browser to recalculate
        ref.current.scrollHeight;
      }
    },
    [ref, onEnterProps],
  );
  const onEntering = React.useCallback(
    (isAppearing: boolean) => {
      if (ref.current) {
        const duration = isAppearing ? timeout.appear : timeout.enter;
        ref.current.style.opacity = '';
        ref.current.style.transition = `opacity ${duration}ms ease`;
        onEnteringProps?.(ref.current, isAppearing);
      }
    },
    [ref, onEnteringProps, timeout.appear, timeout.enter],
  );
  const onEntered = React.useCallback(
    (isAppearing: boolean) => {
      if (ref.current) {
        ref.current.style.transition = '';
        onEnteredProps?.(ref.current, isAppearing);
      }
    },
    [ref, onEnteredProps],
  );
  // fade-out
  const onExit = React.useCallback(() => {
    if (ref.current) {
      onExitProps?.(ref.current);
    }
  }, [ref, onExitProps]);
  const onExiting = React.useCallback(() => {
    if (ref.current) {
      ref.current.style.opacity = '0';
      ref.current.style.transition = `opacity ${timeout.exit}ms ease`;
      onExitingProps?.(ref.current);
    }
  }, [ref, onExitingProps, timeout.exit]);
  const onExited = React.useCallback(() => {
    if (ref.current) {
      ref.current.style.opacity = '0';
      ref.current.style.transition = '';
      onExitedProps?.(ref.current);
    }
  }, [ref, onExitedProps]);
  return (
    <Transition
      {...props}
      nodeRef={ref}
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

const toTimeout = (
  duration: number | Partial<Timeout>,
  defaultDuration: number,
): Timeout => {
  if (typeof duration === 'number') {
    return {
      appear: duration,
      enter: duration,
      exit: duration,
    };
  }
  return {
    appear: duration?.appear ?? duration?.enter ?? defaultDuration,
    enter: duration?.enter ?? defaultDuration,
    exit: duration?.exit ?? defaultDuration,
  };
};
