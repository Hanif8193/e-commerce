"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { shippingSchema } from "@/utils/validation";

interface CheckoutFormProps {
  returnUrl: string;
}

interface ShippingFields {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export function CheckoutForm({ returnUrl }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [shipping, setShipping] = useState<ShippingFields>({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ShippingFields, string>>>({});

  useEffect(() => {
    if (stripe && elements) setReady(true);
  }, [stripe, elements]);

  function setField(field: keyof ShippingFields) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setShipping((prev) => ({ ...prev, [field]: e.target.value }));
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    const parsed = shippingSchema.safeParse(shipping);
    if (!parsed.success) {
      const errors: Partial<Record<keyof ShippingFields, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ShippingFields;
        errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError("");

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        shipping: {
          name: parsed.data.name,
          address: {
            line1: parsed.data.address,
            city: parsed.data.city,
            state: parsed.data.state,
            postal_code: parsed.data.zip,
            country: parsed.data.country.toUpperCase(),
          },
        },
      },
    });

    if (submitError) {
      setError(submitError.message ?? "Payment failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Shipping Address</h3>
        <div className="space-y-3">
          <Input
            label="Full name"
            value={shipping.name}
            onChange={setField("name")}
            disabled={loading}
            error={fieldErrors.name}
            autoComplete="name"
          />
          <Input
            label="Street address"
            value={shipping.address}
            onChange={setField("address")}
            disabled={loading}
            error={fieldErrors.address}
            autoComplete="street-address"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              value={shipping.city}
              onChange={setField("city")}
              disabled={loading}
              error={fieldErrors.city}
              autoComplete="address-level2"
            />
            <Input
              label="State / Province"
              value={shipping.state}
              onChange={setField("state")}
              disabled={loading}
              error={fieldErrors.state}
              autoComplete="address-level1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="ZIP / Postal code"
              value={shipping.zip}
              onChange={setField("zip")}
              disabled={loading}
              error={fieldErrors.zip}
              autoComplete="postal-code"
            />
            <Input
              label="Country (2-letter)"
              placeholder="US"
              maxLength={2}
              value={shipping.country}
              onChange={setField("country")}
              disabled={loading}
              error={fieldErrors.country}
              autoComplete="country"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Payment</h3>
        <PaymentElement />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" disabled={!ready || loading} className="w-full" size="lg">
        {loading ? "Processing…" : "Pay now"}
      </Button>
    </form>
  );
}
