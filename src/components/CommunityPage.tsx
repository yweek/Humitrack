import React, { useState, useEffect } from 'react';
import { Review } from '../types';

const LOCAL_STORAGE_KEY = 'humitrack_reviews';

// Faux commentaires pour simuler une communauté active
const mockReviews: Review[] = [
  {
    id: 'm1',
    author: 'CigarLover92',
    comment: 'Just tried the new Cohiba Robusto, amazing draw and flavor! Highly recommend to everyone 🍂',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likes: 7,
    photo: undefined,
  },
  {
    id: 'm2',
    author: 'HumiQueen',
    comment: 'What is your favorite pairing with a medium-bodied cigar? I love a good espresso ☕️',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likes: 4,
    photo: undefined,
  },
  {
    id: 'm3',
    author: 'SmokeRingKing',
    comment: 'Anyone else aging their cigars? Share your best results! 🕰️',
    date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    likes: 3,
    photo: undefined,
  },
  {
    id: 'm4',
    author: 'AshArtist',
    comment: 'Check out this ash! Held for almost 4 inches. #ashgame',
    date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    likes: 5,
    photo: undefined,
  },
];

const avatarColors = [
  '#F59E42', '#C18D5A', '#7E7C7B', '#9E5A4A', '#3C2F2F', '#E8D5B0', '#F5E8D0'
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getReviewsFromStorage(): Review[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveReviewsToStorage(reviews: Review[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
}

export const CommunityPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Affiche d'abord les faux avis, puis les vrais
    setReviews([...mockReviews, ...getReviewsFromStorage()]);
  }, []);

  const handleAddReview = () => {
    if (!author || !comment) return;
    const newReview: Review = {
      id: Date.now().toString(),
      author,
      comment,
      date: new Date().toISOString(),
      likes: 0,
      photo,
    };
    const allReviews = [newReview, ...getReviewsFromStorage()];
    saveReviewsToStorage(allReviews);
    setReviews([...mockReviews, ...allReviews]);
    setAuthor('');
    setComment('');
    setPhoto(undefined);
  };

  const handleLike = (id: string) => {
    // Like sur les vrais avis uniquement
    if (id.startsWith('m')) return;
    const allReviews = getReviewsFromStorage();
    const updated = allReviews.map(r =>
      r.id === id ? { ...r, likes: r.likes + 1 } : r
    );
    saveReviewsToStorage(updated);
    setReviews([...mockReviews, ...updated]);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: '#9E5A4A', marginBottom: 8, textAlign: 'center' }}>Community Forum</h2>
      <p style={{ color: '#7E7C7B', textAlign: 'center', marginBottom: 24 }}>
        Share your experiences, ask questions, and connect with other cigar lovers!
      </p>
      <div style={{
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 4px 20px rgba(60,47,47,0.08)',
        padding: 16,
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#E8D5B0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#9E5A4A',
            fontSize: 18,
          }}>{author ? getInitials(author) : '+'}</div>
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            style={{ flex: 1, border: '1px solid #E8D5B0', borderRadius: 8, padding: 10, fontSize: 15 }}
          />
        </div>
        <textarea
          placeholder="Share your thoughts, reviews or questions..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ width: '100%', border: '1px solid #E8D5B0', borderRadius: 8, padding: 10, fontSize: 15, minHeight: 60 }}
        />
        <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'block', margin: '8px 0' }} />
        <button
          onClick={handleAddReview}
          style={{
            background: 'linear-gradient(135deg, #9E5A4A, #C18D5A)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '12px 0',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(158,90,74,0.10)',
            transition: 'all 0.2s',
          }}
        >Post</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {reviews.length === 0 && <li style={{ textAlign: 'center', color: '#7E7C7B' }}>No messages yet.</li>}
        {reviews.map((r, idx) => (
          <li key={r.id} style={{
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 2px 12px rgba(60,47,47,0.07)',
            marginBottom: 18,
            padding: 16,
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
            position: 'relative',
          }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: getAvatarColor(r.author),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: 'white',
              fontSize: 20,
              flexShrink: 0,
            }}>{getInitials(r.author)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#3C2F2F', fontSize: 16 }}>{r.author}</div>
              <div style={{ color: '#7E7C7B', fontSize: 13, marginBottom: 4 }}>{new Date(r.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
              <div style={{ color: '#3C2F2F', fontSize: 15, marginBottom: 6 }}>{r.comment}</div>
              {r.photo && <img src={r.photo} alt="photo" style={{ maxWidth: '100%', marginTop: 8, borderRadius: 8, boxShadow: '0 2px 8px rgba(60,47,47,0.10)' }} />}
              <button
                onClick={() => handleLike(r.id)}
                disabled={r.id.startsWith('m')}
                style={{
                  marginTop: 8,
                  background: r.id.startsWith('m') ? '#E8D5B0' : 'linear-gradient(135deg, #F59E42, #C18D5A)',
                  color: r.id.startsWith('m') ? '#7E7C7B' : 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 16px',
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: r.id.startsWith('m') ? 'not-allowed' : 'pointer',
                  opacity: r.id.startsWith('m') ? 0.7 : 1,
                  boxShadow: '0 1px 4px rgba(158,90,74,0.08)',
                  transition: 'all 0.2s',
                }}
              >👍 {r.likes}</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}; 