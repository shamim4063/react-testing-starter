import { Theme } from "@radix-ui/themes";
import { PropsWithChildren } from "react";

import AuthProvider from "./AuthProvider";
import { CartProvider } from "./CartProvider";
import { LanguageProvider } from "./language/LanguageProvider";
import ReactQueryProvider from "./ReactQueryProvider";

import "@radix-ui/themes/styles.css";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <ReactQueryProvider>
        <CartProvider>
          <LanguageProvider language="en">
            <Theme>{children}</Theme>
          </LanguageProvider>
        </CartProvider>
      </ReactQueryProvider>
    </AuthProvider>
  );
};

export default Providers;
