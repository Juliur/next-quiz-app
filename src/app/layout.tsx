import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { QuizContextProvider } from "@/contexts/quizContext";

const geistSans = Nunito({
  weight: ["400", "700"],
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} grid h-screen place-items-center`}
      >
        <QuizContextProvider>{children}</QuizContextProvider>
      </body>
    </html>
  );
}
