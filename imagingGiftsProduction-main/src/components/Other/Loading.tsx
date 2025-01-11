"use client";
import React, { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const Loading: React.FC = () => {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return null; // NProgress renders the loader on the page itself
};

export default Loading;
