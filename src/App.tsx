import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useAuth } from './hooks/useAuth';
import { useSupabaseData } from './hooks/useSupabaseData';
import Layout from './components/Layout';
import EnhancedHumidorPage from './components/EnhancedHumidorPage';
import WishlistPage from './components/WishlistPage';
import DiscoverPage from './components/DiscoverPage';
import RecommendationsPage from './components/RecommendationsPage';
import TastingNotesPage from './components/TastingNotesPage';
import HumidorPage from './components/HumidorPage';
import InsightsPage from './components/InsightsPage';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';

function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState('humidor');
  const [showAuthPage, setShowAuthPage] = useState(false);

  const {
    cigars,
    wishlist,
    tastingNotes,
    userTags,
    loading: dataLoading,
    addCigar,
    updateCigar,
    deleteCigar,
    addToWishlist,
    removeFromWishlist,
    moveToHumidor,
    addTastingNote,
    deleteTastingNote,
    createTag,
  } = useSupabaseData(user?.id);

  const handleSignOut = async () => {
    await signOut();
    setCurrentPage('humidor');
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleShowAuth = () => {
    setShowAuthPage(true);
  };

  const handleBackToLanding = () => {
    setShowAuthPage(false);
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5E8D0] via-[#E8D5B0] to-[#C18D5A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9E5A4A] mx-auto mb-4"></div>
          <p className="text-[#3C2F2F] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if user wants to authenticate
  if (showAuthPage && !user) {
    return (
      <AuthPage 
        onSignIn={signIn} 
        onSignUp={signUp} 
        onBack={handleBackToLanding}
      />
    );
  }

  // Show landing page if not logged in
  if (!user) {
    return <LandingPage 
      onSignIn={signIn}
      onSignUp={signUp}
      user={user}
    />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'humidor':
        return <EnhancedHumidorPage 
          cigars={cigars}
          tastingNotes={tastingNotes}
          userTags={userTags}
          onAddCigar={addCigar}
          onUpdateCigar={updateCigar}
          onDeleteCigar={deleteCigar}
          onAddTastingNote={addTastingNote}
          onCreateTag={createTag}
        />;
      case 'wishlist':
        return <WishlistPage wishlist={wishlist} onMoveToHumidor={moveToHumidor} onAddToWishlist={() => {}} onRemoveFromWishlist={() => {}} />;
      case 'discover':
        return <DiscoverPage onAddToWishlist={addToWishlist} onAddToHumidor={addCigar} />;
      case 'tasting-notes':
        return <TastingNotesPage tastingNotes={tastingNotes} cigars={cigars} />;
      case 'recommendations':
        return <InsightsPage cigars={cigars} />;
      default:
        return <h1>Dashboard</h1>;
    }
  };

  return (
    <>
      <Layout 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        userEmail={user.email}
        onSignOut={handleSignOut}
      >
        {renderPage()}
      </Layout>
      <Analytics />
    </>
  );
}

export default App;