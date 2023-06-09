import { useContext, useEffect, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/Banner";
import Card from "@/components/Card";

import coffeeStoresData from "../data/coffee-stores.json";
import { getCoffeeStores } from "@/lib/coffee-stores";
import useTrackLocation from "@/hooks/useTrackLocation";
import { ACTION_TYPES, StoreContext } from "../store/storeContext";

const inter = Inter({ subsets: ["latin"] });

export default function Home(props) {
  const [coffeeStoresError, setCoffeeStoresError] = useState("");
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const { dispatch, state } = useContext(StoreContext);

  const { coffeeStores, latLng } = state;

  useEffect(() => {
    const fetchCoffeeStores = async () => {
      if (latLng) {
        try {
          const res = await fetch(`/api/getCoffeeStoresByLocation?latLng=${latLng}&limit=30`);
          const coffeeStores = await res.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores
            }
          });
          setCoffeeStoresError("");
        } catch (error) {
          console.error(error);
          setCoffeeStoresError(error.message);
        }
      }
    };
    fetchCoffeeStores();
  }, [latLng]);

  const handleOnBannerButtonClick = () => {
    handleTrackLocation();
  };

  return (
    <>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="allows you to discover coffee stores" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnBannerButtonClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image alt="hero image" src="/static/hero-image.png" width={700} height={400} />
        </div>
        {coffeeStores.length ? (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((store, i) => (
                <Card
                  key={i}
                  name={store.name}
                  imgUrl={
                    store.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${store.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        ) : <h2 className={styles.heading2}>No coffee stores nearby</h2>}

        {props.coffeeStores.length && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Detroit Stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((store, i) => (
                <Card
                  key={i}
                  name={store.name}
                  imgUrl={
                    store.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${store.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export async function getStaticProps(context) {
  const coffeeStores = await getCoffeeStores();

  return {
    props: {
      coffeeStores,
    },
  };
}
