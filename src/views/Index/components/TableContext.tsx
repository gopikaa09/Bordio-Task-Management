import React, { createContext, useState, useCallback } from 'react';
import type { Item, ItemRegistration, ReorderFunction } from './types';

// Define Unregister Function Type
type UnregisterFn = () => void;

// Define ItemContextValue Type
export type ItemContextValue = {
  getItemsForColumnPreview: () => {
    items: Item[];
    isMoreItems: boolean;
  };
  reorderColumn: ReorderFunction;
  reorderItem: ReorderFunction;
  register: (args: ItemRegistration) => UnregisterFn;
  instanceId: symbol | null;
};

// Create Context with Default Values
export const TableContext = createContext<ItemContextValue>({
  getItemsForColumnPreview: () => ({ items: [], isMoreItems: false }),
  reorderColumn: () => { },
  reorderItem: () => { },
  register: function register() {
    return function unregister() { };
  },
  instanceId: null,
});

// Context Provider Component
export const TableContextProvider = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [instanceId] = useState<symbol | null>(Symbol());

  // Function to Get Items for Column Preview
  const getItemsForColumnPreview = useCallback(() => {
    // Implement your logic to get items for column preview
    const isMoreItems = items.length > 10; // Example logic
    return { items, isMoreItems };
  }, [items]);

  // Function to Reorder Column
  const reorderColumn: ReorderFunction = useCallback((startIndex, endIndex) => {
    // Implement your logic to reorder columns
    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(startIndex, 1);
    reorderedItems.splice(endIndex, 0, movedItem);
    setItems(reorderedItems);
  }, [items]);

  // Function to Reorder Item
  const reorderItem: ReorderFunction = useCallback((startIndex, endIndex) => {
    // Implement your logic to reorder items
    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(startIndex, 1);
    reorderedItems.splice(endIndex, 0, movedItem);
    setItems(reorderedItems);
  }, [items]);

  // Function to Register an Item
  const register = useCallback((args: ItemRegistration): UnregisterFn => {
    // Implement your logic to register an item
    setItems((prevItems) => [...prevItems, args.item]);
    return () => {
      // Implement your logic to unregister the item
      setItems((prevItems) => prevItems.filter(item => item.id !== args.item.id));
    };
  }, []);

  return (
    <TableContext.Provider
      value={{
        getItemsForColumnPreview,
        reorderColumn,
        reorderItem,
        register,
        instanceId,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
