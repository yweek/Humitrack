import React, { useState, useEffect } from 'react';
import { Review } from '../types';

interface ReviewSectionProps {
  cigarId: string;
}

const LOCAL_STORAGE_KEY = 'humitrack_reviews';

function getReviewsFromStorage(): Review[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveReviewsToStorage(reviews: Review[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ cigarId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  useEffect(() => {
    const allReviews = getReviewsFromStorage();
    setReviews(allReviews.filter(r => r.cigarId === cigarId));
  }, [cigarId]);

  const handleAddReview = () => {
    if (!author || !comment) return;
    const newReview: Review = {
      id: Date.now().toString(),
      cigarId,
      author,
      rating,
      comment,
      photo,
      date: new Date().toISOString(),
      likes: 0,
    };
    const allReviews = getReviewsFromStorage();
    const updated = [newReview, ...allReviews];
    saveReviewsToStorage(updated);
    setReviews(updated.filter(r => r.cigarId === cigarId));
    setAuthor('');
    setComment('');
    setRating(5);
    setPhoto(undefined);
  };

  const handleLike = (id: string) => {
    const allReviews = getReviewsFromStorage();
    const updated = allReviews.map(r =>
      r.id === id ? { ...r, likes: r.likes + 1 } : r
    );
    saveReviewsToStorage(updated);
    setReviews(updated.filter(r => r.cigarId === cigarId));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h3>Avis de la communauté</h3>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Votre nom"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <textarea
          placeholder="Votre avis..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <label>Note :
          <input
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            style={{ width: 50, marginLeft: 8 }}
          /> / 5
        </label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'block', margin: '8px 0' }} />
        <button onClick={handleAddReview} style={{ width: '100%' }}>Poster l'avis</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {reviews.length === 0 && <li>Aucun avis pour ce cigare.</li>}
        {reviews.map(r => (
          <li key={r.id} style={{ border: '1px solid #ccc', borderRadius: 8, marginBottom: 12, padding: 12 }}>
            <div style={{ fontWeight: 'bold' }}>{r.author} <span style={{ color: '#888', fontSize: 12 }}>({new Date(r.date).toLocaleDateString()})</span></div>
            <div>Note : {r.rating} / 5</div>
            <div>{r.comment}</div>
            {r.photo && <img src={r.photo} alt="photo" style={{ maxWidth: '100%', marginTop: 8, borderRadius: 4 }} />}
            <button onClick={() => handleLike(r.id)} style={{ marginTop: 8 }}>👍 {r.likes}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}; 