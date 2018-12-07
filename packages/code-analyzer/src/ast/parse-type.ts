import { ParseValueType } from './parse-value-type';
import { ParsePrimitiveType } from './parse-primitive-type';
import { ParseReferenceType } from './parse-reference-type';
import { ParseFunctionType } from './parse-function-type';
import { ParseUnionType } from './parse-union-type';
import { ParseEmpty } from './parse-empty';

export type ParseSimpleType = ParseValueType | ParsePrimitiveType | ParseReferenceType | ParseFunctionType;

export type ParseType = ParseSimpleType | ParseUnionType | ParseEmpty;
