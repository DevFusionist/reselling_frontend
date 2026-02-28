import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-4xl font-bold">404</h1>
      <p className="mb-8 text-muted-foreground">Page not found</p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}

