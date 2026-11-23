import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={'relative h-full'}>
      <Header />
      <main className={'mt-[89px] max-w-7xl min-h-[calc(100vh-89px)] mx-auto px-4 md:px-6 lg:px-10'}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
