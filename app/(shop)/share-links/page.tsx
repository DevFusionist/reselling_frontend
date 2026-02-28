"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { shareLinkService } from "@/services/shareLinks";
import { ShareLink, ShareLinkStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, ExternalLink, BarChart3, Check } from "lucide-react";
import toast from "react-hot-toast";
import { CreateShareLinkDialog } from "@/components/share-link/CreateShareLinkDialog";

export default function ShareLinksPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsMap, setStatsMap] = useState<Record<string, ShareLinkStats>>({});
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!user?.roles.includes("RESELLER")) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      if (!user) return;
      try {
        const links = await shareLinkService.getShareLinks(user.id);
        setShareLinks(links);

        // Fetch stats for each link
        const statsPromises = links.map(async (link) => {
          try {
            const stats = await shareLinkService.getStats(link.code);
            return { code: link.code, stats };
          } catch {
            return { code: link.code, stats: null };
          }
        });

        const statsResults = await Promise.all(statsPromises);
        const statsObj: Record<string, ShareLinkStats> = {};
        statsResults.forEach(({ code, stats }) => {
          if (stats) statsObj[code] = stats;
        });
        setStatsMap(statsObj);
      } catch (error) {
        console.error("Failed to fetch share links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated, router]);

  const handleCopyLink = (url: string, code: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(code);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleRefresh = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const links = await shareLinkService.getShareLinks(user.id);
      setShareLinks(links);
    } catch (error) {
      console.error("Failed to refresh links:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Share Links</h1>
          <p className="text-muted-foreground">
            Create and manage your referral links
          </p>
        </div>
        <CreateShareLinkDialog
          sellerId={user?.id || ""}
          onSuccess={handleRefresh}
        />
      </div>

      {shareLinks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No share links created yet.</p>
            <CreateShareLinkDialog
              sellerId={user?.id || ""}
              onSuccess={handleRefresh}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shareLinks.map((link) => {
            const stats = statsMap[link.code];
            const fullUrl = typeof window !== "undefined" 
              ? `${window.location.origin}/share/${link.code}`
              : link.url;

            return (
              <Card key={link.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Link #{link.code.slice(0, 8)}</CardTitle>
                    <Badge variant={link.isActive ? "default" : "secondary"}>
                      {link.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {link.product && (
                    <div>
                      <p className="text-sm font-medium">{link.product.name}</p>
                      {link.sellerPrice && (
                        <p className="text-xs text-muted-foreground">
                          Price: ₹{link.sellerPrice}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Input
                      value={fullUrl}
                      readOnly
                      className="flex-1 text-xs"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleCopyLink(fullUrl, link.code)}
                    >
                      {copiedLink === link.code ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      asChild
                    >
                      <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>

                  {stats && (
                    <div className="space-y-2 rounded-md bg-muted p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <BarChart3 className="h-4 w-4" />
                        <span className="font-medium">Statistics</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Clicks</p>
                          <p className="font-semibold">{stats.clicks}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Conversions</p>
                          <p className="font-semibold">{stats.conversions}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rate</p>
                          <p className="font-semibold">
                            {stats.conversionRate.toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-semibold">
                            ₹{parseFloat(stats.totalRevenue.toString()).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {link.expiresAt && (
                    <p className="text-xs text-muted-foreground">
                      Expires: {formatDate(link.expiresAt)}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

