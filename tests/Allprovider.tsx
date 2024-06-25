import { Theme } from "@radix-ui/themes";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { CartProvider } from "../src/providers/CartProvider";

const AllProvider = ({ children }: PropsWithChildren) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <CartProvider>
      <Theme>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </Theme>
    </CartProvider>
  );
};

export default AllProvider;
