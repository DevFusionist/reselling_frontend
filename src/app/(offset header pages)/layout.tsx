// app/layout.tsx (root)
import Navbar from "@/components/Navbar/Navbar";
import "../globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <Navbar />

        {/* Default offset for every page except (home) */}
        <main className="pt-10">
          {children}
        </main>
      </body>
    </html>
  );
}
