import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminPanel from "./components/admin/AdminPanel";
import Programs from "./pages/Programs";
import ProgramDetails from "./pages/ProgramDetails";
import Contact from "./pages/Contact";
import Facilities from "./pages/Facilities";
import Checkout from "./pages/Checkout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Program Routes */}
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetails />} />
          
          {/* Facilities Route */}
          <Route path="/facilities" element={<Facilities />} />
          
          {/* Contact Route */}
          <Route path="/contact" element={<Contact />} />
          
          {/* Checkout Route */}
          <Route path="/checkout/:id" element={<Checkout />} />
          
          {/* Admin Route */}
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
