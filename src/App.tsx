import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useSupabaseData } from './hooks/useSupabaseData';
import AuthForm from './components/AuthForm';
import Layout from './components/Layout';
import EnhancedHumidorPage from './components/EnhancedHumidorPage';
import WishlistPage from './components/WishlistPage';
import DiscoverPage from './components/DiscoverPage';
import RecommendationsPage from './components/RecommendationsPage';
import TastingNotesPage from './components/TastingNotesPage';
import HumidorPage from './components/HumidorPage';
import InsightsPage from './components/InsightsPage';

function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState('humidor');
  
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

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if not logged in
  if (!user) {
    return <AuthForm onSignIn={signIn} onSignUp={signUp} />;
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
    <Layout 
      currentPage={currentPage} 
      onPageChange={handlePageChange}
      userEmail={user.email}
      onSignOut={handleSignOut}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;