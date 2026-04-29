import { Hero } from "@/components/home/Hero";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DariCraft | Design & Artisanat",
  description: "Création de mobilier sur mesure et décoration unique. L'esprit du design, le savoir-faire artisanal en Algérie.",
};

export default function Home() {
  return (
    <>
      <Hero />

      {/* Categories Preview Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Nos Univers</h2>
            <div className="w-24 h-1 bg-secondary mx-auto" />
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Explorez nos collections conçues pour sublimer chaque espace de votre intérieur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Mobilier", image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1000", href: "/mobilier" },
              { title: "Décoration", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000", href: "/decoration" },
              { title: "Cuisine domestique", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000", href: "/cuisine-domestique" },
              { title: "Sur Mesure", image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=1000", href: "/sur-mesure" }
            ].map((cat, idx) => (
              <Link key={idx} href={cat.href} className="group relative h-[320px] sm:h-[380px] md:h-[400px] overflow-hidden rounded-lg shadow-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-3xl font-bold text-white uppercase tracking-wider border-2 border-white/0 group-hover:border-white/100 px-6 py-3 transition-all duration-300">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Un projet unique ?</h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Nous réalisons vos rêves d'aménagement. Du dessin à la pose, confiez-nous votre projet sur mesure.
          </p>
          <Link
            href="/devis"
            className="inline-block px-10 py-4 bg-secondary text-secondary-foreground font-bold rounded-full hover:bg-white hover:text-primary transition-colors text-lg"
          >
            Parlez-nous de votre projet
          </Link>
        </div>
      </section>
    </>
  );
}
