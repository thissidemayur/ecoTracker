import type React from "react";
import type { Metadata } from "next";
// import { Geist, Geist_Mono, IBM_Plex_Mono } from "next/font/google";
// import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth-provider";

// const _geist = Geist({ subsets: ["latin"] });
// const _geistMono = Geist_Mono({ subsets: ["latin"] });
// const _ibmPlexMono = IBM_Plex_Mono({
//   weight: ["400", "500", "600", "700"],
//   subsets: ["latin"],
//   variable: "--font-ibm-plex-mono",
// });





export const metadata: Metadata = {
  metadataBase: new URL("https://ecotrack.thissidemayur.me"),
  title: {
    default: "EcoTrack | Your Green Mission Starts Here",
    template: "%s | EcoTrack",
  },
  description:
    "Join a community of neighbors tracking their footprint to build a cleaner future. Simple carbon tracking for everyone.",

  // Update your keywords to be more user-focused
  keywords: [
    "Mayur Pal",
    "thissidemayur",
    "Mayur Pal Projects",
    "Mayur Pal Developer",
    "EcoTrack by Mayur Pal",
    "Full Stack Developer Punjab",
    "Next.js Portfolio",
    "Sustainable Living App",
    "Carbon Footprint Tracker India",
    "Climate Action App",
    "Green Living India",
    "MERN Stack Sustainability",
    "Devops engineer India- Mayur Pal",

    "Carbon Footprint India",
    "Community Sustainability",
    "EcoTrack Punjab",
    "Green Neighborhood",
    "Carbon Calculator for Home",
    "Sustainable Living Tips",
  ],

  authors: [
    { name: "Mayur Pal", url: "https://thissidemayur.me" },
    { name: "thissidemayur", url: "https://thissidemayur.me" },
  ],
  creator: "Mayur Pal",
  publisher: "Mayur Pal", // Adding publisher helps Google verify authority

  openGraph: {
    title: "EcoTrack | Join the Mission for a Greener Tomorrow",
    description:
      "I just joined the EcoTrack mission. Track your impact and lead the way with us!",
    url: "https://ecotrack.thissidemayur.me",
    siteName: "EcoTrack",
    images: [
      {
        url: "/og-image.png", // Ensure this is 1200x630
        width: 1200,
        height: 630,
        alt: "EcoTrack - Developed by Mayur Pal",
      },
    ],
    locale: "en_IN", // Changed to India locale
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "EcoTrack | Join the Green Mission",
    description:
      "Track your impact and see how our community is saving the planet together.",
    images: ["/og-image.png"],
    creator: "@thissidemayur",
    site: "@thissidemayur",
  },

  // verification - Add your real codes here
  // verification: {
  //   google: "YOUR_REAL_GOOGLE_CODE",
  //   // yandex and yahoo are usually not needed for a local Indian/Global project
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster theme="light" position="top-right" closeButton richColors />
      </body>
    </html>
  );
}
