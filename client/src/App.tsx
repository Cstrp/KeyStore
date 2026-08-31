import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { Toaster } from './components/ui/toast';

export const App = (): React.JSX.Element => {
  return (
    <div>
      <Header />

      <main></main>

      <Toaster />
      <Footer />
    </div>
  );
};
