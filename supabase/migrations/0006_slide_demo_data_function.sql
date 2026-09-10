-- デモ用3ユーザー(kenta/aiko/ryo)の記録を、各ペルソナの「最終記録からの経過日数」を
-- 保ったまま現在日付基準へスライドさせる。グラフや直近ストリークが常に生きて見えるようにする。
-- 実行は pg_cron が毎日担当(このファイル末尾で登録)。
create or replace function public.slide_demo_data_to_present()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  r record;
  -- 各デモユーザーの「今日から見た最終記録日のオフセット(日)」
  v_offsets jsonb := jsonb_build_object(
    'kenta.sato@example.com', 0,   -- 継続タイプ: 今日も記録
    'aiko.yamada@example.com', 2,  -- 三日坊主タイプ: 2日前が最後
    'ryo.tanaka@example.com', 7    -- 直近サボりタイプ: 1週間記録なし
  );
  v_target_last date;
  v_current_last date;
  v_delta int;
begin
  for r in
    select u.id, u.email
    from auth.users u
    where u.email in ('kenta.sato@example.com', 'aiko.yamada@example.com', 'ryo.tanaka@example.com')
  loop
    select max(log_date) into v_current_last
    from public.training_logs where user_id = r.id;
    if v_current_last is null then
      continue;
    end if;

    v_target_last := (timezone('Asia/Tokyo', now()))::date - ((v_offsets ->> r.email)::int);
    v_delta := v_target_last - v_current_last;
    if v_delta = 0 then
      continue;
    end if;

    update public.training_logs
    set logged_at = logged_at + make_interval(days => v_delta),
        log_date = log_date + v_delta
    where user_id = r.id;

    -- トリガーはINSERT/DELETEでしか発火しないため進捗行の日付は手動で追従
    -- (相対的なパターンは不変なのでXP・ストリーク値は変わらない)
    update public.user_progress
    set last_log_date = last_log_date + v_delta,
        updated_at = now()
    where user_id = r.id;
  end loop;
end;
$$;

revoke execute on function public.slide_demo_data_to_present() from public, anon, authenticated;
grant execute on function public.slide_demo_data_to_present() to service_role;

-- 毎日 00:00 JST にデモデータの日付を現在基準へスライド(DB内部で完結、外部シークレット不要)
create extension if not exists pg_cron;

select cron.schedule(
  'slide-demo-data-daily',
  '0 15 * * *', -- 15:00 UTC = 00:00 JST
  $$select public.slide_demo_data_to_present()$$
);
