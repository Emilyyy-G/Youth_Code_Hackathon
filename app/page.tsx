import { LandingHero } from "@/components/landing/LandingHero";
import { FloatingActions } from "@/components/landing/FloatingActions";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingHero />
      <FloatingActions />
    </div>
  );
}
