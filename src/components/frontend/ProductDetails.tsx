import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { getProductImageUrl, resolveProductImage, formatPrice, getEffectivePrice } from '@/lib/productUtils';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  slug: string;
  name: string;
  purchase_price: number;
  originalPrice?: number;
  image?: string | null;
  image_url?: string | null;
  category?: { id: number; name: string };
  brand?: { id: number; name: string };
  stock: number;
  description: string;
  specification: string;
}

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addToCart);
  const { toggle: toggleWishlist, has: isInWishlist } = useWishlistStore();

  // const handleAddToCart = () => {
  //   onAddToCart(product, quantity, selectedSize, selectedColor);
  // };

 const handleAddToCart = () => {
  addItem({
    id: product.id,
    name: product.name,
    price: getEffectivePrice(product),
    image: product.image ?? '',
    stock: product.stock ? product.stock : 0,
    quantity,
  });
  toast.success('Added to cart');
};

  const handleWishlistClick = () => {
    toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      purchase_price: product.purchase_price,
      image: product.image ?? '',
      stock: product.stock,
    });
  };

  // const discount = product.originalPrice ? 
  //   Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Product Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={resolveProductImage(product)}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            <button
              className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200"
            >
              <img
                src={resolveProductImage(product)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>


        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {/* <p className="text-sm text-gray-500 mb-2">{product.category?.name}</p> */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              {/* <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">({product.reviews} reviews)</span> */}
              <span className="text-sm text-gray-500 ml-2">{product.brand?.name}</span>
            </div>
            
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">Tk {product.purchase_price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                  {/* <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    -{discount}%
                  </span> */}
                </>
              )}
            </div>
          </div>

          {/* Size Selection */}
          {/* {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-md border ${
                      selectedSize === size
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )} */}

          {/* Color Selection */}
          {/* {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-md border ${
                      selectedColor === color
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )} */}

          {/* Quantity and Add to Cart */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {/* <input type="number" value={quantity} min={1} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} /> */}
            <button
              onClick={handleAddToCart}
              disabled={!product.stock}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{product.stock ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
            
            <button
              onClick={handleWishlistClick}
              className={`p-3 rounded-md border transition-colors ${
                isInWishlist(product.id)
                  ? 'bg-red-50 border-red-300 text-red-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Product Description */}
          {product.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.specification && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Specification</h3>
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: product.specification || "<p>No specification added.</p>" }}
            />
            </div>
          )}

          {/* Features */}
          {/* <div className="border-t pt-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Free shipping on orders over $99</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">30-day return policy</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">2-year warranty included</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;