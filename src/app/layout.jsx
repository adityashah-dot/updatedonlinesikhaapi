import "./globals.css";
import SiteShell from "@/components/shell/SiteShell";
import { getUniversitiesPayload } from "@/services/universityApi";

export const revalidate = 300;

export const metadata = {
  metadataBase: new URL("https://degreefyd.com"),
  title: {
    default: "Online Siksha - Online Degrees & Admissions Portal",
    template: "%s | Online Siksha",
  },
  description:
    "Explore UGC-entitled online degree programs, semester tuition fees, scholarships, and direct admissions.",
  openGraph: {
    title: "Online Siksha - Online Degrees & Admissions Portal",
    description:
      "Explore UGC-entitled online degree programs, semester tuition fees, scholarships, and direct admissions.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({ children }) {
  const listing = await getUniversitiesPayload();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f9f9ff] text-[#111c2d] antialiased selection:bg-[#d5e3ff] selection:text-[#001b3c]">
        <SiteShell universities={listing?.onlineUniversities || []}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
