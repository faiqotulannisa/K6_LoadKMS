Linux 

k6 run --log-format=raw ./script.js 2>&1 \
  | tee responses.log \
  | grep '^CSV,' \
  | sed 's/^CSV,//' \
  > responses.csv


  Windows 

  k6 run --log-format=raw .\script.js 2>&1 `
| Tee-Object -FilePath .\responses.log `
| Select-String -Pattern '^CSV,' `
| ForEach-Object { $_.Line.Substring(4) } `
| Set-Content -Path .\responses.csv -Encoding UTF8
