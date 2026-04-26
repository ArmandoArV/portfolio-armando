import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Publications from "@/components/Publications";
import Awards from "@/components/Awards";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <main>
        <Experience />
        <Education />
        <Projects />
        <Skills />
        <Publications />
        <Awards />
        <Contact />
      </main>
    </>
  );
}
