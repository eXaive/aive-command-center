import "./globals.css";
export const metadata = { title: "GMMF Donut — Crowned X", description: "Organize Everything. Monitor Anything." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
