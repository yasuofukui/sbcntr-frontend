/**
 * アプリケーション設定
 * 環境変数から読み込む設定値を一元管理します
 */

export const config = {
  api: {
    // スキーマ名
    schema: process.env.BACKEND_SCHEMA || "http://",
    // バックエンドAPIのエンドポイント
    backendUrl: `${process.env.BACKEND_SCHEMA || "http://"}${
      process.env.BACKEND_FQDN || "localhost"
    }:${process.env.BACKEND_PORT || "8081"}`,
    // Service Connect経由のバックエンドAPIのエンドポイント
    serviceConnectUrl: `${process.env.BACKEND_SCHEMA || "http://"}${
      process.env.BACKEND_SERVICE_CONNECT_FQDN || "localhost"
    }:${process.env.BACKEND_PORT || "8081"}`
  }
};

console.log(config.api.backendUrl);
