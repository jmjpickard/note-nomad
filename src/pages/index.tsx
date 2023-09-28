import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { NavBar } from "../components/Nav/Nav";
import { WelcomeText } from "../components/WelcomeText/WelcomeText";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Note Nomad</title>
        <meta name="description" content="Note app for developers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.container}>
          <WelcomeText />
        </div>
      </main>
    </>
  );
};

export default Home;
