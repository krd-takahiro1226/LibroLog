# メール送信設定ガイド

## 概要

本アプリケーションは、OTP送信において以下の2つのメール送信方式をサポートしています：

1. **ローカル環境**: mailpit（開発・テスト用）
2. **本番環境**: Mailjet API（商用メール送信サービス）

## 環境変数設定

### ローカル環境（mailpit使用）

```bash
# メール送信方式をローカルに設定
MAIL_EXTERNAL_ENABLED=true
```

### 本番環境（Mailjet使用）

```bash
# メール送信方式を外部サービスに設定
MAIL_EXTERNAL_ENABLED=true

# Mailjet API認証情報
MAILJET_API_KEY=002898db257259df4509faf9b7752cb0
MAILJET_API_SECRET=005cab1a33784797d74efb15ba89d3f4

# 送信者情報
MAIL_FROM_EMAIL=system-sender@librolog.com
MAIL_FROM_NAME=Libro Log

# 文字エンコーディング設定（日本語対応）
MAIL_ENCODING=UTF-8
```

## 設定の切り替え方法

### Docker Compose環境での設定

`docker-compose.yml`のbackendサービスのenvironment部分に環境変数を追加：

```yaml
services:
  backend:
    environment:
      # 既存の設定...
      MAIL_EXTERNAL_ENABLED: "true"
      MAILJET_API_KEY: "your_api_key"
      MAILJET_API_SECRET: "your_api_secret"
      MAIL_FROM_EMAIL: "system-sender@librolog.com"
      MAIL_FROM_NAME: "Libro Log"
```

### 本番環境でのデプロイ時

環境変数として以下を設定：

```bash
export MAIL_EXTERNAL_ENABLED=true
export MAILJET_API_KEY=your_actual_api_key
export MAILJET_API_SECRET=your_actual_api_secret
export MAIL_FROM_EMAIL=system-sender@librolog.com
export MAIL_FROM_NAME="Libro Log"
```

## 動作確認

### ローカル環境

1. `MAIL_EXTERNAL_ENABLED=false`に設定
2. アプリケーションを起動
3. ユーザー登録でOTP送信をテスト
4. http://localhost:19980 でmailpitのWeb UIを確認

### 本番環境

1. `MAIL_EXTERNAL_ENABLED=true`と Mailjet の認証情報を設定
2. アプリケーションを起動
3. ユーザー登録でOTP送信をテスト
4. 実際のメールアドレスにメールが送信されることを確認

## トラブルシューティング

### よくあるエラー

1. **401 Unauthorized**: Mailjet APIキーまたはシークレットが間違っている
2. **外部メール送信に失敗**: ネットワーク接続またはMailjetサービスの問題
3. **ローカルメール送信に失敗**: mailpitコンテナが起動していない
4. **日本語文字化け**: 文字エンコーディング設定（MAIL_ENCODING）が正しく設定されていない

### ログの確認

アプリケーションログで以下のメッセージを確認：

- 成功時: `外部メール送信サービスでメールを送信しました: {email}`
- 失敗時: `外部メール送信に失敗しました: {email}`

## 文字エンコーディング対応

### 実装内容

1. **UTF-8エンコーディングの明示的指定**
   - application.propertiesに`mail.encoding`と`spring.mail.default-encoding`を追加
   - ローカル・外部メール送信の両方でUTF-8を確実に指定

2. **ローカルメール送信（mailpit）**
   - MimeMessageHelperでエンコーディングを明示指定
   - Content-Typeヘッダーにcharsetを設定
   - 送信者名もエンコーディングを指定

3. **外部メール送信（Mailjet）**
   - HTTPリクエストヘッダーにcharsetを指定
   - リクエストボディをUTF-8でエンコード

### 設定可能なエンコーディング

デフォルトはUTF-8ですが、環境変数で変更可能：

```bash
MAIL_ENCODING=UTF-8    # デフォルト（推奨）
MAIL_ENCODING=ISO-2022-JP  # 日本語環境で古いシステム対応が必要な場合
```

## セキュリティ注意事項

- Mailjet APIキーとシークレットは環境変数で管理し、ソースコードにハードコードしない
- 本番環境では適切なアクセス制御を設定する
- APIキーの定期的なローテーションを検討する