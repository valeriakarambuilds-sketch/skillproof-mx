import { NextResponse } from 'next/server';
import { authenticatedClient } from '@/lib/supabase-server';
export async function GET(request: Request) {
 try {
  const auth=await authenticatedClient(request);
  if(!auth)return NextResponse.json({error:'Supabase no está configurado; no hay reportes guardados.'},{status:503});
  const {data,error}=await auth.client.from('skillproof_reports').select('id,created_at,payload').eq('user_id',auth.user.id).order('created_at',{ascending:false}).limit(1);
  if(error)return NextResponse.json({error:'No se pudo recuperar el reporte privado.'},{status:503});
  return NextResponse.json({report:data?.[0]||null},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'Inicia sesión para recuperar tu reporte.'},{status:401});}
}
