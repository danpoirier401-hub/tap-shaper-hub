import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Management from "./pages/Management";
import DisplaySettings from "./pages/DisplaySettings";
import BeverageManagement from "./pages/BeverageManagement";
import TapAssignment from "./pages/TapAssignment";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/management" element={<ProtectedRoute><Management /></ProtectedRoute>} />
          <Route path="/management/display" element={<ProtectedRoute><DisplaySettings /></ProtectedRoute>} />
          <Route path="/management/beverages" element={<ProtectedRoute><BeverageManagement /></ProtectedRoute>} />
          <Route path="/management/taps" element={<ProtectedRoute><TapAssignment /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
