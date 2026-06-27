import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-8xl md:text-9xl font-black text-primary/20 select-none">404</div>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-4">Page Not Found</h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3 mt-8">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" /> Go Home
        </Link>
        <Link href="/shop" className="btn-secondary">
          <Search className="h-4 w-4" /> Browse Shop
        </Link>
      </div>
    </div>
  );
}
