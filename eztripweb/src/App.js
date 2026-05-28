import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthContextProvider } from "./contexts/AuthContext";
import { LookupTablesProvider } from "./contexts/LookupTablesContext";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: Infinity,
		},
	},
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <LookupTablesProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </LookupTablesProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
