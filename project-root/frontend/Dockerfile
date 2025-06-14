# Node.jsの公式イメージを使用
FROM node:20 AS builder

# 作業ディレクトリを作成
WORKDIR /app

# パッケージファイルをコピーして依存関係をインストール
#COPY . /app
COPY package*.json ./

# ビルド時にバックエンド URL を埋め込む
#ARG REACT_APP_BACKEND_URL
#ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
#--build-argで渡さない自動ビルドのためコメントアウト

# 依存関係をインストール
RUN npm install

# アプリケーションファイルをコピー
COPY . .

#prod用の静的ビルド
RUN npm run build

# ポート番号3000を公開
# EXPOSE 3000

# 開発モードでの起動コマンド
# CMD ["npm", "start"]

# ── ここからはビルド成果物を配信するイメージ ──
FROM nginx:alpine
# (オプション) デフォルト conf を消して自前 nginx.conf を使いたいとき
# 既存 default.conf を削除
RUN rm /etc/nginx/conf.d/default.conf
# ローカルの default.conf をコピー
COPY default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build/ /usr/share/nginx/html/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]