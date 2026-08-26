-- トリガー関数はRPC経由で直接叩けないようにする(トリガー実行自体には影響しない)
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_training_log_insert() from public, anon, authenticated;
revoke execute on function public.handle_training_log_delete() from public, anon, authenticated;
