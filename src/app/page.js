"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import Menu from "@/components/Menu/Menu";
import Cart from "@/components/Cart/Cart";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <main>
        <Hero />
        <Menu />
      </main>
      <Footer />
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}