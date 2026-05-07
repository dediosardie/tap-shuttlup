import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { applyPersistedTheme } from "@/lib/themes";

// Apply the user's saved theme immediately to avoid flash of default styles
applyPersistedTheme();

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}