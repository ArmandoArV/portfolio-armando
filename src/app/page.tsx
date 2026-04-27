import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Publications from "@/components/Publications";
import Awards from "@/components/Awards";
import Contact from "@/components/Contact";
import SpotlightCursor from "@/components/SpotlightCursor";
import ShootingStarCursor from "@/components/ShootingStarCursor";
import ScrollProgress from "@/components/ScrollProgress";
import CosmicBackground from "@/components/CosmicBackground";
import RocketToTop from "@/components/RocketToTop";
import NebulaDivider from "@/components/NebulaDivider";

export default function Home() {
  return (
    <>
      <CosmicBackground />
      <SpotlightCursor />
      <ShootingStarCursor />
      <ScrollProgress />
      <RocketToTop />
      <Navbar />
      <Hero />
      <main>
        <NebulaDivider variant="blue" />
        <Experience />
        <NebulaDivider variant="purple" />
        <Education />
        <NebulaDivider variant="teal" />
        <Projects />
        <NebulaDivider variant="blue" />
        <Skills />
        <NebulaDivider variant="purple" />
        <Publications />
        <NebulaDivider variant="teal" />
        <Awards />
        <NebulaDivider variant="blue" />
        <Contact />
      </main>
    </>
  );
}
