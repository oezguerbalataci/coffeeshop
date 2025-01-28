import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, ActivityIndicator, Button, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "~/lib/supabase";
import { LocationHeader } from "~/src/components/location-header";
import { SearchBar } from "~/src/components/search-bar";
import { CategoriesList } from "~/src/components/categories-list";
import { ProductCard } from "~/src/components/product-card";
import { FlashList } from "@shopify/flash-list";
import { useCoffeeStore } from "~/src/store/use-coffee-store";

export default function AuthenticatedHome() {
  const insets = useSafeAreaInsets();
  const { products, setProducts, selectedCategory } = useCoffeeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      if (data) setProducts(data);
    } catch (error) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setProducts]);

  const filteredProducts = useMemo(() => {
    return selectedCategory === "All Coffee"
      ? products
      : products.filter(
          (product) =>
            product.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
  }, [products, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#313131]">
        <ActivityIndicator size="large" color="#C67C4E" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#313131]">
        <Text className="text-white mb-4">{error}</Text>
        <Button title="Retry" onPress={fetchProducts} color="#C67C4E" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#313131]" style={{ paddingTop: insets.top }}>
      <LocationHeader />
      <SearchBar />

      <View className="flex-1 bg-[#f9f2ed]">
        <CategoriesList />

        <View style={{ flex: 1 }} className="px-5">
          <FlashList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            estimatedItemSize={200}
            ItemSeparatorComponent={() => <View className="h-5" />}
            renderItem={({ item }) => <ProductCard product={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16 }}
            removeClippedSubviews={true}
          />
        </View>
      </View>
    </View>
  );
}
