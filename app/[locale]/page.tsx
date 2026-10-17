import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ThingsIveDone } from "@/components/ThingsIveDone";
import { ThingsIveBuild } from "@/components/ThingsIveBuild";
import { Projects } from "@/components/Projects";
import { TechStack } from "@/components/TechStack";
import { Certifications } from "@/components/Certifications";
import { FavPosts } from "@/components/FavPosts";
import { Contact } from "@/components/Contact";
import { PixelSceneBackground } from "@/components/PixelScene";
import { Footer } from "@/components/Footer";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ThingsIveDone />
      <Projects />
      <TechStack />
      <ThingsIveBuild />
      <Certifications />
      <FavPosts />

      {/* 8-bit Pixel Scene as background for Contact + Footer */}
      <PixelSceneBackground>
        <Contact />
        <Footer />
      </PixelSceneBackground>
    </main>
  );
}
