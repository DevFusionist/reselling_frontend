import { Metadata } from "next";
import { notFound } from "next/navigation";
import { shareLinkService } from "@/services/shareLinks";
import { ShareLinkPageContent } from "@/components/share-link/ShareLinkPageContent";

interface ShareLinkPageProps {
  params: {
    code: string;
  };
}

export async function generateMetadata({
  params,
}: ShareLinkPageProps): Promise<Metadata> {
  try {
    const shareLink = await shareLinkService.getShareLink(params.code);
    if (shareLink.product) {
      return {
        title: shareLink.product.name,
        description: shareLink.product.description || `Buy ${shareLink.product.name} at special price`,
      };
    }
    return {
      title: "Special Offer",
      description: "Check out this special offer",
    };
  } catch {
    return {
      title: "Share Link Not Found",
    };
  }
}

export default async function ShareLinkPage({ params }: ShareLinkPageProps) {
  let shareLink;
  try {
    shareLink = await shareLinkService.getShareLink(params.code);
    if (!shareLink.isActive) {
      notFound();
    }
  } catch (error) {
    notFound();
  }

  return <ShareLinkPageContent shareLink={shareLink} />;
}

