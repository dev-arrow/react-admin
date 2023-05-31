import { TypeKind } from 'graphql';
import isRequired from './isRequired';

describe('isRequired', () => {
    it('returns the correct type for SCALAR types', () => {
        expect(isRequired({ name: 'foo', kind: TypeKind.SCALAR })).toEqual(false);
    });
    it('returns the correct type for NON_NULL types', () => {
        expect(
            isRequired({
                kind: TypeKind.NON_NULL,
                ofType: { name: 'foo', kind: TypeKind.SCALAR },
            })
        ).toEqual(true);
    });
    it('returns the correct type for LIST types', () => {
        expect(
            isRequired({
                kind: TypeKind.LIST,
                ofType: { name: 'foo', kind: TypeKind.SCALAR },
            })
        ).toEqual(false);
    });
    it('returns the correct type for NON_NULL LIST types', () => {
        expect(
            isRequired({
                kind: TypeKind.NON_NULL,
                ofType: {
                    kind: TypeKind.LIST,
                    ofType: { name: 'foo', kind: TypeKind.SCALAR },
                },
            })
        ).toEqual(true);
    });
});
