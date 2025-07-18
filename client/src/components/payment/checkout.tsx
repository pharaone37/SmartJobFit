import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock, Check } from "lucide-react";

interface CheckoutProps {
  planName: string;
  price: number;
  features: string[];
  onSubmit: (paymentData: any) => void;
  loading?: boolean;
}

export default function Checkout({ planName, price, features, onSubmit, loading = false }: CheckoutProps) {
  const [paymentData, setPaymentData] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "US"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(paymentData);
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Your Purchase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{planName}</h3>
              <Badge variant="secondary">${price}/month</Badge>
            </div>
            <div className="space-y-1">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="h-3 w-3 text-green-500" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={paymentData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Payment Details
              </h4>
              
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="name">Cardholder Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={paymentData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-4">
              <h4 className="font-medium">Billing Address</h4>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  value={paymentData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={paymentData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    value={paymentData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Processing..." : `Subscribe for $${price}/month`}
            </Button>
          </form>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <Lock className="h-3 w-3 inline mr-1" />
            Your payment information is secure and encrypted
          </div>
        </CardContent>
      </Card>
    </div>
  );
}