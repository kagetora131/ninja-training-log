# 忍者修行ログ (Ninja Training Log)

記録をつけるとXPが貯まり、忍者ランクが上がっていく習慣化トラッキングアプリ。
「忍者クイズ」「忍者パークシフト」に続く、忍者影虎ポートフォリオ第3作目。

## 技術スタック(すべて無料・OSSライセンス)

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- [Supabase](https://supabase.com/)(Auth + Postgres、無料枠)
- Recharts(週次・月次グラフ)

## セットアップ

```bash
npm install
cp .env.example .env   # VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY を設定
npm run dev
```

`.env` はコミットしない(`.gitignore` 済み)。`VITE_SUPABASE_ANON_KEY` はブラウザに
公開される前提の鍵で、アクセス制御はデータベース側の Row Level Security で行っている。

### Supabaseプロジェクト

- プロジェクト名: `ninja-training-log`(組織 `Kagetora`、リージョン `ap-northeast-1`)
- スキーマ定義は [`supabase/migrations/`](supabase/migrations/) に記録済み
  (Supabase MCPで適用したものと同一)。
- **新規登録はメール確認が必須**(Supabaseのデフォルト設定)。登録後、届いた確認メールの
  リンクを開いてからログインする。

## データモデル

```
auth.users            -- Supabase Auth標準
training_logs          -- id, user_id, category, amount, unit, memo, logged_at, log_date
user_progress           -- user_id, total_xp, current_rank, current_streak, longest_streak, last_log_date
```

- `training_logs` への INSERT / DELETE をトリガーが検知し、`user_progress` の
  XP・ランク・連続記録日数を自動更新する(`handle_training_log_insert` /
  `handle_training_log_delete`、いずれも `SECURITY DEFINER`)。
- 新規ユーザー登録時は `handle_new_user` トリガーが `user_progress` の初期行を自動作成する。
- 両テーブルとも Row Level Security を有効化し、`auth.uid() = user_id` の行のみ
  読み書きできる。

## ランク設計

| ランク | 必要累計XP | 称号(ja) | 称号(en) |
|---|---|---|---|
| 1 | 0 | 見習い忍者 | Ninja Apprentice |
| 2 | 100 | 下忍 | Genin |
| 3 | 300 | 中忍 | Chunin |
| 4 | 700 | 上忍(最高ランク) | Jonin (highest rank) |

英語版のランク名は下忍/中忍/上忍(Genin/Chunin/Jonin)は英語圏でも通じる語として
ローマ字表記のまま残し、見習い忍者のみ意味が伝わる英訳にしている
(`src/lib/i18n.tsx` の `RANK_TITLES`)。「忍者頭領」ランクは、実際の忍術修行における
各種資格・段位を踏まえ大仰すぎるとの判断で廃止し、上忍を最高ランクとした
(2026-09-04)。

記録1件ごとのXPはカテゴリ別(`calc_log_xp` / `src/lib/rank.ts`の`CATEGORY_XP`で定義、両者は同期させること):

| カテゴリ | XP |
|---|---|
| 稽古 | 15 |
| 学習 | 20 |
| 読書 | 10 |
| 瞑想 | 15 |
| その他 | 10 |

連続記録ボーナス等は将来拡張。

## 実装済みのMVP範囲

1. Supabase Authでのメール登録・ログイン・ログアウト
2. `training_logs` の追加・一覧表示・削除
3. XP計算・ランク判定(DBトリガーで自動計算、ランクアップ時にモーダル演出)
4. 週次(直近7日・日別)・月次(直近4週・週別)グラフ(Recharts)
5. 連続記録日数(ストリーク)・最長記録日数の表示

## デモ用データ

[`ninja_training_log_dummy_data.json`](ninja_training_log_dummy_data.json) を元に、Supabase上へ
以下の3ユーザーを投入済み(パスワードは共通で `NinjaDemo2026`)。ストリーク計算・ランク判定の
動作確認用。

| メール | タイプ | 累計XP | ランク | 連続記録 |
|---|---|---|---|---|
| `kenta.sato@example.com` | 継続タイプ | 215 | 下忍 | 14日 |
| `aiko.yamada@example.com` | 三日坊主タイプ | 80 | 見習い忍者 | 1日(最長2日) |
| `ryo.tanaka@example.com` | 直近サボりタイプ | 105 | 下忍 | 7日(直近12日間記録なし) |

このほか、記録が空のシンプルなデモアカウントとして `demo@ninja-training-log.invalid` /
`NinjaDemo2026` も利用可能。

### 既知の簡易仕様

- 記録を削除するとXPは戻すが、ストリーク(連続記録日数)は遡って再計算しない。
- デイリー/ウィークリーのランキング機能は未実装(CLAUDE.mdで「後回しでOK」とされている範囲)。
- ソーシャルログイン(Google等)は未対応。メール+パスワード認証のみ。
