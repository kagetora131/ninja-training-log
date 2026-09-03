-- 「忍者頭領」ランクを廃止し、上忍(4)を最高ランクにする
create or replace function public.calc_rank(xp integer)
returns smallint
language sql
immutable
set search_path = ''
as $$
  select case
    when xp >= 700 then 4
    when xp >= 300 then 3
    when xp >= 100 then 2
    else 1
  end;
$$;

-- 既存データに影響がないか確認(1500XP以上=旧ランク5のユーザーがいれば4へ補正)
update public.user_progress
set current_rank = public.calc_rank(total_xp)
where current_rank <> public.calc_rank(total_xp);
