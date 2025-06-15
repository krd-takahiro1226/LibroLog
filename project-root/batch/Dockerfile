# ベースイメージにOpenJDKを使用
FROM openjdk:21-jdk-slim

# 作業ディレクトリを作成
WORKDIR /app

# プロジェクトと wait スクリプトをコピー
COPY . /app
COPY wait-for-mysql.sh /app/wait-for-mysql.sh

# MySQL クライアントをインストールして、wait スクリプトを実行可能に
RUN apt-get update && apt-get install -y default-mysql-client
RUN chmod +x /app/wait-for-mysql.sh
RUN chmod +x ./mvnw

# アプリケーションをビルド（テストスキップ）
RUN ./mvnw clean package -DskipTests

# wait スクリプトを使ってバッチアプリを起動（main classがバッチ）
CMD ["/app/wait-for-mysql.sh", "db", "java", "-jar", "target/batch-0.0.1-SNAPSHOT.jar"]
