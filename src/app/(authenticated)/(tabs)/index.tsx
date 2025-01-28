import React, { useEffect } from "react";
import { View } from "react-native";
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
  const { products, setProducts, selectedCategory, setSelectedCategory } =
    useCoffeeStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        throw error;
      }

      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <View className="flex-1 bg-[#313131]" style={{ paddingTop: insets.top }}>
      <LocationHeader />
      <SearchBar />

      <View className="flex-1 bg-[#f9f2ed]">
        <CategoriesList />

        <View style={{ flex: 1 }} className="px-5">
          <FlashList
            data={
              selectedCategory === "All Coffee"
                ? products
                : products.filter(
                    (product) =>
                      product.category?.toLowerCase() ===
                      selectedCategory.toLowerCase()
                  )
            }
            numColumns={2}
            estimatedItemSize={200}
            ItemSeparatorComponent={() => <View className="h-5 " />}
            renderItem={({ item }) => <ProductCard product={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16 }}
          />
        </View>
      </View>
    </View>
  );
}
