import { supabase } from "../supabaseClient.js";

export async function addMember(memberData) {
  const { data, error } = await supabase
    .from("members")
    .insert([memberData])
    .select();

  if (error) throw error;
  return data[0];
}

export async function getMembers() {
  const { data, error } = await supabase
    .from("members")
    .select("*");

  if (error) throw error;
  return data;
}
