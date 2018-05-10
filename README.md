# quesdon

ザ・インタビューズとかaskfmとかそういうののMastodon版

LICENSE: [AGPL 3.0](LICENSE)

## how to run

required: latest version Node.js, MongoDB

```sh
yarn install
yarn build
MONGODB_URL=mongodb://localhost/quesdon BACK_PORT=3000 yarn start
```

## 開発のしかた

### 開発環境を立てる

`yarn dev`とするといろいろwatchしながら動くやつが立ち上がるのであとは <http://localhost:8080> を開くだけ

### ファイル構造

言わなくても見ればわかると思いますが念のため

- `src/`: ソース一式
    - `server/`: サーバーサイドのソース
        - `api/`: APIまわりが入ってるやつ
        - `db/`: データベースのModel
        - `utils/`: あちこちで使うやつ
    - `client/`: クライアントのソース
- `views/`: サーバーサイドが見るテンプレート(pugで書かれている)