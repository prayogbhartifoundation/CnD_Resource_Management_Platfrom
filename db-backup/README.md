# MongoDB Backup — August 2026

**Database:** `cnd_db`
**Backup Date:** 16 August 2026
**Format:** `mongodump` with `--gzip` compression (`.bson.gz` files)
**Tool Version:** MongoDB Database Tools 100.12.2

## Collections Backed Up

| Collection | Documents |
|-----------|-----------|
| agencies | 4 |
| deptofftakes | 19 |
| downloads | 6 |
| plants | 7 |
| processingforms | 382 |
| processingproductmasters | 5 |
| prods | 19 |
| super_admins | 1 |
| users | 127 |
| utils | 1 |
| visits | 1 |

## How to Restore

1. Ensure MongoDB is running on the target server.
2. Run the following command:

```bash
mongorestore --uri="mongodb://127.0.0.1:27017" --gzip --db cnd_db ./aug-2026/cnd_db/
```

> **Warning:** Make this repository private before sharing. Contains production data.
