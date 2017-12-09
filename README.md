# quesdon

ザ・インタビューズとかaskfmとかそういうののMastodon版

LICENSE: [AGPL 3.0](LICENSE)

## how to run

required: latest version Node.js, MongoDB, Redis

```sh
npm install
npm run build
MONGODB_URL=mongodb://localhost/quesdon REDIS_URL=redis://localhost BACK_PORT=3000 npm start
```
