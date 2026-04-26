import type { Metadata } from 'next';
import './globals.css';
import PasswordGate from '../components/PasswordGate';

export const metadata: Metadata = {
  title: 'Big Clothing Mainz — Freshe Klamotten',
  description: 'Freshe Klamotten für Freshe Leute. Kein Webshop — Anfragen nur per DM @bigclothingmainz.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <PasswordGate>{children}</PasswordGate>
      </body>
    </html>
  );
}
