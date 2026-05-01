cd /d D:\self-blog
set NEXT_TELEMETRY_DISABLED=1
echo starting > dev.log
npm run dev >> dev.log 2>&1
echo done >> dev.log
