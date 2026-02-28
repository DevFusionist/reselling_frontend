"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { productService } from "@/services/products";
import { Category } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import apiClient from "@/lib/api/client";
import { Separator } from "@/components/ui/separator";

interface VariantOption {
  name: string;
  values: string[];
}

interface ProductVariant {
  price: string;
  stock: string;
  optionValues: Record<string, string>; // { "Color": "Red", "Size": "L" }
}

interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export default function CreateProductPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    sku: "",
    categoryId: "",
    isActive: true,
  });

  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!user?.roles.includes("ADMIN")) {
      router.push("/");
      return;
    }

    fetchCategories();
  }, [user, isAuthenticated, router]);

  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name });
    if (!formData.slug) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(name) }));
    }
  };

  const addVariantOption = () => {
    setVariantOptions([...variantOptions, { name: "", values: [""] }]);
  };

  const updateVariantOption = (index: number, field: "name" | "values", value: string | string[]) => {
    const updated = [...variantOptions];
    if (field === "name") {
      updated[index].name = value as string;
    } else {
      updated[index].values = value as string[];
    }
    setVariantOptions(updated);
    // Regenerate variants when options change
    generateVariants(updated, variants);
  };

  const addVariantOptionValue = (optionIndex: number) => {
    const updated = [...variantOptions];
    updated[optionIndex].values.push("");
    setVariantOptions(updated);
  };

  const removeVariantOption = (index: number) => {
    setVariantOptions(variantOptions.filter((_, i) => i !== index));
    setVariants([]);
  };

  const generateVariants = (options: VariantOption[], existingVariants: ProductVariant[]) => {
    if (options.length === 0 || options.some((opt) => !opt.name || opt.values.length === 0)) {
      return;
    }

    // Generate all combinations
    const combinations: Record<string, string>[] = [];
    const generateCombinations = (current: Record<string, string>, remainingOptions: VariantOption[]) => {
      if (remainingOptions.length === 0) {
        combinations.push({ ...current });
        return;
      }

      const [first, ...rest] = remainingOptions;
      for (const value of first.values.filter((v) => v.trim())) {
        generateCombinations({ ...current, [first.name]: value }, rest);
      }
    };

    generateCombinations({}, options.filter((opt) => opt.name && opt.values.some((v) => v.trim())));
    
    // Create variants from combinations
    const newVariants: ProductVariant[] = combinations.map((combo) => {
      // Check if variant already exists
      const existing = existingVariants.find((v) =>
        Object.keys(combo).every((key) => v.optionValues[key] === combo[key])
      );
      return existing || { price: "", stock: "", optionValues: combo };
    });

    setVariants(newVariants);
  };

  const updateVariant = (index: number, field: "price" | "stock", value: string) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addImage = () => {
    setImages([...images, { url: "", alt: "", isPrimary: images.length === 0 }]);
  };

  const updateImage = (index: number, field: "url" | "alt" | "isPrimary", value: string | boolean) => {
    const updated = [...images];
    if (field === "isPrimary" && value === true) {
      // Unset other primary images
      updated.forEach((img, i) => {
        if (i !== index) img.isPrimary = false;
      });
    }
    updated[index][field] = value;
    setImages(updated);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build the product data according to backend DTO
      const productData: any = {
        name: formData.name,
        description: formData.description || undefined,
        slug: formData.slug || generateSlug(formData.name),
        sku: formData.sku || undefined,
        categoryId: formData.categoryId || undefined,
        isActive: formData.isActive,
      };

      // Add variant options
      if (variantOptions.length > 0) {
        productData.options = variantOptions
          .filter((opt) => opt.name && opt.values.some((v) => v.trim()))
          .map((opt) => ({
            name: opt.name,
            values: opt.values.filter((v) => v.trim()).map((v) => ({ value: v })),
          }));
      }

      // Add variants
      if (variants.length > 0) {
        productData.variants = variants.map((variant) => ({
          price: parseFloat(variant.price) || 0,
          stock: parseInt(variant.stock) || 0,
          isActive: true,
          optionValues: Object.entries(variant.optionValues).map(([optionName, value]) => ({
            optionName,
            value,
          })),
        }));
      }

      // Add images
      if (images.length > 0) {
        productData.images = images
          .filter((img) => img.url.trim())
          .map((img, index) => ({
            url: img.url,
            alt: img.alt || formData.name,
            order: index,
            isPrimary: img.isPrimary,
          }));
      }

      await apiClient.post("/products", productData);
      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategories) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Product</h1>
          <p className="text-muted-foreground">Add a new product to your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="product-slug"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Product description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="SKU-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
        </Card>

        {/* Variant Options */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Variant Options (Color, Size, etc.)</CardTitle>
              <Button type="button" onClick={addVariantOption} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {variantOptions.map((option, optIndex) => (
              <div key={optIndex} className="rounded-lg border p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Input
                    placeholder="Option name (e.g., Color)"
                    value={option.name}
                    onChange={(e) => updateVariantOption(optIndex, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeVariantOption(optIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Values</Label>
                  {option.values.map((value, valIndex) => (
                    <div key={valIndex} className="flex gap-2">
                      <Input
                        placeholder="Value (e.g., Red)"
                        value={value}
                        onChange={(e) => {
                          const newValues = [...option.values];
                          newValues[valIndex] = e.target.value;
                          updateVariantOption(optIndex, "values", newValues);
                        }}
                      />
                      {valIndex === option.values.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => addVariantOptionValue(optIndex)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {variantOptions.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add variant options like Color, Size, etc. to create product variants.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Product Variants */}
        {variants.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="mb-2">
                    <p className="font-medium">
                      {Object.entries(variant.optionValues)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(" / ")}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, "price", e.target.value)}
                        required
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock *</Label>
                      <Input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, "stock", e.target.value)}
                        required
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Images */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Product Images</CardTitle>
              <Button type="button" onClick={addImage} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Image
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {images.map((image, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={image.isPrimary}
                      onChange={(e) => updateImage(index, "isPrimary", e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label>Primary Image</Label>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Image URL *</Label>
                  <Input
                    type="url"
                    value={image.url}
                    onChange={(e) => updateImage(index, "url", e.target.value)}
                    required
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alt Text</Label>
                  <Input
                    value={image.alt}
                    onChange={(e) => updateImage(index, "alt", e.target.value)}
                    placeholder="Image description"
                  />
                </div>
              </div>
            ))}
            {images.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add product images. At least one image is recommended.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? "Creating..." : "Create Product"}
          </Button>
          <Button type="button" variant="outline" asChild size="lg">
            <Link href="/admin/products">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
