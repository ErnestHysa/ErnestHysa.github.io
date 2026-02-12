import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Stats } from "@/components/Stats";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { GitHubGraph } from "@/components/GitHubGraph";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { AuroraBackground } from "@/components/AuroraBackground";
import { ScrollProgress } from "@/components/ScrollProgress";
import { PageEffects } from "@/components/PageEffects";
import { GravityPlayground } from "@/components/GravityPlayground";
import { MusicToggle } from "@/components/MusicToggle";
import { AudioVignette } from "@/components/AudioVignette";
import { BeaglePet } from "@/components/BeaglePet";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

async function getGitHubContributions(): Promise<ContributionDay[] | null> {
  try {
    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/ErnestHysa?y=last",
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.contributions;
  } catch {
    return null;
  }
}

export default async function Home() {
  const contributions = await getGitHubContributions();

  return (
    <>
      <PageEffects />
      <GravityPlayground />
      <MusicToggle />
      <AudioVignette />
      <BeaglePet />
      <CustomCursor />
      <AuroraBackground />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Stats />
        <Projects />
        <Skills />
        <GitHubGraph contributions={contributions} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
