-- カテゴリ enum
create type public.training_category as enum ('exercise', 'study', 'reading', 'other');

-- 進捗テーブル(ユーザー1人につき1行)
create table public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_xp integer not null default 0,
  current_rank smallint not null default 1,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_log_date date,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

-- 記録テーブル
create table public.training_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category public.training_category not null,
  amount numeric not null check (amount > 0),
  unit text not null default '分',
  memo text,
  logged_at timestamptz not null default now(),
  log_date date not null default (timezone('Asia/Tokyo', now()))::date,
  created_at timestamptz not null default now()
);

create index training_logs_user_id_logged_at_idx on public.training_logs (user_id, logged_at desc);

alter table public.training_logs enable row level security;

create policy "Users can view own logs"
  on public.training_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own logs"
  on public.training_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own logs"
  on public.training_logs for delete
  using (auth.uid() = user_id);

-- XPからランクを算出
create or replace function public.calc_rank(xp integer)
returns smallint
language sql
immutable
set search_path = ''
as $$
  select case
    when xp >= 1500 then 5
    when xp >= 700 then 4
    when xp >= 300 then 3
    when xp >= 100 then 2
    else 1
  end;
$$;

-- 新規ユーザー登録時に進捗行を自動作成
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_progress (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 記録追加時: XP加算・ストリーク更新・ランク再判定
create or replace function public.handle_training_log_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_xp_per_log constant integer := 20;
  v_prev_last_date date;
  v_prev_streak integer;
  v_new_streak integer;
  v_new_total_xp integer;
begin
  select last_log_date, current_streak into v_prev_last_date, v_prev_streak
  from public.user_progress
  where user_id = new.user_id
  for update;

  if v_prev_last_date is null then
    v_new_streak := 1;
  elsif v_prev_last_date = new.log_date then
    v_new_streak := coalesce(v_prev_streak, 1);
  elsif v_prev_last_date = new.log_date - 1 then
    v_new_streak := coalesce(v_prev_streak, 0) + 1;
  else
    v_new_streak := 1;
  end if;

  select total_xp + v_xp_per_log into v_new_total_xp
  from public.user_progress where user_id = new.user_id;

  update public.user_progress
  set
    total_xp = v_new_total_xp,
    current_rank = public.calc_rank(v_new_total_xp),
    current_streak = v_new_streak,
    longest_streak = greatest(longest_streak, v_new_streak),
    last_log_date = greatest(coalesce(last_log_date, new.log_date), new.log_date),
    updated_at = now()
  where user_id = new.user_id;

  return new;
end;
$$;

create trigger on_training_log_insert
  after insert on public.training_logs
  for each row execute function public.handle_training_log_insert();

-- 記録削除時: XPを戻す(ストリークは遡って再計算しない簡易仕様)
create or replace function public.handle_training_log_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_xp_per_log constant integer := 20;
  v_new_total_xp integer;
begin
  select greatest(total_xp - v_xp_per_log, 0) into v_new_total_xp
  from public.user_progress where user_id = old.user_id;

  update public.user_progress
  set
    total_xp = v_new_total_xp,
    current_rank = public.calc_rank(v_new_total_xp),
    updated_at = now()
  where user_id = old.user_id;

  return old;
end;
$$;

create trigger on_training_log_delete
  after delete on public.training_logs
  for each row execute function public.handle_training_log_delete();
