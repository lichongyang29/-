import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const url = 'https://tdxzdcoghbncmanchrxa.supabase.co';
const key =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeHpkY29naGJuY21hbmNocnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU1OTE3MzMsImV4cCI6MjA0MTE2NzczM30.U4w_bq9yL--J8XjwFjEdkdstiIQYTgd_tTRYSakDkhE';
export const supabase = createClient(url, key);
