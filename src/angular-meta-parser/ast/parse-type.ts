import { ParseValueType } from './parse-value-type';
import { ParsePrimitiveType } from './parse-primitive-type';
import { ParseReferenceType } from './parse-reference-type';
import { ParseFunctionType } from './parse-function-type';
import { ParseUnionType } from './parse-union-type';

export type ParseSimpleType = ParseValueType | ParsePrimitiveType | ParseReferenceType | ParseFunctionType;

export type ParseType = ParseSimpleType | ParseUnionType;
