import * as assert from 'assert';
import * as fs from 'fs-extra';

export function assertFilesEqual(a: string, b: string) {
    [a, b].map((filePath) => {
        try {
            return fs.readFileSync(filePath).toString();
        } catch (e) {
            assert.fail(undefined, undefined, `exception thrown: ${e}`);
        }
    }).reduce((s1, s2) => {
        if (s1 === undefined) {
            return s2;
        } else if (s2 === undefined) {
            return s1;
        }
        assert.equal(s1, s2);
        return s2;
    });
}

export function assertIsSupersetOf(actual: object, expected: object) {
    Object.getOwnPropertyNames(expected).forEach((prop) => {
        assert.deepEqual(actual[prop], expected[prop]);
    });
}
