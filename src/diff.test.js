describe( 'function diff', () => {
    it( 'should return 1 on a = 2, b = 1', () => {
        let a = 2, b = 1;
        let res = diff( a, b );

        expect( res ).to.equal( 1 );
    } );

    it( 'should return 3 on a = -6, b = -3', () => {
        let a = -6, b = -3;
        let res = diff( a, b );

        expect( res ).to.equal( 3 );
    } )
} );