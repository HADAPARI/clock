import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

const App = () => {
  interface DateParams {
    hours: string;
    minutes: string;
    seconds: string;
    day: string;
    month: string;
    dayNumber: string;
    year: string;
    period: string;
  }

  const [showFormatMenu, setShowFormatMenu] = useState<boolean>(false);
  const format = useRef<number>(12);
  const [dateParams, setDateParams] = useState<DateParams>({
    hours: "00",
    minutes: "00",
    seconds: "00",
    day: "Day",
    month: "Month",
    dayNumber: "00",
    year: "00",
    period: "AM",
  });

  const hour = useRef();
  const min = useRef();
  const sec = useRef();

  const normalizeNumber = (number: number) => {
    return number > 9 ? number.toString() : "0" + number;
  };

  const normalizeHours = (number: number) => {
    if (format.current == 12) {
      return number <= 12 ? number : number % 12;
    }
    return number;
  };

  const handleChangeFormat = () => {
    format.current = format.current == 12 ? 24 : 12;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCloseFormatMenu = (e: any) => {
    const className: string = e.target.className;
    if (!className.includes(" format-menu")) {
      setShowFormatMenu(false);
    }
  };

  const clock = () => {
    const deg = 6;
    const today = new Date();
    const hh = today.getHours() * 30;
    const mm = today.getMinutes() * deg;
    const ss = today.getSeconds() * deg;

    hour.current.style.transform = `rotateZ(${hh + mm / 12}deg)`;
    min.current.style.transform = `rotateZ(${mm}deg)`;
    sec.current.style.transform = `rotateZ(${ss}deg)`;

    setDateParams({
      hours: normalizeNumber(normalizeHours(today.getHours())),
      minutes: normalizeNumber(today.getMinutes()),
      seconds: normalizeNumber(today.getSeconds()),
      day: today.toLocaleString("default", { weekday: "long" }),
      month: today.toLocaleString("default", { month: "short" }),
      dayNumber: normalizeNumber(today.getDate()),
      year: today.getFullYear().toString(),
      period: today.getHours() < 12 ? "AM" : "PM",
    });
  };

  useEffect(() => {
    const id = setInterval(() => {
      clock();
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div
      className="h-screen w-screen text-white flex flex-col lg:flex-row"
      onClick={(e) => handleCloseFormatMenu(e)}
    >
      <div className="left-pane bg-slate-900 lg:size-1/2 min-h-screen flex justify-center items-center">
        <div className="digital-clock-container relative flex justify-center items-center">
          <div className="digital-clock bg-slate-800 absolute shadow shadow-slate-800 rounded-md p-5 flex flex-col items-center gap-5">
            <div className="params flex justify-end relative w-full format-menu">
              <div
                className={`w-40 bg-slate-700 transition-all  rounded-md shadow-md shadow-slate-800 absolute mr-5 flex justify-between items-center ${
                  showFormatMenu ? `h-12 p-3` : `h-0 p-0 overflow-hidden`
                }  format-menu`}
              >
                Format 24h
                <div
                  className={`format-switch w-8 h-4 rounded-lg flex cursor-pointer ${
                    format.current == 12 ? `bg-slate-500` : `bg-white active`
                  }  format-menu`}
                  onClick={handleChangeFormat}
                ></div>
              </div>
              <div
                className="cursor-pointer transition-all hover:bg-slate-600 w-5 h-5 rounded-full flex justify-center items-center  format-menu"
                onClick={() => setShowFormatMenu((prev) => !prev)}
              >
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className=" format-menu"
                />
              </div>
            </div>
            <div className="clock flex justify-between">
              <div className="w-96">
                <div className="flex">
                  <div className="hours text-9xl w-44 flex justify-end">
                    {dateParams.hours}
                  </div>
                  <div className="dots  text-8xl flex items-center text-slate-400 px-1">
                    :
                  </div>
                  <div className="minutes text-9xl w-44 flex justify-start">
                    {dateParams.minutes}
                  </div>
                </div>
                <div className="calendar flex justify-center gap-2 text-xl">
                  <div className="day">{dateParams.day}</div>
                  <div className="day-number">{dateParams.dayNumber}</div>
                  <div className="month">{dateParams.month}</div>
                  <div className="year">{dateParams.year}</div>
                </div>
              </div>
              <div className="flex flex-col justify-end gap-16 pt-1 pb-8 mr-5 text-xl w-10">
                <div
                  className={`period ${format.current == 24 ? `hidden` : ``}`}
                >
                  {dateParams.period}
                </div>
                <div className="seconds">{dateParams.seconds}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="separator min-h-1 lg:w-1 lg:h-screen rounded-md"></div>
      <div className="right-pane lg:size-1/2 min-h-screen flex justify-center items-center">
        <div className="analog-clock w-96 h-96 rounded-full flex justify-center items-center">
          <div className="clock-surface rounded-full relative flex justify-center items-center">
            <div
              ref={hour}
              className="hour w-full h-full absolute flex justify-center items-center"
            ></div>
            <div
              ref={min}
              className="min w-full h-full absolute flex justify-center items-center"
            ></div>
            <div
              ref={sec}
              className="sec w-full h-full absolute flex justify-center items-center"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
