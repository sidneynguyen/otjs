'use strict';

export enum OpType {
    NOP,
    RETAIN,
    INSERT,
    DELETE
}

export abstract class Operation {
    private _length: number;
    private _opType: OpType;

    constructor(opType: OpType, length: number) {
        this._opType = opType;
        this._length = length;
    }

    abstract combine(op: Operation): Operation;

    get opType(): OpType {
        return this._opType;
    }

    get length(): number {
        return this._length;
    }
}

export class Nop extends Operation {
    constructor() {
        super(OpType.NOP, 0);
    }

    combine(op: Operation): Operation {
        return new Nop();
    }
}

export class Retain extends Operation {
    constructor(length: number) {
        super(OpType.RETAIN, length);
    }

    combine(op: Operation): Operation {
        return new Retain(this.length + op.length);
    }
}

export class Insert extends Operation {
    private _value: string;

    constructor(length: number, value: string) {
        super(OpType.INSERT, length);
        this._value = value;
    }

    combine(op: Operation): Operation {
        return new Insert(this.length + op.length, this.value + (<Insert>op).value);
    }

    get value(): string {
        return this._value;
    }
}

export class Delete extends Operation {
    constructor(length: number) {
        super(OpType.DELETE, length);
    }

    combine(op: Operation): Operation {
        return new Delete(this.length + op.length);
    }
}