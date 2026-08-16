const d = require('./src/html/input/master-data.json');
console.log('total items:', d.length);
const emptyL = d.filter(x => !x.l || x.l.trim() === '').length;
console.log('empty "l" count:', emptyL);
const counts = {};
for (const x of d) {
  const first = (x.f || '').split('\\')[0];
  counts[first] = (counts[first] || 0) + 1;
}
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
console.log('unique first-portion "f" values:', sorted.length);
for (const [k, v] of sorted) console.log(`${k}: ${v}`);



/***
 * 
 * node tmp-analyze.js
total items: 96820
empty "l" count: 4641
unique first-portion "f" values: 93
_freeze: 3950
Treasures-93: 2805
Treasures: 2674
Treasures-92: 2531
Tr85: 2392
Treasures-94: 2355
Treasures90: 2301
Treasures89: 1996
Treasures83: 1942
Treasure86: 1825
Treasures60: 1694
Treasures81: 1674
Treasures52: 1593
Treasures59: 1566
Treasures61: 1514
Treasures73: 1500
Treasures88: 1482
Treasures4: 1345
Treasures28: 1253
Treasures54: 1230
Treasures72: 1182
Treasures76: 1180
Treasures24: 1174
Treasures38: 1148
Treasures29: 1142
Treasures31: 1133
Treasures82: 1132
Treasures62: 1122
Treasures18: 1116
Treasures84: 1116
Treasures50: 1109
Treasures74: 1100
Treasures58: 1077
Treasures80: 1065
Treasures64: 1056
Treasures75: 1051
Treasures63: 1016
Treasures78: 1011
Treasures56: 1009
Treasures47: 994
Treasures34: 979
Treasures48: 969
Treasures55: 968
Treasures7: 962
Treasures30: 942
Treasures71: 939
Treasures51: 937
Treasures65: 920
Treasures66: 917
Treasures5: 910
Treasures43: 893
Treasures77: 878
Treasures49: 873
Treasures70: 855
Treasures33: 852
Treasures68: 849
Treasures32: 846
Treasures35: 843
Treasures41: 819
Treasures22: 797
Treasures53: 787
Treasures57: 773
Treasures40: 771
Treasures69: 732
Treasures25: 695
Treasures 2: 693
Treasures23: 684
Treasures44: 679
Treasures67: 665
Treasures9: 627
Treasures46: 621
Treasures21: 620
Treasures19: 605
Treasures26: 548
Treasures10: 532
Treasures45: 530
Treasures6: 526
Treasures11: 515
Treasures15: 510
Treasures27: 485
Treasures37: 483
Treasures8: 452
Treasures16: 428
Treasures13: 400
Treasures79: 383
Treasures36: 379
Treasures39: 378
Treasures17: 361
Treasures-3: 359
Treasures20: 316
Treasures42: 300
Treasures12: 281
Treasures14: 199
 * 
 */