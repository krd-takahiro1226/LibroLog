# アプリ概要
- 読んだ本について名前、著者、読んだ回数、優先度を管理
  - 本の検索は楽天の書籍検索APIを叩いて取得
    - そこから登録ボタン押下(+必要な情報)で登録処理を行う

# 動作確認環境
- MySQL 8.0.37
  - 最新は 8.4 LTS だが、当分8.0.37で進める
- Java 21.0.2
  - 最新は 21.0.3 (藤井はこのverで進めます)
- Maven
  - Apache Maven 3.9.6

# アプリの動かし方
- git pull main
- application.propertiesで、自環境のSQLパスワードに合わせる
- 必要なDBおよびテーブルの作成を行う
  - クエリは、sqlフォルダにある
- Reading_Records/backend/backend配下で```mvn clean install```を実行
- BackendApplication.java でRunし、アプリケーションを起動する
- ```localhost:8080/login```に接続する
  - すでにユーザ作成済みの場合は、作成したユーザでログインする
  - 初めて利用する場合はユーザ作成から行う
 
# デモ動画
https://github.com/user-attachments/assets/cddb4efd-1875-4a3f-aa36-76c147832b13

