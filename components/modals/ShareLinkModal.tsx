'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import CTAButton from '@/components/ui/CTAButton';
import { FaSpinner, FaCopy, FaCheckCircle } from 'react-icons/fa';
import { FaDollarSign, FaCalendarAlt } from 'react-icons/fa';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  onSubmit: (data: { product_id: number; margin_amount: number; expires_in_days?: number }) => Promise<{ code: string; url: string }>;
}

export default function ShareLinkModal({ isOpen, onClose, productId, onSubmit }: ShareLinkModalProps) {
  const [marginAmount, setMarginAmount] = useState<string>('');
  const [expiresInDays, setExpiresInDays] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate margin amount
      const margin = parseFloat(marginAmount);
      if (isNaN(margin) || margin < 0) {
        setError('Margin amount must be a non-negative number');
        setIsLoading(false);
        return;
      }

      // Validate expires in days if provided
      let expiresDays: number | undefined;
      if (expiresInDays.trim()) {
        expiresDays = parseInt(expiresInDays);
        if (isNaN(expiresDays) || expiresDays <= 0) {
          setError('Expires in days must be a positive integer');
          setIsLoading(false);
          return;
        }
      }

      // Call the submit handler
      const result = await onSubmit({
        product_id: productId,
        margin_amount: margin,
        expires_in_days: expiresDays,
      });

      // Show the generated link
      setGeneratedLink(result.url);
    } catch (err: any) {
      setError(err.message || 'Failed to generate share link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;

    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setMarginAmount('');
    setExpiresInDays('');
    setError('');
    setGeneratedLink(null);
    setCopied(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Generate Shareable Link">
      {generatedLink ? (
        // Success state - show generated link
        <div className="space-y-4">
          <div className="p-4 bg-base-navy/50 rounded-soft-lg border border-divider-silver">
            <p className="font-body text-sm text-text-lavender mb-2">Your shareable link:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={generatedLink}
                readOnly
                className="flex-1 p-2 bg-base-navy text-text-cream rounded-md border border-divider-silver text-sm font-mono"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 bg-cta-copper text-text-cream rounded-md hover:bg-cta-copper/90 transition-colors"
                aria-label="Copy link"
              >
                {copied ? <FaCheckCircle /> : <FaCopy />}
              </button>
            </div>
            {copied && (
              <p className="text-xs text-green-500 mt-2">Link copied to clipboard!</p>
            )}
          </div>
          <CTAButton onClick={handleClose} className="w-full">
            Done
          </CTAButton>
        </div>
      ) : (
        // Form state
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-highlight-wine/20 border border-highlight-wine text-highlight-wine rounded-soft-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="Margin Amount (USD)"
            id="marginAmount"
            type="number"
            icon={FaDollarSign}
            value={marginAmount}
            onChange={(e) => setMarginAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
            hint="The amount you'll earn per sale (non-negative number)"
          />

          <Input
            label="Expires In Days (Optional)"
            id="expiresInDays"
            type="number"
            icon={FaCalendarAlt}
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(e.target.value)}
            placeholder="Leave empty for no expiry"
            min="1"
            step="1"
            hint="Number of days until the link expires (optional)"
          />

          <div className="flex space-x-4">
            <CTAButton
              type="button"
              onClick={handleClose}
              className="flex-1 bg-transparent border border-text-lavender text-text-lavender hover:bg-text-lavender/10"
              disabled={isLoading}
            >
              Cancel
            </CTAButton>
            <CTAButton type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Generating...
                </div>
              ) : (
                'Generate Link'
              )}
            </CTAButton>
          </div>
        </form>
      )}
    </Modal>
  );
}

