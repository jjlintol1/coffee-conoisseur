import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState, useEffect } from "react";

import useSWR from "swr";

import classNames from "classnames";

import styles from "../../styles/coffee-store.module.css";

import coffeeStoresData from "../../data/coffee-stores.json";
import Image from "next/image";
import { getCoffeeStores } from "@/lib/coffee-stores";
import { StoreContext } from "../../store/storeContext";
import { isEmpty } from "@/utils";
import { fetcher } from "@/lib/fetcher";

const CoffeeStore = (initialProps) => {
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const [votingCount, setVotingCount] = useState(0);
  
  const router = useRouter();
  const { id } = router.query;
  
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);
  
  

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting)
    }
  }, [data]);

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((store) => {
          return store.id.toString() === id;
        });
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);
  
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }



  const { address, dma, name, imgUrl } = coffeeStore;




  if (error) {
    return <div>Something went wrong</div>
  }
  


  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, voting, imgUrl, dma } = coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          address: address || "",
          imgUrl,
          dma: dma || "",
        }),
      });
      const dbCoffeeStore = await response.json();
    } catch (error) {
      console.error(error);
    }
  };


  const handleUpvoteButton = async () => {
    try {
      const { id, name, voting, imgUrl, dma } = coffeeStore;
      const response = await fetch("/api/favoriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id
        }),
      });
      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to Home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            alt="banner image"
            width={600}
            height={360}
            className={styles.storeImg}
          />
        </div>
        <div className={classNames("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
             <Image alt="places icon" src="/static/icons/places.svg" width="24" height="24" />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image alt="near me icon" src="/static/icons/nearMe.svg" width="24" height="24" />
            <p className={styles.text}>{dma}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image alt="star icon" src="/static/icons/star.svg" width="24" height="24" />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Upvote
          </button>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps({ params }) {
  const coffeeStores = await getCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((store) => {
    return store.id.toString() === params.id;
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await getCoffeeStores();
  const paths = coffeeStores.map((store) => ({
    params: {
      id: store.id.toString(),
    },
  }));
  return {
    paths,
    fallback: true,
  };
}

export default CoffeeStore;
