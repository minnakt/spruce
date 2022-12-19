import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { AuthProvider } from "context/auth";
import { CookieProvider } from "context/cookie";
import { ToastProvider } from "context/toast";

export const ContextProviders: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AuthProvider>
    <CookieProvider>
      <LeafyGreenProvider baseFontSize={14}>
        <ToastProvider>{children}</ToastProvider>
      </LeafyGreenProvider>
    </CookieProvider>
  </AuthProvider>
);
