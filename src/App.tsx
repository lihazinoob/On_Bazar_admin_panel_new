import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { CreateProductPage } from "./pages/CreateProductPage";
import { DynamicBreadcrumb } from "./components/DynamicBreadCrumb";
import { Toaster } from "sonner";
import AllProductPage from "./pages/AllProductPage";
function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb/>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard"  replace/> } />

              {/* Product Route */}
              {/* <Route path="/products" element={<ProductsPage />} /> */}
              <Route path="/products/create" element={<CreateProductPage />} />
              <Route path = "/products/all" element= {<AllProductPage/>}/>
              {/* <Route path="/products/:id" element={<ProductDetailsPage />} /> */}
            </Routes>
          </div>
        </SidebarInset>
        <Toaster/>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
