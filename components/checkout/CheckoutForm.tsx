'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import CTAButton from '@/components/ui/CTAButton';
import { FaCheck, FaCopy } from 'react-icons/fa';

export interface Address {
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface CheckoutFormProps {
  onSubmit: (shippingAddress: Address, billingAddress?: Address) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function CheckoutForm({ onSubmit, onCancel, isLoading = false }: CheckoutFormProps) {
  const [useSameAddress, setUseSameAddress] = useState(true);
  
  // Shipping Address State
  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
  });

  // Billing Address State
  const [billingAddress, setBillingAddress] = useState<Address>({
    name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAddress = (address: Address, prefix: string): Record<string, string> => {
    const addressErrors: Record<string, string> = {};
    
    if (!address.name.trim()) {
      addressErrors[`${prefix}_name`] = 'Name is required';
    }
    if (!address.phone.trim()) {
      addressErrors[`${prefix}_phone`] = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(address.phone.replace(/[\s-]/g, ''))) {
      addressErrors[`${prefix}_phone`] = 'Please enter a valid 10-digit phone number';
    }
    if (!address.address_line1.trim()) {
      addressErrors[`${prefix}_address_line1`] = 'Address line 1 is required';
    }
    if (!address.city.trim()) {
      addressErrors[`${prefix}_city`] = 'City is required';
    }
    if (!address.state.trim()) {
      addressErrors[`${prefix}_state`] = 'State is required';
    }
    if (!address.postal_code.trim()) {
      addressErrors[`${prefix}_postal_code`] = 'Postal code is required';
    } else if (!/^[0-9]{6}$/.test(address.postal_code)) {
      addressErrors[`${prefix}_postal_code`] = 'Please enter a valid 6-digit postal code';
    }
    if (!address.country.trim()) {
      addressErrors[`${prefix}_country`] = 'Country is required';
    }

    return addressErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const shippingErrors = validateAddress(shippingAddress, 'shipping');
    let billingErrors: Record<string, string> = {};
    
    if (!useSameAddress) {
      billingErrors = validateAddress(billingAddress, 'billing');
    }

    const allErrors = { ...shippingErrors, ...billingErrors };
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setErrors({});
    onSubmit(shippingAddress, useSameAddress ? undefined : billingAddress);
  };

  const copyShippingToBilling = () => {
    setBillingAddress({ ...shippingAddress });
  };

  const handleShippingChange = (field: keyof Address, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    if (useSameAddress) {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }
    // Clear error for this field
    if (errors[`shipping_${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`shipping_${field}`];
        return newErrors;
      });
    }
  };

  const handleBillingChange = (field: keyof Address, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[`billing_${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`billing_${field}`];
        return newErrors;
      });
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-taupe p-6 rounded-lg border border-divider-silver space-y-8"
    >
      <h2 className="font-headings text-2xl text-text-cream mb-6">Shipping Information</h2>

      {/* Shipping Address */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            id="shipping-name"
            value={shippingAddress.name}
            onChange={(e) => handleShippingChange('name', e.target.value)}
            error={errors.shipping_name}
            required
          />
          <Input
            label="Phone Number"
            id="shipping-phone"
            type="tel"
            value={shippingAddress.phone}
            onChange={(e) => handleShippingChange('phone', e.target.value)}
            error={errors.shipping_phone}
            placeholder="10-digit phone number"
            required
          />
        </div>

        <Input
          label="Address Line 1"
          id="shipping-address-line1"
          value={shippingAddress.address_line1}
          onChange={(e) => handleShippingChange('address_line1', e.target.value)}
          error={errors.shipping_address_line1}
          required
        />

        <Input
          label="Address Line 2 (Optional)"
          id="shipping-address-line2"
          value={shippingAddress.address_line2 || ''}
          onChange={(e) => handleShippingChange('address_line2', e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="City"
            id="shipping-city"
            value={shippingAddress.city}
            onChange={(e) => handleShippingChange('city', e.target.value)}
            error={errors.shipping_city}
            required
          />
          <Input
            label="State"
            id="shipping-state"
            value={shippingAddress.state}
            onChange={(e) => handleShippingChange('state', e.target.value)}
            error={errors.shipping_state}
            required
          />
          <Input
            label="Postal Code"
            id="shipping-postal-code"
            value={shippingAddress.postal_code}
            onChange={(e) => handleShippingChange('postal_code', e.target.value)}
            error={errors.shipping_postal_code}
            placeholder="6-digit code"
            required
          />
        </div>

        <Input
          label="Country"
          id="shipping-country"
          value={shippingAddress.country}
          onChange={(e) => handleShippingChange('country', e.target.value)}
          error={errors.shipping_country}
          required
        />
      </div>

      {/* Billing Address Section */}
      <div className="pt-6 border-t border-divider-silver">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headings text-2xl text-text-cream">Billing Information</h2>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useSameAddress}
              onChange={(e) => {
                setUseSameAddress(e.target.checked);
                if (e.target.checked) {
                  setBillingAddress({ ...shippingAddress });
                }
              }}
              className="w-4 h-4 text-cta-copper bg-base-navy border-divider-silver rounded focus:ring-cta-copper"
            />
            <span className="text-text-lavender text-sm">Same as shipping address</span>
          </label>
        </div>

        {!useSameAddress && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={copyShippingToBilling}
                className="flex items-center space-x-2 text-sm text-cta-copper hover:text-text-cream transition-colors"
              >
                <FaCopy className="text-xs" />
                <span>Copy from shipping</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                id="billing-name"
                value={billingAddress.name}
                onChange={(e) => handleBillingChange('name', e.target.value)}
                error={errors.billing_name}
                required
              />
              <Input
                label="Phone Number"
                id="billing-phone"
                type="tel"
                value={billingAddress.phone}
                onChange={(e) => handleBillingChange('phone', e.target.value)}
                error={errors.billing_phone}
                placeholder="10-digit phone number"
                required
              />
            </div>

            <Input
              label="Address Line 1"
              id="billing-address-line1"
              value={billingAddress.address_line1}
              onChange={(e) => handleBillingChange('address_line1', e.target.value)}
              error={errors.billing_address_line1}
              required
            />

            <Input
              label="Address Line 2 (Optional)"
              id="billing-address-line2"
              value={billingAddress.address_line2 || ''}
              onChange={(e) => handleBillingChange('address_line2', e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                id="billing-city"
                value={billingAddress.city}
                onChange={(e) => handleBillingChange('city', e.target.value)}
                error={errors.billing_city}
                required
              />
              <Input
                label="State"
                id="billing-state"
                value={billingAddress.state}
                onChange={(e) => handleBillingChange('state', e.target.value)}
                error={errors.billing_state}
                required
              />
              <Input
                label="Postal Code"
                id="billing-postal-code"
                value={billingAddress.postal_code}
                onChange={(e) => handleBillingChange('postal_code', e.target.value)}
                error={errors.billing_postal_code}
                placeholder="6-digit code"
                required
              />
            </div>

            <Input
              label="Country"
              id="billing-country"
              value={billingAddress.country}
              onChange={(e) => handleBillingChange('country', e.target.value)}
              error={errors.billing_country}
              required
            />
          </motion.div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex space-x-4 pt-4">
        <CTAButton
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Processing...' : 'Continue to Payment'}
        </CTAButton>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-text-lavender hover:text-text-cream transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.form>
  );
}

