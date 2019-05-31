import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function useCountdown() {
  const [countdown, setCountdown] = React.useState(-1);

  const startCountdown = start => {
    setCountdown(start);
  };

  const stopCountdown = () => {
    setCountdown(-1);
  };

  const id = React.useRef();
  React.useEffect(() => {
    if (countdown > 0) {
      id.current = setInterval(() => {
        setCountdown(countdown - 1);
      }, 100);
    }
    return () => {
      console.log("IHUJ");
      id.current && clearInterval(id.current);
    };
  }, [countdown]);

  return { countdown, startCountdown, stopCountdown };
}

function Action({ on, children }) {
  const { countdown, startCountdown, stopCountdown } = useCountdown();
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const onCountdown = async () => {
      if (countdown === 0) {
        setDone(false);
        await on();
        setDone(true);
        stopCountdown();
      }
    };

    onCountdown();
  }, [countdown, on, setDone, stopCountdown]);

  const handlers = {
    onClick: () => {
      countdown >= 0 ? stopCountdown() : startCountdown(5);
    }
  };

  return children({ countdown, done, handlers });
}

const delay = (ms = 1000) => new Promise(r => setTimeout(r, ms));

function App() {
  const label = (countdown, done) =>
    (() => {
      if (countdown === -1) {
        return "Zapisz";
      }

      if (countdown === 0 && !done) {
        return `...`;
      }

      return `Analuj (${countdown})`;
    })();

  return (
    <div className="App">
      <Action on={() => delay()}>
        {({ handlers, countdown, done }) => (
          <button {...handlers} disabled={countdown === 0 && !done}>
            {label(countdown, done)}
          </button>
        )}
      </Action>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
