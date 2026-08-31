import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { PanelProvider } from "@/context/PanelContext";
import { SharedVideoProvider } from "@/context/SharedVideoContext";
import GlobalPanel from "@/components/SlidePanel/GlobalPanel";
import TitleRotator from "@/components/TitleRotator";
import FontStyles from "@/components/FontStyles";
import Navigation from "@/components/Navigation";
import InViewObserver from "@/components/InViewObserver";
import basePath from "@/lib/basePath";

export const metadata: Metadata = {
  title: {
    default: "MAE — Fysiotherapie & Leefstijlcoaching",
    template: "%s | MAE",
  },
  description: "MAE combineert fysiotherapie en leefstijlcoaching voor duurzaam herstel en een gezondere levensstijl. Persoonlijke begeleiding door Maarten (fysio) en Merel (leefstijlcoach).",
  keywords: ["fysiotherapie", "leefstijlcoaching", "personal coaching", "revalidatie", "krachttraining", "MAE", "Move Adapt Evolve"],
  authors: [{ name: "MAE — Move Adapt Evolve" }],
  metadataBase: new URL("https://moveadaptevolve.nl"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://moveadaptevolve.nl",
    siteName: "MAE — Move Adapt Evolve",
    title: "MAE — Fysiotherapie & Leefstijlcoaching",
    description: "Persoonlijke fysiotherapie en leefstijlcoaching. Duurzaam herstel en een gezondere levensstijl met Maarten en Merel.",
    images: [
      {
        url: "https://HAL13xMAE.b-cdn.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MAE — Move Adapt Evolve",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAE — Fysiotherapie & Leefstijlcoaching",
    description: "Persoonlijke fysiotherapie en leefstijlcoaching. Duurzaam herstel en een gezondere levensstijl.",
    images: ["https://HAL13xMAE.b-cdn.net/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#272727" />
        <link rel="preconnect" href="https://HAL13xMAE.b-cdn.net" />
        {/* Above-the-fold text: the hero loader and every body copy style. */}
        <link rel="preload" href={`${basePath}/fonts/HelveticaNeueLight.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={`${basePath}/fonts/CHANEY-Regular.otf`} as="font" type="font/otf" crossOrigin="anonymous" />
        {/* Warms the cache for the hero video without competing with the fonts. */}
        <link rel="preload" href="https://HAL13xMAE.b-cdn.net/hero.mp4" as="video" type="video/mp4" crossOrigin="anonymous" fetchPriority="low" />
        <FontStyles />
        <Script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.3/dist/dotlottie-wc.js" type="module" crossOrigin="anonymous" strategy="lazyOnload" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["HealthAndBeautyBusiness", "Physiotherapist"],
              name: "MAE — Move Adapt Evolve",
              description: "Fysiotherapie en leefstijlcoaching. Persoonlijke begeleiding voor duurzaam herstel en een gezondere levensstijl.",
              url: "https://moveadaptevolve.nl",
              logo: "https://HAL13xMAE.b-cdn.net/og-image.jpg",
              email: "info@moveadaptevolve.nl",
              telephone: "+31614955827",
              priceRange: "€€",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Waalbroek 3",
                addressLocality: "Simpelveld",
                postalCode: "6369 TE",
                addressCountry: "NL",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 50.8344,
                longitude: 5.9822,
              },
              sameAs: [
                "https://www.instagram.com/m.a.e.coaching.fysiotherapie/",
                "https://www.tiktok.com/@maecoaching",
              ],
              knowsAbout: ["Fysiotherapie", "Leefstijlcoaching", "Revalidatie", "Krachttraining", "Personal coaching"],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Hoe kan ik een afspraak maken?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Je kunt direct een afspraak inplannen via onze website of contact opnemen via WhatsApp. Een verwijzing is niet nodig — voor zowel fysiotherapie als leefstijlcoaching kun je zelf rechtstreeks terecht bij MAE.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Wat kan ik verwachten bij mijn eerste bezoek?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We beginnen altijd met een uitgebreide intake van 60 minuten. Hierin bespreken we je klachten, doelen en situatie. Op basis daarvan stellen we samen een persoonlijk plan op dat aansluit bij wat jij nodig hebt.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Voor wie is MAE geschikt?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Voor iedereen. Of je nu herstellende bent van een blessure, meer wilt bewegen, gezonder wilt leven of topsport bedrijft. Ons aanbod is volledig afgestemd op jouw niveau en doelen.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Wat kost een behandeling en wordt het vergoed?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Intake (prestatiecode 1864): €55 btw-vrij. Behandeling (prestatiecode 1000): €45 btw-vrij. Wij werken zonder contracten met zorgverzekeraars zodat we volledige vrijheid hebben in onze aanpak. Je kunt facturen met deze prestatiecodes mogelijk indienen bij je zorgverzekeraar voor een (gedeeltelijke) vergoeding vanuit je aanvullende verzekering.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Kan ik fysiotherapie en leefstijlcoaching combineren?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Zeker. Sterker nog, de combinatie versterkt je resultaat. We stemmen beide trajecten op elkaar af zodat je lichaam én leefstijl samen vooruitgaan.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <TitleRotator />
        <SharedVideoProvider>
          <PanelProvider>
            <SmoothScroll>
              <Navigation />
              <InViewObserver />
              {children}
              <GlobalPanel />
            </SmoothScroll>
          </PanelProvider>
        </SharedVideoProvider>
      </body>
    </html>
  );
}
