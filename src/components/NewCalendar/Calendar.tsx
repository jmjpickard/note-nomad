import moment from "moment";
import React, { useEffect, useState } from "react";
import { Day } from "./Day";
import styles from "./newCalendar.module.css";

export interface DaysProps {
  day: string;
  date: string;
  selected: boolean;
}

interface CalendarProps {
  onEventClick: (day: DaysProps) => void;
  selectedDay: Date;
}

const buildDays = (
  dayDiff: number,
  firstMondayWeekOfMonth: moment.Moment,
  selectedDay: Date
) => {
  let days: DaysProps[] = [];
  for (let x = 0; x <= dayDiff; x++) {
    const currentDate = moment(firstMondayWeekOfMonth).add(x, "days");
    days = [
      ...days,
      {
        day: currentDate.format("DD"),
        date: currentDate.format("YYYY-MM-DD hh:mm"),
        selected:
          moment(selectedDay).format("YYYY-MM-DD") ===
          currentDate.format("YYYY-MM-DD"),
      },
    ];
  }
  return days;
};

export const SideCalendar: React.FC<CalendarProps> = ({
  onEventClick,
  selectedDay,
}) => {
  const today = moment();
  const [date, setDate] = useState(today);

  const [firstDayOfMonth, setFirstDayOfMonth] = useState(
    moment().startOf("month")
  );
  const [lastDayOfMonth, setLastDayOfMonth] = useState(today.endOf("month"));

  const [dayDiff, setDayDiff] = useState(
    lastDayOfMonth.diff(firstDayOfMonth, "days")
  );
  const [days, setDays] = useState<DaysProps[]>(
    buildDays(dayDiff, firstDayOfMonth, selectedDay)
  );

  useEffect(() => {
    setDays(buildDays(dayDiff, firstDayOfMonth, selectedDay));
  }, [dayDiff, firstDayOfMonth]);

  const handleArrowClick = (isForward: boolean) => {
    const newDate = isForward
      ? date.add(1, "month")
      : date.subtract(1, "month");
    const firstOfMonth = moment(newDate).startOf("month");
    const lastDay = moment(newDate).endOf("month");
    const diff = moment(lastDay).diff(moment(firstOfMonth), "days");

    setDate(newDate);
    setFirstDayOfMonth(firstOfMonth);
    setLastDayOfMonth(lastDay);
    setDayDiff(diff);
    setDays(buildDays(diff, firstOfMonth, selectedDay));
  };

  const handleDayClick = (day: DaysProps) => {
    onEventClick(day);

    setDays(
      days.map((d) => {
        if (d.date === day.date) {
          return { ...d, selected: true };
        }
        return { ...d, selected: false };
      })
    );
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.topDisplay}>
        <div>{firstDayOfMonth.format("MMM YYYY")}</div>
        <div className={styles.arrowContainer}>
          <div
            onClick={() => {
              handleArrowClick(false);
            }}
            className={styles.arrow}
          >
            &#x2190;
          </div>
          <div
            onClick={() => {
              handleArrowClick(true);
            }}
            className={styles.arrow}
          >
            &#x2192;
          </div>
        </div>
      </div>
      <div className={styles.dayContainer}>
        {days.map((day, idx) => {
          return (
            <React.Fragment key={idx}>
              <Day
                day={day}
                topRow={idx < 7}
                onClick={(day) => handleDayClick(day)}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
