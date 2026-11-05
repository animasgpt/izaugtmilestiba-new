import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CmsPage from "./cms/CmsPage";
import StudioRedirect from './pages/StudioRedirect';
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<p className="p-8">Ielādē…</p>}>
        <Routes>

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/pieteikumi" element={<Admin />} />
          <Route path="/admin" element={<StudioRedirect />} />
          <Route path="/admin/content" element={<StudioRedirect />} />
          <Route path="/studio/*" element={<StudioRedirect />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<CmsPage />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
