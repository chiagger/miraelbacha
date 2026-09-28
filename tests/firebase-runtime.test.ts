import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("Firebase modules load and JWKS signatures work without require(ESM) support", () => {
  // Firebase Admin 14's jwks-rsa/jose chain failed before API handlers could run
  // on the deployed runtime. A normal local import can hide this regression.
  const result = spawnSync(
    process.execPath,
    [
      "--no-experimental-require-module",
      "-e",
      `
        const assert = require('node:assert/strict');
        assert.equal(typeof require('firebase-admin/app').initializeApp, 'function');
        assert.equal(typeof require('firebase-admin/auth').getAuth, 'function');
        assert.equal(typeof require('firebase-admin/firestore').getFirestore, 'function');

        // Exercise the jose import/export API used by jwks-rsa, using local keys
        // only. The compatibility override must not bypass signature checks.
        const { generateKeyPairSync } = require('node:crypto');
        const { JwksClient } = require('jwks-rsa');
        const jwt = require('jsonwebtoken');
        async function checkSignatures() {
          const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
          const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'test-key', alg: 'RS256', use: 'sig' };
          const client = new JwksClient({
            jwksUri: 'https://unused.invalid/jwks',
            getKeysInterceptor: async () => [jwk],
          });
          const signingKey = await client.getSigningKey('test-key');
          const token = jwt.sign({ sub: 'test-user' }, privateKey, { algorithm: 'RS256' });
          const verified = jwt.verify(token, signingKey.getPublicKey(), { algorithms: ['RS256'] });
          assert.equal(verified.sub, 'test-user');

          const parts = token.split('.');
          parts[1] = Buffer.from(JSON.stringify({ sub: 'tampered-user' })).toString('base64url');
          assert.throws(() => jwt.verify(parts.join('.'), signingKey.getPublicKey(), { algorithms: ['RS256'] }));
        }
        checkSignatures().catch(error => { console.error(error); process.exitCode = 1; });
      `,
    ],
    {
      cwd: fileURLToPath(new URL("../apps/admin/", import.meta.url)),
      encoding: "utf8",
      timeout: 10_000,
    },
  );

  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
});
