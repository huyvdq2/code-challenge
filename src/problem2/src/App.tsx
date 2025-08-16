import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { SwapFormContainer } from './components/features/swap-form';
import { SwapHistoryContainer } from './components/features/history';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SwapFormContainer />
            <SwapHistoryContainer />
          </div>
        </div>
      </main>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
