# ベースイメージにOpenJDKを使用
FROM openjdk:21-jdk-slim

# 作業ディレクトリを作成
WORKDIR /app

# Mavenプロジェクトをコピーしてビルド
COPY . /app
COPY wait-for-mysql.sh /app/wait-for-mysql.sh
RUN apt-get update && apt-get install -y default-mysql-client
RUN chmod +x /app/wait-for-mysql.sh
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# ポート番号8080を公開
EXPOSE 8080

# アプリケーションの起動コマンド
CMD ["/app/wait-for-mysql.sh", "db", "java", "-jar", "target/project-root-0.0.1-SNAPSHOT.jar"]