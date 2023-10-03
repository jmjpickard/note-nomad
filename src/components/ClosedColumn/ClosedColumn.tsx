import React from "react";
import styles from "./closedColumn.module.css";

interface Props {
  title: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ClosedColumn: React.FC<Props> = ({ title, setOpen }: Props) => {
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.arrow} onClick={() => setOpen(true)}>
          {">"}
        </div>
        <div className={styles.text}>{title}</div>
      </div>
    </div>
  );
};
