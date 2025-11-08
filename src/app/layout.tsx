import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/themeProvider";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import AsyncMultiDialog from "@/components/NMultiDialog";
import { Libre_Baskerville, Lora, IBM_Plex_Mono } from 'next/font/google'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
})

const lora = Lora({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${libreBaskerville.variable} ${lora.className} ${ibmPlexMono.variable} antialiased  h-screen w-screen overflow-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <AsyncMultiDialog/>
          </QueryProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
