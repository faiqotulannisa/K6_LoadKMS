import http from 'k6/http';
import { sleep } from 'k6';
import { Trend } from 'k6/metrics';

const requestLog = new Trend('request_log', true);

export const options = {
  scenarios: {
    load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [{ duration: '1s', target: 10 }],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'],
  },
};

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export default function () {
  const url = 'https://api-kms.mesign.id/api/v1/signhash';

  const payload = JSON.stringify({
    keyId: '338ae841-f4fb-40dd-a1cc-0ee83c147b1a',
    data: 'MEECAQEwMTANBglghkgBZQMEAgEFAAQgpJXDoCZZ5aja0OBUmcSCPrGy/ay1aKe69l55T42XfbwCBgGLjd5vqQEB/w==',
    encryptedKey:
      'LIIgtI3Eh/po+mWBi/KeNaEC4K7BJ+ne48rFvCEcxpHNufj/jTPRyeG7S2kdDqonx8Iczkfk7RgAxfEsBaldQQjUq4lP5dOwpIs1s3N4Eu/j260mrXNHfAtl9X+5f3EdxcMM8WxpxJFIOIJvoTo+wSRZQPDNjb4KxV/Wm8smMzo2u9qTW+aaUOuXJvPa9Yp9AQiQI28Zy8ONF0aakGuMDJmLOqtnviNuEysbqLJdTsxZQS55qpVtTv+Tej5EZ6d+03C489962UuipN/iqOUek9tfAQdqtI7h7+7E55Kjf1uNeOF8ghMc4i3gHoNgheC5XOI4L6i7fsl6gMDxkK/7ai4M0RDaMxQBLgcLX8S6uSn7wrmF7TLSQYyrtt0g8pylhoJApdaJ/W4WLCSvXBvOiXf0mkCpfUHChDRofibqW7Btu4wNZRFwLkSTTVYCTgwVM/59Xyb0vYAcD8SrRDL+4vFabponmjHVQzD0G4qPtcNh2LwsFjSSOOmrW8YZ/XLwHupuijXE/xpegzo9wn7+HsZfSv0pyiRV9NqOiylRm7yLnGFgrOSNfspgkG5vxywQFPqwEUmOTQNtIRNjoe2DwqGZ4dJVV/fgmMl7ZD1rUsEL7xDSsCgDNOz3ctpbY+jyTPOC6XDxneGdxvagE2XazgPIg/lO18bww5UGq0Ypsp5ZD76CXuQrRgPkKsSgdl64eABQnt2br+cmjVGEwyTTnYj3CcgVwK6sUOVB69tT0FpIcOSyCZ2QrQRN23SXzDdZ4kczjyKZ7jOuFarlRNVAiAzTchHmlkUwVxRLTsiZHvndNZ9RJBnlL9g/o2BU+U0x3dMwomn3AsvHAkx53ZE/I3nlHA+2NzOzcIzjRpagqNcMoN7nHkxj7IfSAc9RMsXe/PGfuBtjr3vqwT91K1hYxkB33AzOU6s80b6EgdVfC/OuwNWQsn4ctZMaB6TyczjkGunf4sJdS44TFBq4XHfq2KJqOPIclAZm2/pyHfZef3DQpno1wGJdFpSoyr8NI+gzYTFX7cYlgHrlrLMWx4NMencRHKMPkpyqlRP50/Pj7r3QWOUFHfvqeIMssRsHy8bNgxPBkvgW6LQmW+qqKczEdA3pbbZg1ZZeyJ8iT2WCdCKfFqmLvC10gx3vPRn8WwfQF2PWC6Ev7ltXBmFxGNDurctM9HjpDrNoa/Eg0DTJl+Gp0XrIlJmMBvFK9zLor7TZd23hIpBebkx+gsEvnvegqlPteMNQeADxpNiYV46sJDnsOG5XGcWn/gjNJsZ+5t20r6Ki3njwsXwsHhxS3aVKihFqqOwAjEgfguIvpmiSFYRUpnxRZhfQyvnuerUg+0OwI8oL6EtYaZ1J9sO7wmJMLuAdkwnkSVuIeYTHczvhHB97zkG+ykhhd0W53qXzdSEqKAAwmVFmqp4vR/9brQ9xS9AaMNxhZLUA4HrZTuW8xH6sp88OkDGFTq13Vupcd78mGTGgEJksQRzjfffmMQj7uCA73AkgM7iknf0Hr+gc9MFI5joEgtAA42NJO2Wxav2+vfMtEDzKUXy4acfjveLFYn59L8eLG8is85O2Oh9d/LwLy0spNmCfCWzPhDSOtOsFoqADL6zLnD1Cqr+H03Dk1qumZChjQyZGMOe12wtp8v8=',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
    responseType: 'text',
  };

  const res = http.post(url, payload, params);
  requestLog.add(res.timings.duration);

  let trx = '';
  let message = '';
  try {
    const json = JSON.parse(res.body);
    trx = json?.trx ?? '';
    message = json?.message ?? '';
  } catch (_) {}

  if (__VU === 1 && __ITER === 0) {
    console.log('CSV,' + ['timestamp', 'vu', 'iter', 'status', 'duration_ms', 'trx', 'message', 'body'].join(','));
  }

  console.log(
    'CSV,' + [
      new Date().toISOString(),
      __VU,
      __ITER,
      res.status,
      res.timings.duration,
      csvEscape(trx),
      csvEscape(message),
      csvEscape(res.body),
    ].join(',')
  );

  sleep(1);
}