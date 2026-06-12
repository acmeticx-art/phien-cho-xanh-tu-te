import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jlksmmacpdpcxjmaguob.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsa3NtbWFjcGRwY3hqbWFndW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjgyMTksImV4cCI6MjA5Njc0NDIxOX0.YhLxC3irB5c_qREhvj5sGrVDkSBcgKAY-I69vfquXyE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const STORAGE_BUCKET = 'ho-so-dang-ky';

export async function uploadFileToStorage(file: File, folder: string = 'uploads'): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file);
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}
