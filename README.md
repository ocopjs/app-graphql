<!--[meta]
section: api
subSection: apps
title: GraphQL app
[meta]-->

# GraphQL app

> Lưu ý sau khi phiên bản KeystoneJS 5 chuyển sang chế độ duy trì để ra mắt
> phiên bản mới hơn. Chúng tôi đã dựa trên mã nguồn cũ này để phát triển một
> phiên bản khác với một số tính năng theo hướng microservices.

Ứng dụng @ocopjs tạo ra GraphQL API và môi trường chạy thử
[GraphiQL](https://github.com/graphql/graphiql/blob/master/packages/graphiql/README.md).

> **Lưu ý:** Môi trường chạy thử sẽ tắt trên production mode.

Chúng tôi đang phát triển trang tài liệu để cung cấp thêm thông tin về viết truy
vấn queries, mutations cho @ocopjs.

## Sử dụng

```javascript
const { Ocop } = require("@ocopjs/ocop");
const { GraphQLApp } = require("@ocopjs/app-graphql");
const { AdminUIApp } = require("@ocopjs/app-admin-ui");

module.exports = {
  ocop: new Ocop(),
  apps: [
    new GraphQLApp({
      // All config keys are optional. Default values are shown here for completeness.
      apiPath: "/admin/api",
      graphiqlPath: "/admin/graphiql",
      schemaName: "admin",
      apollo: {},
    }),
    new AdminUIApp(),
  ],
};
```

## Cấu hình

| Cấu hình       | Loại     | Mặc định          | Mô tả                                            |
| -------------- | -------- | ----------------- | ------------------------------------------------ |
| `apiPath`      | `String` | `/admin/api`      | Đổi đường dẫn API                                |
| `graphiqlPath` | `String` | `/admin/graphiql` | Đổi đường dẫn môi trường thử                     |
| `schemaName`   | `String` | `admin`           | Đổi tên graphQL schema (không khuyến khích)      |
| `apollo`       | `Object` | `{}`              | Cấu hình này được truyền thẳng bào Apollo Server |

## Cấu hình tuỳ chỉnh cho schemaName

Để tuỳ chỉnh `schemaName`, hãy chắc rằng các cấu hình cũng tương thích với cấu
hình khi dựng `new Ocop({...})`. Chúng tôi sẽ phát triển trang tài liệu để nói
thêm.
