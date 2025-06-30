#!/usr/bin/env bash

# Dump Alsalam_db on the source and pipe it over SSH into the same DB on the target
mysqldump \
  -u salam_admin -p'peace_25_pwd' \
  --single-transaction \
  --quick \
  --hex-blob \
  Alsalam_db \
| ssh root@65.109.238.73 \
    "mysql -u salam_admin -p'peace_25_pwd' Alsalam_db"