import { Operation, Retain, Insert, Nop, Delete, OpType } from "./Operation";

'use strict';

export interface TransformResult {
    opPrimeList1: Operation[],
    opPrimeList2: Operation[]
}

interface XformResult {
    op1Prime: Operation,
    op2Prime: Operation,
    cursor1Move: number,
    cursor2Move: number
}

export class Transformer {
    public transform(opList1: Operation[], opList2: Operation[]): TransformResult {
        let index1: number = 0;
        let index2: number = 0;
        let cursor1: number = 0;
        let cursor2: number = 0;
        let opPrimeList1: Operation[] = [];
        let opPrimeList2: Operation[] = [];
        while (index1 < opList1.length && index2 < opList2.length) {
            const op1: Operation = opList1[index1];
            const op2: Operation = opList2[index2];
            let result: XformResult;
            switch (op1.opType) {
                case OpType.RETAIN:
                    switch (op2.opType) {
                        case OpType.RETAIN:
                            result = this.xformRetainRetain(cursor1, cursor2, op1, op2);
                            break;
                        case OpType.INSERT:
                            result = this.xformRetainInsert(cursor1, cursor2, op1, <Insert>op2);
                            break;
                        case OpType.DELETE:
                            result = this.xformRetainDelete(cursor1, cursor2, op1, op2);
                            break;
                        default:
                            throw new Error('Case not yet implemented');
                    }
                    break;
                default:
                    throw new Error('Case not yet implemented');
            }
            opPrimeList1.push(result.op1Prime);
            opPrimeList2.push(result.op2Prime);
            cursor1 += result.cursor1Move;
            cursor2 += result.cursor2Move;
            if (cursor1 == op1.length) {
                index1++;
                cursor1 = 0;
            }
            if (cursor2 == op2.length) {
                index2++;
                cursor2 = 0;
            }
        }
        if (index1 < opPrimeList1.length) {
            opPrimeList1 = opPrimeList1.concat(opList1.slice(index1));
        }
        if (index2 < opPrimeList2.length) {
            opPrimeList2 = opPrimeList2.concat(opList2.slice(index2));
        }
        return {
            opPrimeList1: this.simplifyOpList(opPrimeList1),
            opPrimeList2: this.simplifyOpList(opPrimeList2)
        };
    }

    private simplifyOpList(opList: Operation[]): Operation[] {
        const strippedList: Operation[] = opList.filter((op: Operation) => op.opType !== OpType.NOP);
        if (strippedList.length === 0) {
            return [];
        }
        const simplifiedOpList: Operation[] = [];
        simplifiedOpList.push(strippedList[0]);
        for (let strippedListIndex = 1; strippedListIndex < strippedList.length; strippedListIndex++) {
            const lastIndexOfSimplified: number = simplifiedOpList.length - 1;
            const strippedOp = strippedList[strippedListIndex];
            const lastSimplifiedOp = simplifiedOpList[lastIndexOfSimplified];
            if (strippedOp.opType === lastSimplifiedOp.opType) {
                simplifiedOpList[lastIndexOfSimplified] = lastSimplifiedOp.combine(strippedOp);
            } else {
                simplifiedOpList.push(strippedOp);
            }
        }
        return simplifiedOpList;
    }

    private xformRetainRetain(cursor1: number, cursor2: number, op1: Retain, op2: Retain): XformResult {
        const length: number = Math.min(op1.length - cursor1, op2.length - cursor2);
        return {
            op1Prime: new Retain(length),
            op2Prime: new Retain(length),
            cursor1Move: length,
            cursor2Move: length
        };
    }

    private xformRetainInsert(cursor1: number, cursor2: number, op1: Retain, op2: Insert): XformResult {
        return {
            op1Prime: new Insert(op2.length - cursor2, op2.value),
            op2Prime: new Retain(op2.length - cursor2),
            cursor1Move: 0,
            cursor2Move: op2.length
        };
    }

    private xformRetainDelete(cursor1: number, cursor2: number, op1: Retain, op2: Delete): XformResult {
        const length: number = Math.min(op1.length - cursor1, op2.length - cursor2);
        return {
            op1Prime: new Delete(length),
            op2Prime: new Nop(),
            cursor1Move: length,
            cursor2Move: length
        };
    }
}