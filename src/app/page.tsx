import HeroSection from "@/components/home/HeroSection";
import CodeSection from "@/components/home/CodeSection";
import ProjectsCarousel from "@/components/home/ProjectsCarousel";
import TechPlayground from "@/components/home/TechPlayground";
import FooterReveal from "@/components/home/FooterReveal";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <div className="w-full relative pointer-events-none">
      <div className="relative z-10 w-full bg-background flex flex-col rounded-b-[2rem] md:rounded-b-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] overflow-hidden text-foreground pointer-events-auto">
        <HeroSection />
        {/* Work leads: recruiters decide in the first screens. Horizontal
            carousel — vertical scroll passes straight over it, exploring
            projects sideways is opt-in. */}
        <ProjectsCarousel projects={projects} />
        <CodeSection />
        <TechPlayground />
      </div>
      <FooterReveal />
    </div>
  );
}
