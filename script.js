import http from 'k6/http';
import { sleep } from 'k6';
import { Trend } from 'k6/metrics';

const requestLog = new Trend('request_log', true);

export const options = {
  scenarios: {
    load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 2000 }, // ramp up ke 200 VUs dalam 30 detik
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% request < 2000 ms
  },
};

//export const options = {
  //scenarios: {
    //tps_test: {
      //executor: 'constant-arrival-rate',
      //rate: 10,                 // 10 transaksi / detik
      //timeUnit: '1s',
      //duration: '1m',
      //preAllocatedVUs: 20,      // VU yg disiapkan
      //maxVUs: 100,              // batas atas
    //}
  //}
//};

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export default function () {
  const url = 'https://api-kms.ezsign.id/api/v1/signhash';

  const payload = JSON.stringify({
    keyId: '67a94a1f-9600-42bc-9874-7f0d794c9a7e',
    data: 'MEECAQEwMTANBglghkgBZQMEAgEFAAQgpJXDoCZZ5aja0OBUmcSCPrGy/ay1aKe69l55T42XfbwCBgGLjd5vqQEB/w==',
    encryptedKey:
      'gGiFfh4nK8wVm0g0Dng/PGnnMiQsZ4e/coFhuAubFDR3ulr4YdWLUS19UAMXoAVqo1oXLgxKJF7Feg+UzlL2PmwNtII3s+Nump/IxM8mQtwlx6MgK/zDfCk3eS3s5LgKlo73FdG6hNNCBMZLtyMQ84U2Xf8iiwiO1MijAWa+Hbg8GM2+12QD6LMtQ78iVslXTHQKJuU/hv1Et+8nbDGTHCgAlNQySEkiUALlh1qJzKw0cKMhhoMC9rnVRwEwi4GBXtY1CNUtw+SQK0J5snlHhjESucCXBiv4Gr/l72Z61bVUcV3+lQf3Eo7h5nKAsbh7/JNp7RwMryxdi+rH4qa+Zo/m4DYXv+iGQOKpyFjSK80l70zKyesWMAdVCCgBtggaQq7XzykZdIikJHOut/LkhR9IVx3sb+snvjZRSCX0Oc2ju9IMUCtCdDspJezvWM8YNUYQJ+7BDvUySKnrFib5/PYJHV915B2fsRSzpFJBJLfSidc/unjC7E7dH5KUNFB4Pz8HmmURKqiGPp+DngZJ9SXvBMgyo+ukzBrleXKmcRX5Y8lfPTOYUb4BPCDnWGbcSL2FmDpWr6pXoN6+vzNO6f+cLwc6l69tSNJePbpNp34OwprjzQnKQj0Yh2eJYI4+3smgtPeYno4c511kPFSKGItvFIvK748aPJdlhbwjw49U1se4F5vlfnl/XNPHiLDCVyxQmaPKFOyzBSytWRrrlRnf9mWvIx79xoeBCfP+3cptR6Kvl630o3NxQUs3k2wEQNJwlomX+ZnjMGhNZloqKlcewAqRalv4KZoaH3nf6VG9IkySj0DoYFnAgQYFoeVbBZmyjLjszSXUzkuM+dJK2wJdpSfOZ7f/HevjDNQXtJZtKU06Wl3Ok7GR+ewEs9De6vR2URkVl3lTj/Tx6W5WU1Ktu7y4x9W5+lPfw7X/gyxQXP7xnpvws9aCGmUVROhySWDPeRDAKOV+MeCHRCqMPwp5K3dVzUA+sMDoB8jTgx+aY6blYI5ljGdgXwLsvwExnEvSvud92ttCiQ9mmHljf1LeiVH/3HMAsz5qBz9RNxX+3/dA/OtTWff9hSwrzTNqEf8VozQvb8te1zrkkZ8lk1I9R89Rh7KL1ffC0iZQDrTaEHfF+dC0mFz6lswB/LgFMvek4dfN2EKh7tclRK829Tu/NIhLPa5PlkLq9peYsd5k9tsqpabBw72mNJCZUIiwkEFDh/8+fsQO7pemLBRAgaVd0tY7ZEWjUmM7qxwsZ4rc0sVzjue7EtXn75nQBnPgfoNy7r1CMvdqNboUiOXLUJMovK/kE2Vt5z+sETbMk7HcayxPXahp0Nuu7ccLK1vyeZA9LozyHR6sQ7zggzqUFDbUTaI+ECQxKggppcCrCJv9L+hszSI9rv+CgeheAt6sjMjjlttr3EtQEtii0XYBAga7WsM8XmymGmiKBedopPRUWwOAk6IoFuFtwwwPk+4ZWihz/k4JaRaSokjMwS5FwWrkqKapEfZRTAKLYQ2V8xApvlBLUcZh4ZpkRN80Yhbsyqr/sVCyLG5pazM2R6DQQh57xfrO4IU6vhqaKNU6sotPSW9YKWxB512og3IXIugOoKk9DvSZxT+rQhCW/SrMgodBDT92AI4mhdbbTFGPrD0=',
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