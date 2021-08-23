import React, { useRef, FC, useEffect, useState } from "react";
import { XTerm } from "xterm-for-react";
import { FitAddon } from 'xterm-addon-fit';

interface IState {
  input: string;
}

interface IProps {}

const Term: FC<IProps> = () => {
  const xTermRef = useRef<XTerm | null>(null);
  const terminalHostname = `$root@max~ `;
  const [terminalText, setTerminalText] = useState("");
  const fitAddon = new FitAddon();


  useEffect(() => {
    // prettier-ignore
    xTermRef.current?.terminal.write(terminalHostname);
    (xTermRef.current as any).props.addons.shift().fit();
  }, [terminalHostname]);

  const onData = (data: any) => {
    const xterm = xTermRef.current;
    const code = data.charCodeAt(0);

    if (xterm === null || terminalText.length < 0) return;

    //  clear command
    if (terminalText === "clear" || terminalText === "cls") {
      xterm.terminal.reset();
      setTerminalText("");
      xterm.terminal.write(terminalHostname);
      return false;
    }

    switch (code) {
      case 12:
        // CTRL + L (Clear Terminal)
        xterm.terminal.reset();
        setTerminalText("");
        xterm.terminal.write(terminalHostname);
        break;

      case 13:
        // Enter key
        console.log(terminalText);
        xterm.terminal.write(`\r\n${terminalHostname}`);
        setTerminalText("");
        break;

      case 27:
        // Filter up and down arrow press
        if (data.endsWith("A") || data.endsWith("B")) return;

        // Write to terminal on left and right arrow press
        xterm.terminal.write(data);
        setTerminalText((prevState) => prevState + data);
        break;

      case 127:
        // Backspace
        if (terminalText) {
          xterm.terminal.write("\b \b");
          setTerminalText((prevState) =>
            prevState.substring(0, prevState.length - 1)
          );
        }
        break;

      default:
        // General keys
        xterm.terminal.write(data);
        setTerminalText((prevState) => prevState + data);
    }
  };

  return (
    <XTerm
      ref={xTermRef}
      addons={[fitAddon]}
      onData={onData}
      options={{
        theme: {
          background: "#131313",
          cursor: "#00FF00",
          foreground: "#00FF00",
        },
      }}
    />
  );
};
export default Term;
