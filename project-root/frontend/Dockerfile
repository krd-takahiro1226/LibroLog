# Node.jsの公式イメージを使用
FROM node:20

# 作業ディレクトリを作成
WORKDIR /app

# パッケージファイルをコピーして依存関係をインストール
COPY . /app

# 依存関係をインストール
RUN npm install

# アプリケーションファイルをコピー
COPY . .

# ポート番号3000を公開
EXPOSE 3000

# 開発モードでの起動コマンド
CMD ["npm", "start"]
