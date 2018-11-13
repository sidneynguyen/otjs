import { assert } from 'chai';
import { Transformer, TransformResult } from '../src/Transformer';
import { Retain, OpType, Operation, Insert, Delete } from '../src/Operation';

const transformer: Transformer = new Transformer();

describe('transform Retain _', () => {
    describe('[R(1)], [R(1)]', () => {
        it('should return [R(1)], [R(1)]', () => {
            const opList1: Operation[] = [
                new Retain(1)
            ];
            const opList2: Operation[] = [
                new Retain(1)
            ];
            const res: TransformResult = transformer.transform(opList1, opList2);
            const expected: TransformResult = {
                opPrimeList1: [new Retain(1)],
                opPrimeList2: [new Retain(1)]
            };
            assert.deepEqual(res, expected);
        })
    });

    describe('[R(2)], [R(2)]', () => {
        it('should return [R(2)], [R(2)]', () => {
            const opList1: Operation[] = [ new Retain(2) ];
            const opList2: Operation[] = [ new Retain(2) ];
            const res: TransformResult = transformer.transform(opList1, opList2);
            const expected: TransformResult = {
                opPrimeList1: [ new Retain(2) ],
                opPrimeList2: [ new Retain(2) ]
            };
            assert.deepEqual(res, expected);
        })
    });

    describe('[R(1)], [I(1,a), R(1)]', () => {
        it('should return [I(1,a), R(1)], [R(2)]', () => {
            const opList1: Operation[] = [ new Retain(1) ];
            const opList2: Operation[] = [
                new Insert(1, 'a'),
                new Retain(1)
            ];
            const res: TransformResult = transformer.transform(opList1, opList2);
            const expected: TransformResult = {
                opPrimeList1: [
                    new Insert(1, 'a'),
                    new Retain(1)
                ],
                opPrimeList2: [ new Retain(2) ]
            };
            assert.deepEqual(res, expected);
        })
    });

    describe('[R(1)], [I(2,ab), R(1)]', () => {
        it('should return [I(2,ab), R(1)], [R(3)]', () => {
            const opList1: Operation[] = [ new Retain(1) ];
            const opList2: Operation[] = [
                new Insert(2, 'ab'),
                new Retain(1)
            ];
            const res: TransformResult = transformer.transform(opList1, opList2);
            const expected: TransformResult = {
                opPrimeList1: [
                    new Insert(2, 'ab'),
                    new Retain(1)
                ],
                opPrimeList2: [ new Retain(3) ]
            };
            assert.deepEqual(res, expected);
        })
    });

    describe('[R(1)], [D(1)]', () => {
        it('should return [D(1)], []', () => {
            const opList1: Operation[] = [ new Retain(1) ];
            const opList2: Operation[] = [ new Delete(1) ];
            const res: TransformResult = transformer.transform(opList1, opList2);
            const expected: TransformResult = {
                opPrimeList1: [ new Delete(1) ],
                opPrimeList2: [ ]
            };
            assert.deepEqual(res, expected);
        })
    });

    describe('[R(2)], [D(2)]', () => {
        it('should return [D(2)], []', () => {
            const opList1: Operation[] = [ new Retain(2) ];
            const opList2: Operation[] = [ new Delete(2) ];
            const res: TransformResult = transformer.transform(opList1, opList2);
            const expected: TransformResult = {
                opPrimeList1: [ new Delete(2) ],
                opPrimeList2: [ ]
            };
            assert.deepEqual(res, expected);
        })
    });

    describe('[R(3)], [D(1), R(1), I(1, a), R(1)]', () => {
        it('should return [D(1), R(1), I(1, a), R(1)], [R(3)]', () => {
            const opList1: Operation[] = [ new Retain(3) ];
            const opList2: Operation[] = [
                new Delete(1),
                new Retain(1),
                new Insert(1, 'a'),
                new Retain(1)
            ];
            const res: TransformResult = transformer.transform(opList1, opList2);
            const expected: TransformResult = {
                opPrimeList1: [
                    new Delete(1),
                    new Retain(1),
                    new Insert(1, 'a'),
                    new Retain(1)
                ],
                opPrimeList2: [ new Retain(3) ]
            };
            assert.deepEqual(res, expected);
        })
    });
});