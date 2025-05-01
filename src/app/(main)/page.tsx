// src/app/page.tsx

import Feed from "@/components/Feed";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page of the application",
};

const Home = () => {
  return (
    <>
      <Feed />
    </>
  );
};

export default Home;
