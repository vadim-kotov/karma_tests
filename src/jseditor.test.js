xdescribe('function loadNodeSubtreeByUUID(uuid)', () => {
    beforeEach(() => {
        cache = [];
    });

    describe('uuid in cache', () => {
        it('should return node from cache[uuid]', () => {
            let uuid = getStartNode();
            console.log(uuid);
            let _node = loadNodeByUUID(uuid);
            expect(_node).to.not.be.null;
            let node = $.parseJSON(_node);
            cache[node.uuid] = node;
            
            let loadedNode = loadNodeSubtreeByUUID(uuid);

            expect(loadedNode).to.deep.equal(cache[uuid]);
        });
    });

    describe('uuid not in cache', () => {
        it('when node with such uuid exists\nshould return this node & should add this node to cache', () => {
            let uuid = getStartNode();
            let node = $.parseJSON(loadNodeByUUID(uuid));    //object
            expect(node).to.not.be.null;

            expect(cache).to.not.have.property(uuid);

            let loadedNode = loadNodeSubtreeByUUID(uuid);

            expect(cache).to.have.property(uuid);
            expect(cache[uuid]).to.deep.equal(loadedNode);
        });

        it('should return `undefined` when node with such uuid doesn`t exist', () => {
            expect(cache).to.not.have.property('foo');

            let loadedNode = loadNodeSubtreeByUUID('foo');

            expect(loadedNode).to.be.undefined;
            expect(cache).to.not.have.property('foo');
        });
    });
});
// expect(all_active_elems).to.be.undefined;
                /*
                var setFocusStub = sinon.stub(window, 'setFocusByIndex');

                // setFocusByIndex(0, true);
                updateTree(getStartNode(), 0, "");

                expect(setFocusStub.calledOnceWithExactly(0, true)).to.be.true;
                */
describe('function updateTree(uuid, deep, path)', () => {
    describe('block with id=`block-uuid` doesn`t exist in document', () => {
        describe('new block with uuid is visible', () => {
            it('should append new block with id=`block-uuid` to `contents` block', () => {
                $('body').append('<div id="test">');

                $('#test').append('<div id="contents">');
                sinon.stub(window, 'constructTree').callsFake((uuid) => {
                    var e = $('<div>', {
                        id: "block-" + uuid
                    });
                    return e;
                });
                let uuid = getStartNode();

                updateTree(uuid, 0, "");

                expect($('#contents').children('#block-' + uuid).length).to.equal(1);

                $('#test').empty();
            });
        });

        xdescribe('new block with uuid is not visible', () => {
            it('', () => {
                $('body').append('<div id="test">');

                $('#test').append('<div>', {
                    id: 'contents',
                    class: 'hiddenChilds'
                });
                sinon.stub(window, 'constructTree').callsFake((uuid) => {
                    var e = $('<div>', {
                        id: 'block-' + uuid,
                    }).css('display', 'none');
                    return e;
                });
            });
        });
    });
});