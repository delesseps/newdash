import * as assert from 'assert';
import lodashStable from 'lodash';
import { slice, stubArray } from './utils';
import curryRight from '../src/curryRight';
import placeholder from '../src/placeholder';
import bind from '../src/bind';
import partialRight from '../src/partialRight';
import partial from '../src/partial';

describe('curryRight', () => {
  function fn(a, b, c, d) {
    return slice.call(arguments);
  }

  it('should curry based on the number of arguments given', () => {
    const curried = curryRight(fn),
      expected = [1, 2, 3, 4];

    assert.deepStrictEqual(curried(4)(3)(2)(1), expected);
    assert.deepStrictEqual(curried(3, 4)(1, 2), expected);
    assert.deepStrictEqual(curried(1, 2, 3, 4), expected);
  });

  it('should allow specifying `arity`', () => {
    const curried = curryRight(fn, 3),
      expected = [1, 2, 3];

    assert.deepStrictEqual(curried(3)(1, 2), expected);
    assert.deepStrictEqual(curried(2, 3)(1), expected);
    assert.deepStrictEqual(curried(1, 2, 3), expected);
  });

  it('should coerce `arity` to an integer', () => {
    const values = ['0', 0.6, 'xyz'],
      expected = lodashStable.map(values, stubArray);

    const actual = lodashStable.map(values, (arity) => curryRight(fn, arity)());

    assert.deepStrictEqual(actual, expected);
    assert.deepStrictEqual(curryRight(fn, '2')(1)(2), [2, 1]);
  });

  it('should support placeholders', () => {
    const curried = curryRight(fn),
      expected = [1, 2, 3, 4],
      ph = curried.placeholder;

    assert.deepStrictEqual(curried(4)(2, ph)(1, ph)(3), expected);
    assert.deepStrictEqual(curried(3, ph)(4)(1, ph)(2), expected);
    assert.deepStrictEqual(curried(ph, ph, 4)(ph, 3)(ph, 2)(1), expected);
    assert.deepStrictEqual(curried(ph, ph, ph, 4)(ph, ph, 3)(ph, 2)(1), expected);
  });

  it('should persist placeholders', () => {
    const curried = curryRight(fn),
      ph = curried.placeholder,
      actual = curried('a', ph, ph, ph)('b')(ph)('c')('d');

    assert.deepStrictEqual(actual, ['a', 'b', 'c', 'd']);
  });

  it('should use `_.placeholder` when set', () => {
    const curried = curryRight(fn),
      _ph = placeholder = {},
      ph = curried.placeholder;

    assert.deepEqual(curried(4)(2, _ph)(1, ph), [1, 2, ph, 4]);
  });

  it('should provide additional arguments after reaching the target arity', () => {
    const curried = curryRight(fn, 3);
    assert.deepStrictEqual(curried(4)(1, 2, 3), [1, 2, 3, 4]);
    assert.deepStrictEqual(curried(4, 5)(1, 2, 3), [1, 2, 3, 4, 5]);
    assert.deepStrictEqual(curried(1, 2, 3, 4, 5, 6), [1, 2, 3, 4, 5, 6]);
  });

  it('should create a function with a `length` of `0`', () => {
    lodashStable.times(2, (index) => {
      const curried = index ? curryRight(fn, 4) : curryRight(fn);
      assert.strictEqual(curried.length, 0);
      assert.strictEqual(curried(4).length, 0);
      assert.strictEqual(curried(3, 4).length, 0);
    });
  });

  it('should ensure `new curried` is an instance of `func`', () => {
    function Foo(value) {
      return value && object;
    }

    var curried = curryRight(Foo),
      object = {};

    assert.ok(new curried(false) instanceof Foo);
    assert.strictEqual(new curried(true), object);
  });

  it('should use `this` binding of function', () => {
    const fn = function(a, b, c) {
      const value = this || {};
      return [value[a], value[b], value[c]];
    };

    const object = { 'a': 1, 'b': 2, 'c': 3 },
      expected = [1, 2, 3];

    assert.deepStrictEqual(curryRight(bind(fn, object), 3)('c')('b')('a'), expected);
    assert.deepStrictEqual(curryRight(bind(fn, object), 3)('b', 'c')('a'), expected);
    assert.deepStrictEqual(curryRight(bind(fn, object), 3)('a', 'b', 'c'), expected);

    assert.deepStrictEqual(bind(curryRight(fn), object)('c')('b')('a'), Array(3));
    assert.deepStrictEqual(bind(curryRight(fn), object)('b', 'c')('a'), Array(3));
    assert.deepStrictEqual(bind(curryRight(fn), object)('a', 'b', 'c'), expected);

    object.curried = curryRight(fn);
    assert.deepStrictEqual(object.curried('c')('b')('a'), Array(3));
    assert.deepStrictEqual(object.curried('b', 'c')('a'), Array(3));
    assert.deepStrictEqual(object.curried('a', 'b', 'c'), expected);
  });

  it('should work with partialed methods', () => {
    const curried = curryRight(fn),
      expected = [1, 2, 3, 4];

    const a = partialRight(curried, 4),
      b = partialRight(a, 3),
      c = bind(b, null, 1),
      d = partial(b(2), 1);

    assert.deepStrictEqual(c(2), expected);
    assert.deepStrictEqual(d(), expected);
  });
});
