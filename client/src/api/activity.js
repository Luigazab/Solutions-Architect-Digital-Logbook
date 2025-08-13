import { supabase } from '../supabaseClient';

export async function insertActivity(activity) {
  const { data, error } = await supabase
    .from('activities')
    .insert([activity]);
  return { data, error };
}