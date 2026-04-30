"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SpotlightCursor from "@/components/SpotlightCursor";
import ShootingStarCursor from "@/components/ShootingStarCursor";
import CosmicBackground from "@/components/CosmicBackground";
import AstronautConcierge from "@/components/AstronautConcierge";

const GalaxyExplorer = dynamic(() => import("@/components/GalaxyExplorer"), {
  ssr: false,
});

const FloatingAstronaut = dynamic(
  () => import("@/components/FloatingAstronaut"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <CosmicBackground />
      <SpotlightCursor />
      <ShootingStarCursor />
      <Navbar />
      <Hero />
      <main>
        <GalaxyExplorer />
      </main>
      <AstronautConcierge />
      <FloatingAstronaut />
    </>
  );
}
