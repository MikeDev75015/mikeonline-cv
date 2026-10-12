/**
 * Patches Vitest's `describe` / `test` / `it` / hook globals so that every test body runs inside a
 * zone.js `ProxyZone` (and every `describe` body inside a `SyncTestZone`).
 * This is what lets `fakeAsync`, `tick`, `flush` and Angular's `TestBed` work under Vitest.
 *
 * Local port of `@analogjs/vitest-angular/setup-zone` (MIT), kept here so the test setup does not
 * depend on a package whose peer range does not follow Angular's release train.
 */
import 'zone.js';
import 'zone.js/plugins/sync-test';
import 'zone.js/plugins/proxy';
import 'zone.js/testing';

type AnyFn = (...args: any[]) => any;

const ZoneCtor = (globalThis as any)['Zone'];
if (ZoneCtor === undefined) {
  throw new Error('Missing: Zone (zone.js)');
}
if ((globalThis as any)['__vitest_zone_patch__'] === true) {
  throw new Error('\'vitest\' has already been patched with \'Zone\'.');
}
(globalThis as any)['__vitest_zone_patch__'] = true;

const SyncTestZoneSpec = ZoneCtor['SyncTestZoneSpec'];
const ProxyZoneSpec = ZoneCtor['ProxyZoneSpec'];
if (SyncTestZoneSpec === undefined) {
  throw new Error('Missing: SyncTestZoneSpec (zone.js/plugins/sync-test)');
}
if (ProxyZoneSpec === undefined) {
  throw new Error('Missing: ProxyZoneSpec (zone.js/plugins/proxy)');
}

const env = globalThis as any;
const ambientZone = ZoneCtor.current;

// Synchronous-only zone for `describe` bodies: raises if async work is attempted outside of a hook or test.
const syncZone = ambientZone.fork(new SyncTestZoneSpec('vitest.describe'));

function wrapDescribeInZone(describeBody: AnyFn): AnyFn {
  return function (this: unknown, ...args: any[]) {
    return syncZone.run(describeBody, null, args);
  };
}

// Proxy zone for test bodies so helpers like `fakeAsync` can swap the zone spec at runtime.
const testProxyZone = ambientZone.fork(new ProxyZoneSpec());

function wrapTestInZone(testBody: AnyFn | undefined): AnyFn | undefined {
  if (testBody === undefined) {
    return undefined;
  }
  const wrappedFunc = function (this: unknown) {
    return testProxyZone.run(testBody, null, arguments as unknown as any[]);
  };
  try {
    Object.defineProperty(wrappedFunc, 'length', { configurable: true, writable: true, enumerable: false });
    (wrappedFunc as any).length = testBody.length;
  } catch {
    return testBody.length === 0
      ? () => testProxyZone.run(testBody, null)
      : (done: unknown) => testProxyZone.run(testBody, null, [done]);
  }
  return wrappedFunc;
}

const bindDescribe = (self: unknown, originalVitestFn: AnyFn) => function (...eachArgs: any[]) {
  return function (...args: any[]) {
    args[1] = wrapDescribeInZone(args[1]);
    return originalVitestFn.apply(self, eachArgs).apply(self, args);
  };
};

const bindTest = (self: unknown, originalVitestFn: AnyFn) => function (...eachArgs: any[]) {
  return function (...args: any[]) {
    args[1] = wrapTestInZone(args[1]);
    return originalVitestFn.apply(self, eachArgs).apply(self, args);
  };
};

['describe'].forEach((methodName) => {
  const originalVitestFn = env[methodName];
  env[methodName] = function (this: unknown, ...args: any[]) {
    args[1] = wrapDescribeInZone(args[1]);
    return originalVitestFn.apply(this, args);
  };
  env[methodName].each = bindDescribe(originalVitestFn, originalVitestFn.each);
  env[methodName].only = bindDescribe(originalVitestFn, originalVitestFn.only);
  env[methodName].skip = bindDescribe(originalVitestFn, originalVitestFn.skip);
});

['test', 'it'].forEach((methodName) => {
  const originalVitestFn = env[methodName];
  env[methodName] = function (this: unknown, ...args: any[]) {
    args[1] = wrapTestInZone(args[1]);
    return originalVitestFn.apply(this, args);
  };
  env[methodName].each = bindTest(originalVitestFn, originalVitestFn.each);
  env[methodName].only = bindTest(originalVitestFn, originalVitestFn.only);
  env[methodName].skip = bindTest(originalVitestFn, originalVitestFn.skip);
  env[methodName].todo = function (this: unknown, ...args: any[]) {
    return originalVitestFn.todo.apply(this, args);
  };
});

['beforeEach', 'afterEach', 'beforeAll', 'afterAll'].forEach((methodName) => {
  const originalVitestFn = env[methodName];
  env[methodName] = function (this: unknown, ...args: any[]) {
    args[0] = wrapTestInZone(args[0]);
    return originalVitestFn.apply(this, args);
  };
});
