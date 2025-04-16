'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import CountdownTimeType from "@/type/CountdownType";
import { countdownTime } from "@/store/countdownTime";

// Dynamically import modals
const ModalCart = dynamic(() => import('./ModalCart'), { ssr: false });
const ModalWishlist = dynamic(() => import('./ModalWishlist'), { ssr: false });
const ModalQuickview = dynamic(() => import('./ModalQuickview'), { ssr: false });
const ModalCompare = dynamic(() => import('./ModalCompare'), { ssr: false });

const ModalContainer = () => {
  const [serverTimeLeft, setServerTimeLeft] = useState<CountdownTimeType | null>(null);

  useEffect(() => {
    // Safely call countdownTime on client
    setServerTimeLeft(countdownTime());
  }, []);

  return (
    <>
      {serverTimeLeft && <ModalCart serverTimeLeft={serverTimeLeft} />}
      <ModalWishlist />
      <ModalQuickview />
      <ModalCompare />
    </>
  );
};

export default ModalContainer;
