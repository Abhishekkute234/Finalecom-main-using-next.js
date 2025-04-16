// app/providers/AppProviders.tsx
'use client';

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { ModalCartProvider } from '@/context/ModalCartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ModalWishlistProvider } from '@/context/ModalWishlistContext';
import { CompareProvider } from '@/context/CompareContext';
import { ModalCompareProvider } from '@/context/ModalCompareContext';
import { ModalSearchProvider } from '@/context/ModalSearchContext';
import { ModalQuickviewProvider } from '@/context/ModalQuickviewContext';
import ClientSessionProvider from '@/context/ClientSessionProvider';
import { CartsProvider } from '@/context/CartsContext';
import { OrdersProvider } from '@/context/OrderContext';

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClientSessionProvider>
      <CartsProvider>
        <OrdersProvider>
          <CartProvider>
            <ModalCartProvider>
              <WishlistProvider>
                <ModalWishlistProvider>
                  <CompareProvider>
                    <ModalCompareProvider>
                      <ModalSearchProvider>
                        <ModalQuickviewProvider>
                          {children}
                        </ModalQuickviewProvider>
                      </ModalSearchProvider>
                    </ModalCompareProvider>
                  </CompareProvider>
                </ModalWishlistProvider>
              </WishlistProvider>
            </ModalCartProvider>
          </CartProvider>
        </OrdersProvider>
      </CartsProvider>
    </ClientSessionProvider>
  );
};

export default AppProviders;
