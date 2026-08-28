-- カテゴリ別のXP付与量(稽古=15/学習=20/読書=10/瞑想=15/その他=10)
create or replace function public.calc_log_xp(cat public.training_category)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case cat
    when 'exercise' then 15
    when 'study' then 20
    when 'reading' then 10
    when 'meditation' then 15
    else 10
  end;
$$;

create or replace function public.handle_training_log_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_xp_gained integer;
  v_prev_last_date date;
  v_prev_streak integer;
  v_new_streak integer;
  v_new_total_xp integer;
begin
  v_xp_gained := public.calc_log_xp(new.category);

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

  select total_xp + v_xp_gained into v_new_total_xp
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

create or replace function public.handle_training_log_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_xp_gained integer;
  v_new_total_xp integer;
begin
  v_xp_gained := public.calc_log_xp(old.category);

  select greatest(total_xp - v_xp_gained, 0) into v_new_total_xp
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

revoke execute on function public.handle_training_log_insert() from public, anon, authenticated;
revoke execute on function public.handle_training_log_delete() from public, anon, authenticated;
