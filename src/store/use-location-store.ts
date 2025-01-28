import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@coffee_shop_locations";

export interface Location {
  name: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface LocationState {
  currentLocation: Location;
  savedLocations: Location[];
  isPickerOpen: boolean;
  isAddingAddress: boolean;
  formError: string | null;
}

interface LocationActions {
  setCurrentLocation: (location: Location) => void;
  addSavedLocation: (location: Location) => Promise<void>;
  removeSavedLocation: (locationName: string) => Promise<void>;
  setPickerOpen: (isOpen: boolean) => void;
  setAddingAddress: (isAdding: boolean) => void;
  setFormError: (error: string | null) => void;
  loadLocations: () => Promise<void>;
}

type LocationStore = LocationState & LocationActions;

async function saveLocationsToStorage(locations: Location[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  } catch (error) {
    console.error("Error saving locations:", error);
  }
}

const DEFAULT_LOCATIONS: Location[] = [
  {
    name: "Home",
    address: "Jl. Kpg Sutoyo",
  },
  {
    name: "Office",
    address: "Jl. Workstreet CBD",
  },
  {
    name: "Apartment",
    address: "Jl. Apartment Complex",
  },
];

export const useLocationStore = create<LocationStore>((set, get) => ({
  currentLocation: DEFAULT_LOCATIONS[0],
  savedLocations: DEFAULT_LOCATIONS,
  isPickerOpen: false,
  isAddingAddress: false,
  formError: null,

  loadLocations: async () => {
    try {
      const storedLocations = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedLocations) {
        const locations = JSON.parse(storedLocations) as Location[];
        if (locations.length > 0) {
          set({ 
            savedLocations: locations,
            currentLocation: locations[0]
          });
        }
      } else {
        // If no stored locations, save the default ones
        await saveLocationsToStorage(DEFAULT_LOCATIONS);
      }
    } catch (error) {
      console.error("Error loading locations:", error);
      // If error loading, use defaults
      set({ 
        savedLocations: DEFAULT_LOCATIONS,
        currentLocation: DEFAULT_LOCATIONS[0]
      });
    }
  },

  setCurrentLocation: (location) => set({ currentLocation: location }),

  addSavedLocation: async (location) => {
    const { savedLocations } = get();
    
    // Validate location name uniqueness
    if (savedLocations.some((loc) => loc.name === location.name)) {
      set({ formError: "A location with this name already exists" });
      return;
    }

    // Validate required fields
    if (!location.name || !location.address) {
      set({ formError: "Name and address are required" });
      return;
    }

    const newLocations = [...savedLocations, location];
    
    try {
      await saveLocationsToStorage(newLocations);
      set({ 
        savedLocations: newLocations, 
        currentLocation: location,
        formError: null,
        isAddingAddress: false,
        isPickerOpen: true,
      });
    } catch (error) {
      console.error("Error saving location:", error);
      set({ formError: "Failed to save location" });
    }
  },

  removeSavedLocation: async (locationName) => {
    const { savedLocations, currentLocation } = get();
    const newLocations = savedLocations.filter(
      (loc) => loc.name !== locationName
    );
    
    try {
      await saveLocationsToStorage(newLocations);
      set({ 
        savedLocations: newLocations,
        // If current location was removed, set first available as current
        ...(currentLocation.name === locationName && newLocations.length > 0
          ? { currentLocation: newLocations[0] }
          : {})
      });
    } catch (error) {
      console.error("Error removing location:", error);
    }
  },

  setPickerOpen: (isOpen) => set({ isPickerOpen: isOpen }),
  setAddingAddress: (isAdding) => set({ isAddingAddress: isAdding }),
  setFormError: (error) => set({ formError: error }),
})); 