import React from "react";
import { DaysProps } from "./Calendar";
import styles from "./newCalendar.module.css";
import clx from "classnames";

interface DayArgs {
  day: DaysProps;
  topRow: boolean;
  onClick: (day: DaysProps) => void;
}

export const Day: React.FC<DayArgs> = ({ day, topRow, onClick }: DayArgs) => {
  return (
    <div
      key={day.date}
      className={clx(styles.day, {
        [styles.topRow as string]: topRow,
        [styles.selected as string]: day.selected,
      })}
      onClick={() => onClick(day)}
    >
      <div className={styles.dayNumber}>{day.day}</div>
    </div>
  );
};
