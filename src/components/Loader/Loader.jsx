import { Fragment, useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Loader.scss';

export default function Loader({ iconLoading, iconComplete, loadSeconds, loadWarningSeconds, onLoadComplete, isLoading }) {
  const [countdown, setCountdown] = useState(loadSeconds);
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);
  const waitingRef = useRef(false);
  const radius = 14;
  const strokeWidth = 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  const startTimer = () => {
    waitingRef.current = false;
    setCountdown(loadSeconds);
    setProgress(0);
    setIsActive(false);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        const next = prev - 1;

        if (next > loadWarningSeconds) {
          setProgress(0);
        } else if (next <= loadWarningSeconds && next >= 0) {
          setProgress((next / loadWarningSeconds) * 100);
          setIsActive(true);
        }

        if (next <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          onLoadComplete?.();

          setProgress(0);
          waitingRef.current = true;

          setTimeout(() => {
            if (waitingRef.current) {
              startTimer();
            }
          }, 1000);

          return 0;
        }

        return next;
      });
    }, 1000);
  };

  useEffect(() => {
    isLoading?.(isActive);
  }, [isActive, isLoading]);

  useEffect(() => {
    startTimer();

    return () => {
      clearInterval(timerRef.current);
      waitingRef.current = false;
    };
  }, [loadSeconds, loadWarningSeconds, onLoadComplete]);

  return (
    <Fragment>
      <div className="circle-wrapper">
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle className="track" cx="16" cy="16" r={radius} strokeWidth={strokeWidth} fill="none" transform="rotate(-90 16 16)" />
          <circle
            className="progress"
            cx="16"
            cy="16"
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            fill="none"
            transform="rotate(-90 16 16)"
          />
        </svg>
        <div className="countdown">
          {countdown >= 1 && countdown <= loadWarningSeconds ? (
            <FontAwesomeIcon icon={iconLoading} className="countdown-icon-faded" />
          ) : (
            <FontAwesomeIcon icon={iconComplete} className="countdown-icon" />
          )}
        </div>
      </div>
    </Fragment>
  );
}
