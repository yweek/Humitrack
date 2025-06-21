import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Cigar, TastingNote, UserTag } from '../types';

export function useSupabaseData(userId: string | undefined) {
  const [cigars, setCigars] = useState<Cigar[]>([]);
  const [wishlist, setWishlist] = useState<Cigar[]>([]);
  const [tastingNotes, setTastingNotes] = useState<TastingNote[]>([]);
  const [userTags, setUserTags] = useState<UserTag[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data when user changes
  useEffect(() => {
    if (userId) {
      loadAllData();
    } else {
      // Clear data when user logs out
      setCigars([]);
      setWishlist([]);
      setTastingNotes([]);
      setUserTags([]);
      setLoading(false);
    }
  }, [userId]);

  const loadAllData = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      await Promise.all([
        loadCigars(),
        loadWishlist(),
        loadTastingNotes(),
        loadUserTags()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCigars = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('cigars')
      .select('*')
      .eq('user_id', userId)
      .eq('in_wishlist', false);
    
    if (error) {
      console.error('Error loading cigars:', error);
    } else {
      // Map database column names to frontend field names
      const mappedData = (data || []).map(cigar => ({
        id: cigar.id,
        brand: cigar.brand,
        name: cigar.name,
        size: cigar.size,
        format: cigar.format,
        country: cigar.country,
        strength: cigar.strength,
        wrapper: cigar.wrapper,
        price: cigar.price,
        quantity: cigar.quantity,
        ringGauge: cigar.ring_gauge,
        factory: cigar.factory,
        releaseYear: cigar.release_year,
        purchaseLocation: cigar.purchase_location,
        lowStockAlert: cigar.low_stock_alert,
        addedDate: cigar.added_date,
        agingStartDate: cigar.aging_start_date,
        tags: cigar.tags,
        photo: cigar.photo,
        inWishlist: cigar.in_wishlist
      }));
      setCigars(mappedData);
    }
  };

  const loadWishlist = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('cigars')
      .select('*')
      .eq('user_id', userId)
      .eq('in_wishlist', true);
    
    if (error) {
      console.error('Error loading wishlist:', error);
    } else {
      // Map database column names to frontend field names
      const mappedData = (data || []).map(cigar => ({
        id: cigar.id,
        brand: cigar.brand,
        name: cigar.name,
        size: cigar.size,
        format: cigar.format,
        country: cigar.country,
        strength: cigar.strength,
        wrapper: cigar.wrapper,
        price: cigar.price,
        quantity: cigar.quantity,
        ringGauge: cigar.ring_gauge,
        factory: cigar.factory,
        releaseYear: cigar.release_year,
        purchaseLocation: cigar.purchase_location,
        lowStockAlert: cigar.low_stock_alert,
        addedDate: cigar.added_date,
        agingStartDate: cigar.aging_start_date,
        tags: cigar.tags,
        photo: cigar.photo,
        inWishlist: cigar.in_wishlist
      }));
      setWishlist(mappedData);
    }
  };

  const loadTastingNotes = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('tasting_notes')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error loading tasting notes:', error);
    } else {
      // Map database column names to frontend field names
      const mappedData = (data || []).map(note => ({
        id: note.id,
        cigarId: note.cigar_id,
        rating: note.rating,
        strengthRating: note.strength_rating,
        aromaRating: note.aroma_rating,
        burnRating: note.burn_rating,
        drawRating: note.draw_rating,
        comment: note.comment,
        tastingNotes: note.tasting_notes,
        smokedDate: note.smoked_date,
        agingTime: note.aging_time,
        photos: note.photos
      }));
      setTastingNotes(mappedData);
    }
  };

  const loadUserTags = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('user_tags')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error loading user tags:', error);
    } else {
      setUserTags(data || []);
    }
  };

  const addCigar = async (cigarData: Omit<Cigar, 'id'>) => {
    if (!userId) return;

    // Map frontend field names to database column names
    const dbData = {
      brand: cigarData.brand,
      name: cigarData.name,
      size: cigarData.size,
      format: cigarData.format,
      country: cigarData.country,
      strength: cigarData.strength,
      wrapper: cigarData.wrapper,
      price: cigarData.price,
      quantity: cigarData.quantity,
      ring_gauge: cigarData.ringGauge,
      factory: cigarData.factory,
      release_year: cigarData.releaseYear,
      purchase_location: cigarData.purchaseLocation,
      low_stock_alert: cigarData.lowStockAlert,
      added_date: cigarData.addedDate,
      aging_start_date: cigarData.agingStartDate,
      tags: cigarData.tags,
      photo: cigarData.photo,
      user_id: userId,
      in_wishlist: false
    };

    const { data, error } = await supabase
      .from('cigars')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Error adding cigar:', error);
      throw error;
    } else {
      // Map database column names back to frontend field names
      const mappedData = {
        id: data.id,
        brand: data.brand,
        name: data.name,
        size: data.size,
        format: data.format,
        country: data.country,
        strength: data.strength,
        wrapper: data.wrapper,
        price: data.price,
        quantity: data.quantity,
        ringGauge: data.ring_gauge,
        factory: data.factory,
        releaseYear: data.release_year,
        purchaseLocation: data.purchase_location,
        lowStockAlert: data.low_stock_alert,
        addedDate: data.added_date,
        agingStartDate: data.aging_start_date,
        tags: data.tags,
        photo: data.photo,
        inWishlist: data.in_wishlist
      };
      setCigars(prev => [...prev, mappedData]);
    }
  };

  const updateCigar = async (updatedCigar: Cigar) => {
    if (!userId) return;

    // Map frontend field names to database column names
    const dbData = {
      brand: updatedCigar.brand,
      name: updatedCigar.name,
      size: updatedCigar.size,
      format: updatedCigar.format,
      country: updatedCigar.country,
      strength: updatedCigar.strength,
      wrapper: updatedCigar.wrapper,
      price: updatedCigar.price,
      quantity: updatedCigar.quantity,
      ring_gauge: updatedCigar.ringGauge,
      factory: updatedCigar.factory,
      release_year: updatedCigar.releaseYear,
      purchase_location: updatedCigar.purchaseLocation,
      low_stock_alert: updatedCigar.lowStockAlert,
      added_date: updatedCigar.addedDate,
      aging_start_date: updatedCigar.agingStartDate,
      tags: updatedCigar.tags,
      photo: updatedCigar.photo
    };

    const { error } = await supabase
      .from('cigars')
      .update(dbData)
      .eq('id', updatedCigar.id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating cigar:', error);
      throw error;
    } else {
      setCigars(prev => prev.map(cigar => 
        cigar.id === updatedCigar.id ? updatedCigar : cigar
      ));
    }
  };

  const deleteCigar = async (id: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('cigars')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting cigar:', error);
      throw error;
    } else {
      setCigars(prev => prev.filter(cigar => cigar.id !== id));
      // Also delete related tasting notes
      setTastingNotes(prev => prev.filter(note => note.cigarId !== id));
    }
  };

  const addToWishlist = async (cigarData: Omit<Cigar, 'id'>) => {
    if (!userId) return;

    // Map frontend field names to database column names
    const dbData = {
      brand: cigarData.brand,
      name: cigarData.name,
      size: cigarData.size,
      format: cigarData.format,
      country: cigarData.country,
      strength: cigarData.strength,
      wrapper: cigarData.wrapper,
      price: cigarData.price,
      quantity: cigarData.quantity,
      ring_gauge: cigarData.ringGauge,
      factory: cigarData.factory,
      release_year: cigarData.releaseYear,
      purchase_location: cigarData.purchaseLocation,
      low_stock_alert: cigarData.lowStockAlert,
      added_date: cigarData.addedDate,
      aging_start_date: cigarData.agingStartDate,
      tags: cigarData.tags,
      photo: cigarData.photo,
      user_id: userId,
      in_wishlist: true
    };

    const { data, error } = await supabase
      .from('cigars')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    } else {
      // Map database column names back to frontend field names
      const mappedData = {
        id: data.id,
        brand: data.brand,
        name: data.name,
        size: data.size,
        format: data.format,
        country: data.country,
        strength: data.strength,
        wrapper: data.wrapper,
        price: data.price,
        quantity: data.quantity,
        ringGauge: data.ring_gauge,
        factory: data.factory,
        releaseYear: data.release_year,
        purchaseLocation: data.purchase_location,
        lowStockAlert: data.low_stock_alert,
        addedDate: data.added_date,
        agingStartDate: data.aging_start_date,
        tags: data.tags,
        photo: data.photo,
        inWishlist: data.in_wishlist
      };
      setWishlist(prev => [...prev, mappedData]);
    }
  };

  const removeFromWishlist = async (id: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('cigars')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    } else {
      setWishlist(prev => prev.filter(cigar => cigar.id !== id));
    }
  };

  const moveToHumidor = async (cigar: Cigar) => {
    if (!userId) return;

    const { error } = await supabase
      .from('cigars')
      .update({ in_wishlist: false })
      .eq('id', cigar.id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error moving to humidor:', error);
      throw error;
    } else {
      setWishlist(prev => prev.filter(w => w.id !== cigar.id));
      setCigars(prev => [...prev, { ...cigar, inWishlist: false }]);
    }
  };

  const addTastingNote = async (noteData: Omit<TastingNote, 'id'>) => {
    if (!userId) return;

    // Map frontend field names to database column names
    const dbData = {
      user_id: userId,
      cigar_id: noteData.cigarId,
      rating: noteData.rating,
      strength_rating: noteData.strengthRating,
      aroma_rating: noteData.aromaRating,
      burn_rating: noteData.burnRating,
      draw_rating: noteData.drawRating,
      comment: noteData.comment,
      tasting_notes: noteData.tastingNotes,
      smoked_date: noteData.smokedDate,
      aging_time: noteData.agingTime,
      photos: noteData.photos
    };

    const { data, error } = await supabase
      .from('tasting_notes')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Error adding tasting note:', error);
      throw error;
    } else {
      // Map database column names back to frontend field names
      const mappedData = {
        id: data.id,
        cigarId: data.cigar_id,
        rating: data.rating,
        strengthRating: data.strength_rating,
        aromaRating: data.aroma_rating,
        burnRating: data.burn_rating,
        drawRating: data.draw_rating,
        comment: data.comment,
        tastingNotes: data.tasting_notes,
        smokedDate: data.smoked_date,
        agingTime: data.aging_time,
        photos: data.photos
      };
      setTastingNotes(prev => [...prev, mappedData]);
    }
  };

  const deleteTastingNote = async (id: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('tasting_notes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting tasting note:', error);
      throw error;
    } else {
      setTastingNotes(prev => prev.filter(note => note.id !== id));
    }
  };

  const createTag = async (tagData: Omit<UserTag, 'id'>) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('user_tags')
      .insert([{ ...tagData, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error('Error creating tag:', error);
      throw error;
    } else {
      setUserTags(prev => [...prev, data]);
    }
  };

  return {
    cigars,
    wishlist,
    tastingNotes,
    userTags,
    loading,
    addCigar,
    updateCigar,
    deleteCigar,
    addToWishlist,
    removeFromWishlist,
    moveToHumidor,
    addTastingNote,
    deleteTastingNote,
    createTag,
  };
}