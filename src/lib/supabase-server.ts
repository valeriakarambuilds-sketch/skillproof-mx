import { createClient } from '@supabase/supabase-js';
export async function authenticatedClient(request: Request) {
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url || !key) return null;
 const token=request.headers.get('authorization')?.replace(/^Bearer /,'');
 if(!token) throw new Error('Inicia sesión con Google antes de guardar evidencia.');
 const client=createClient(url,key,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await client.auth.getUser(token);
 if(error || !data.user) throw new Error('Tu sesión venció. Inicia sesión de nuevo.');
 return {client,user:data.user};
}
