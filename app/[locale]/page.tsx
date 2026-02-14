import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ThingsIveDone } from "@/components/ThingsIveDone";
import { ThingsIveBuild } from "@/components/ThingsIveBuild";
import { Projects } from "@/components/Projects";
import { TechILove } from "@/components/TechILove";
import { FavPosts } from "@/components/FavPosts";
import { Activities } from "@/components/Activities";
import { Contact } from "@/components/Contact";
import { PixelSceneBackground } from "@/components/PixelScene";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ThingsIveDone />
      <ThingsIveBuild />
      <Projects />
      <TechILove />
      <FavPosts />
      <Activities />

      {/* 8-bit Pixel Scene as background for Contact + Footer */}
      <PixelSceneBackground>
        <Contact />
        <Footer />
      </PixelSceneBackground>
    </main>
  );
}
