import { getDOM, print } from '../../dist/script/browser/index.js';
import { callAndCatch } from '../../dist/script/common/index.js';

function test() {
  const res = callAndCatch(
    function (num1, num2) {
      throw Error('xxx');
      return num1 + num2;
    },
    [10, 20],
    null,
    (error) => {
      console.log('error --->', error);
    },
  );

  console.log('res --->', res);
}

test();
