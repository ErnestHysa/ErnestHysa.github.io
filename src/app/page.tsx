import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Stats } from "@/components/Stats";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { GitHubGraph } from "@/components/GitHubGraph";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Stats />
        <Projects />
        <Skills />
        <GitHubGraph />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
