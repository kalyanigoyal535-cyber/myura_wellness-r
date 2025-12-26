import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { productsApi } from "../services/products";
import { Product } from "../services/types";
import { apiProductToFrontend } from "../utils/productConverter";
import { ProductRecord } from "../data/products";
import ResponsiveProductImage from "../components/ResponsiveProductImage";
import { useCart } from "../context/CartContext";
import { Loader2 } from "lucide-react";

const ProductDetailDynamic: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Try to fetch by slug first, then by ID
        let productData: Product | null = null;

        // First try slug-based lookup
        try {
          productData = await productsApi.getProductBySlug(id);
        } catch (err) {
          // Slug lookup failed, will try ID below
        }

        // If not found by slug, try numeric ID
        if (!productData && !isNaN(Number(id))) {
          try {
            productData = await productsApi.getProduct(parseInt(id));
          } catch (err) {
            // ID lookup also failed, will be handled below
          }
        }

        if (productData) {
          const convertedProduct = apiProductToFrontend(productData);
          setProduct(convertedProduct);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      await addItem(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image?.fallback || "",
        },
        1
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-slate-900" />
      </div>
    );
  }

  if (error || !product) {
    return <Navigate to="/product" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <ResponsiveProductImage
              image={product.image}
              className="w-full rounded-lg"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {product.name}
            </h1>
            {product.headline && (
              <p className="text-xl text-slate-600 mb-6">{product.headline}</p>
            )}

            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-slate-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-slate-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        % OFF
                      </span>
                    </>
                  )}
              </div>
            </div>

            {product.summary && (
              <p className="text-slate-700 mb-6 leading-relaxed">
                {product.summary}
              </p>
            )}

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !product.inStock}
              className="w-full bg-slate-900 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

            {product.benefits && product.benefits.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Key Benefits
                </h2>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-slate-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Full Description */}
        {product.description && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Description
            </h2>
            <div className="prose max-w-none text-slate-700">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        )}

        {/* Key Ingredients */}
        {product.keyIngredients && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Key Ingredients
            </h2>
            <p className="text-slate-700 whitespace-pre-line">
              {product.keyIngredients}
            </p>
          </div>
        )}

        {/* How to Use */}
        {product.howToUse && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              How to Use
            </h2>
            <p className="text-slate-700 whitespace-pre-line">
              {product.howToUse}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailDynamic;
