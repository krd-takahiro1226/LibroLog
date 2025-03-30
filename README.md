# アプリ概要
- 読んだ本について名前、著者、読んだ回数、優先度を管理
  - 本の検索は楽天の書籍検索APIを叩いて取得
    - そこから登録ボタン押下(+必要な情報)で登録処理を行う

# 動作確認環境
- MySQL 8.4.3
  - ~最新は 8.4 LTS だが、当分8.0.37で進める~
  - 8.4系で進める（バージョンの指定は LibroLog/project-root/mysql-config/配下のDockerfileにて行う）
- Java 21.0.2
  - 最新は 21.0.3 (藤井はこのverで進めます)
- Maven
  - Apache Maven 3.9.6

# アプリの動かし方
- git pull main
- application.propertiesで、自環境のSQLパスワードに合わせる
- 必要なDBおよびテーブルの作成を行う
  - クエリは、sqlフォルダにある
- Reading_Records/backend/backend/配下で```mvn clean install```を実行
- BackendApplication.java でRunし、アプリケーションを起動する
- ```localhost:8080/login```に接続する
  - すでにユーザ作成済みの場合は、作成したユーザでログインする
  - 初めて利用する場合はユーザ作成から行う

# Docker移行後のアプリの動かし方
- git cloneした後に以下の作業をする必要がある
  - backend配下で以下のコマンドを実行
    - ```mvn -N io.takari:maven:wrapper```
  - application.yamlでAPI Keyの定義
  - wait-for-mysql.sh
    - VS Codeで「CRLF」→「LF」にする
- LibroLog/project-root/配下で、```docker-compose up --build```を実行
- コンテナイメージのビルドおよびコンテナの作成が行われ、作成されたコンテナが起動するのを確認する
  - ```docker ps```またはGUIで確認
  - コンテナは、project-root-backend、mysql、project-root-frontend の3つ作成される
- フロントは3000番ポートで立ち上がるので、ブラウザにて⁠```localhost:3000/login```に接続する

# フロントエンドのみ簡易的に動かす方法
- LibroLog/project-root/frontend/配下で、```npm start .```を実行
- ブラウザが立ち上がるので、⁠```localhost:3000/login```に接続する

# mysqlコンテナの入り方
- MySQLコンテナの名前を確認する
  - ```docker ps```
  - CONTAINER ID ,  IMAGE , … が表形式で出てくるので、NAMESを確認する
- ```docker exec -it <container-name> mysql -u root -p```コマンドを実行し、mysqlコンテナに入る
  - ```<container-name>```: MySQLコンテナの名前に置き換える
  - ```-u root```: root ユーザーで接続
  - ```-p```: パスワードの入力が求められる
- パスワードを聞かれるので、rootユーザーのパスワードを入力
- 必要なクエリを実行（```SHOW DATABASES;``` など）
 
# デモ動画
https://github.com/user-attachments/assets/cddb4efd-1875-4a3f-aa36-76c147832b13

