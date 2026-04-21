import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apartmentApi } from '../api/services/apartment.api';
import { useAuth } from './AuthContext';

export interface Apartment {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApartmentContextType {
  apartments: Apartment[];
  selectedApartment: Apartment | null;
  isLoading: boolean;
  selectApartment: (apt: Apartment) => void;
  refreshApartments: () => Promise<void>;
}

const ApartmentContext = createContext<ApartmentContextType | undefined>(undefined);

export const ApartmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(() => {
    const saved = localStorage.getItem('active_apartment');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const refreshApartments = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const { data } = await apartmentApi.getApartments();
      const fetchedApartments: Apartment[] = data;
      setApartments(fetchedApartments);

      // Auto-selection logic
      if (fetchedApartments.length > 0) {
        let nextSelected = selectedApartment;

        // If current selection is not in the new list, or no selection exists
        const stillExists = selectedApartment && fetchedApartments.find(a => a.id === selectedApartment.id);
        if (!stillExists) {
          // Priority 1: Default apartment
          const defaultApt = fetchedApartments.find(a => a.isDefault);
          if (defaultApt) {
            nextSelected = defaultApt;
          } else {
            // Priority 2: First available
            nextSelected = fetchedApartments[0];
          }
        } else {
          // Refresh the selected apartment data from the list
          nextSelected = fetchedApartments.find(a => a.id === selectedApartment.id) || null;
        }

        if (nextSelected !== selectedApartment) {
          selectApartment(nextSelected!);
        }
      } else {
        setSelectedApartment(null);
        localStorage.removeItem('active_apartment');
      }
    } catch (error) {
      console.error('Failed to fetch apartments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, selectedApartment]);

  const selectApartment = useCallback((apt: Apartment) => {
    setSelectedApartment(apt);
    localStorage.setItem('active_apartment', JSON.stringify(apt));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshApartments();
    } else {
      setApartments([]);
      setSelectedApartment(null);
      localStorage.removeItem('active_apartment');
    }
  }, [isAuthenticated]); // Only re-run on auth change to avoid loops

  const value = {
    apartments,
    selectedApartment,
    isLoading,
    selectApartment,
    refreshApartments,
  };

  return <ApartmentContext.Provider value={value}>{children}</ApartmentContext.Provider>;
};

export const useApartments = () => {
  const context = useContext(ApartmentContext);
  if (context === undefined) {
    throw new Error('useApartments must be used within an ApartmentProvider');
  }
  return context;
};
