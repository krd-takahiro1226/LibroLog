## このドキュメントの目的
Dockerに移行したが、コマンドを調べるのが面倒なので使う頻度が多いコマンドをまとめる(随時更新する)
## コマンド
### Dockerの立ち上げ(build+run)
project-root配下(docker-compose.yamlファイルがあるディレクトリで実行)
```
docker-compose up --build -d
```
### Dockerの終了
```
docker compose down
```
### コンテナ情報の確認
#### コンテナ情報出力(起動中のみ)
基本的にこれで問題ない想定
```
docker ps
```
#### 全てのコンテナ情報出力
```
docker ps -a
```
### コンテナへの接続
#### MySQLコンテナ
MySQLコンテナが「mysql」である前提
```
docker exec -it mysql mysql -u root -p  
```
#### フロントエンドンテナ
フロントエンドンテナが「project-root-frontend-1」である前提
```
docker exec -it project-root-frontend-1 bash
```
#### バックエンドコンテナ
バックエンドコンテナが「project-root-backend-1」である前提
```
docker exec -it project-root-backend-1 bash
```
#### バッチ処理コンテナ
バッチ処理コンテナが「project-root-batch-1」である前提 \
project-root/batch配下で以下のコマンドを実行する
```
docker exec -it project-root-batch-1 \
java -jar target/batch-0.0.1-SNAPSHOT.jar --server.port=8081 --run
```
