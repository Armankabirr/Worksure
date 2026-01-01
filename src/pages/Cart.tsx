import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { isAuthenticated, openLogin } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Please login to continue with booking");
      openLogin();
      return;
    }

    // Simulate booking process
    setIsProcessing(true);
    setTimeout(() => {
      toast.success("Services booked successfully!");
      clearCart();
      setIsProcessing(false);
      navigate("/profile");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          {cart.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="h-24 w-24 rounded-full bg-accent/50 flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">Your cart is empty</h2>
                  <p className="text-muted-foreground">
                    Browse our services and add them to your cart
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/#service")}
                  className="mt-4"
                >
                  Browse Services
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row gap-4 p-6">
                        {/* Service Image */}
                        {item.image && (
                          <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.serviceName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Service Details */}
                        <div className="flex-grow space-y-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {item.serviceName}
                            </h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {item.serviceType}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Price and Remove */}
                            <div className="flex items-center gap-4">
                              <span className="text-lg font-semibold text-foreground">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Clear Cart Button */}
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive border-destructive/30"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>
                      Review your selected services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service Fee</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax (estimated)</span>
                        <span className="font-medium">${(totalPrice * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-border pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-foreground">Total</span>
                          <span className="font-bold text-lg text-foreground">
                            ${(totalPrice * 1.1).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        "Processing..."
                      ) : (
                        <>
                          Proceed to Book
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <div className="text-xs text-muted-foreground text-center">
                      By proceeding, you agree to our Terms of Service and Privacy Policy
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
