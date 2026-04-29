import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { readSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/siteSettingsStore.server";

export async function Footer() {
    const settings = await readSiteSettings();
    const { addressLine, phone, email } = settings.contact;
    const { instagram, facebook, linkedin } = settings.social;
    const { description, logoUrl } = settings.footer || DEFAULT_SITE_SETTINGS.footer!;

    return (
        <footer className="bg-primary text-primary-foreground pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="inline-flex">
                            <Image
                                src={logoUrl || "/daricraft-logo.svg"}
                                alt="DariCraft"
                                width={260}
                                height={70}
                                unoptimized
                                className="h-12 w-auto"
                            />
                        </div>
                        <p className="text-primary-foreground/80 text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-secondary">Explorer</h4>
                        <ul className="space-y-2 text-sm text-primary-foreground/80">
                            <li><Link href="/mobilier" className="hover:text-white">Mobilier</Link></li>
                            <li><Link href="/decoration" className="hover:text-white">Décoration</Link></li>
                            <li><Link href="/sur-mesure" className="hover:text-white">Sur Mesure</Link></li>
                            <li><Link href="/projets" className="hover:text-white">Nos Réalisations</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-secondary">Nous Contacter</h4>
                        <ul className="space-y-3 text-sm text-primary-foreground/80">
                            <li className="flex items-center gap-3">
                                <MapPin size={18} className="text-secondary" />
                                <span>{addressLine}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-secondary" />
                                <a className="hover:text-white" href={`tel:${phone.replace(/\s/g, "")}`}>
                                    {phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-secondary" />
                                <a className="hover:text-white" href={`mailto:${email}`}>
                                    {email}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-secondary">Suivez-nous</h4>
                        <div className="flex space-x-4">
                            <a
                                href={instagram || "#"}
                                target={instagram ? "_blank" : undefined}
                                rel={instagram ? "noreferrer" : undefined}
                                aria-disabled={!instagram}
                                className={`p-2 bg-white/10 rounded-full hover:bg-secondary hover:text-primary transition-colors ${!instagram ? "opacity-50 pointer-events-none" : ""}`}
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href={facebook || "#"}
                                target={facebook ? "_blank" : undefined}
                                rel={facebook ? "noreferrer" : undefined}
                                aria-disabled={!facebook}
                                className={`p-2 bg-white/10 rounded-full hover:bg-secondary hover:text-primary transition-colors ${!facebook ? "opacity-50 pointer-events-none" : ""}`}
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href={linkedin || "#"}
                                target={linkedin ? "_blank" : undefined}
                                rel={linkedin ? "noreferrer" : undefined}
                                aria-disabled={!linkedin}
                                className={`p-2 bg-white/10 rounded-full hover:bg-secondary hover:text-primary transition-colors ${!linkedin ? "opacity-50 pointer-events-none" : ""}`}
                            >
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
                    <p>© {new Date().getFullYear()} DariCraft. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
