describe('function loadNodeSubtreeByUUID(uuid)', () => {
    beforeEach(() => {
        cache = [];
    });

    describe('uuid in cache', () => {
        it('should return node from cache[uuid]', () => {
            let uuid = getStartNode();
            let _node = loadNodeByUUID(uuid);
            expect(_node).to.not.be.null;
            let node = $.parseJSON(_node);
            cache[node.uuid] = node;
            
            let loadedNode = loadNodeSubtreeByUUID(uuid);

            expect(loadedNode).to.deep.equal(cache[uuid]);
        });
    });

    describe('uuid not in cache', () => {
        describe('node with such uuid exists', () => {
            it('should return this node', () => {
                let uuid = getStartNode();
                let node = $.parseJSON(loadNodeByUUID(uuid));    //object
                expect(node).to.not.be.null;
    
                expect(cache).to.not.have.property(uuid);
    
                let loadedNode = loadNodeSubtreeByUUID(uuid);
    
                expect(cache).to.have.property(uuid);
                expect(cache[uuid]).to.deep.equal(loadedNode);
            });

            it('should add this node to cache', () => {
                let uuid = getStartNode();
                let node = $.parseJSON(loadNodeByUUID(uuid));    //object
                expect(node).to.not.be.null;
    
                expect(cache).to.not.have.property(uuid);
    
                let loadedNode = loadNodeSubtreeByUUID(uuid);
    
                expect(loadedNode.uuid).to.equal(node.uuid);
            });
        });
        describe('node with such uuid doesn`t exist' ,() => {
            it('should return `undefined`', () => {
                expect(cache).to.not.have.property('foo');
    
                let loadedNode = loadNodeSubtreeByUUID('foo');
    
                expect(loadedNode).to.be.undefined;
                expect(cache).to.not.have.property('foo');
            });
        });
        
    });
});

describe('function updateTree(uuid, deep, path)', () => {
    var uuid;

    beforeEach(() => {
        all_active_elems = null;
        uuid = getStartNode();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('block with id=`block-uuid` doesn`t exist in document', () => {
        it('should append new block with id=`block-uuid` to `contents` block', () => {
            $('body').append('<div id="test">');

            $('#test').append('<div id="contents">');
            var stubConstructTree = sinon.stub(window, 'constructTree').callsFake((uuid) => {
                var e = $('<div>', {
                    id: "block-" + uuid
                });
                return e;
            });
            let uuid = getStartNode();

            updateTree(uuid, 0, "");

            expect($('#contents').children('#block-' + uuid).length).to.equal(1);

            $('#test').remove();
        });

        describe('new block with uuid is not visible', () => {
            it('should toggle all children which parents has `hiddenChilds` class', () => {
                $('body').append('<div id="test">');

                let uuid = getStartNode();
                var hiddenChildsUUID = '638273b3-b633-aab9-1234-e2227ae9ffcd';
                $('#test').append($('<div>', {
                    id: 'hiddenChildsDiv-' + hiddenChildsUUID,
                    class: 'hiddenChilds'
                })).children().append($('<div>', {
                    id: 'contents',
                }));
                var stubConstructTree = sinon.stub(window, 'constructTree').callsFake((uuid) => {
                    var newNode = $('<div>', {
                        id: 'block-' + uuid,
                    }).css('display', 'none');
                    return newNode;
                });
                var spyToggleChildren = sinon.spy(window, 'toggleChildren');

                updateTree(uuid, 0, "");

                expect(spyToggleChildren.calledOnceWithExactly(hiddenChildsUUID, 0, true)).to.be.true;

                $('#test').remove();
            });
        });
    });

    describe('block with id=`block-uuid` exists in document', () => {  
        var currentNode;
        var nodeChildren;

        beforeEach(() => {
            $('body').append('<div id="test">');
            currentNode = $('<div>', {
                id: 'block-' + uuid,
                class: 'hiddenChilds testNotReplaced'
            });
            $('#test').append(currentNode);
            nodeChildren = $(
                '<div class="supported-node">' +
                    '<div class="hiddenChilds"/>' +
                    '<div/>' +
                '</div>' +
                '<div class="hiddenChilds supported-node">' +
                    '<div/>' +
                    '<div class="hiddenChilds"/>' +
                '</div>');
            currentNode.append(nodeChildren);
            currentNode.find('div').each((idx, elem) => {
                elem.id = 'block-' + faker.random.uuid();
            });
        });

        afterEach(() => {
            $('#test').remove();
        });

        it('should update this block', () => {
            var stubConstructTree = sinon.stub(window, 'constructTree').callsFake((uuid) => {
                var e = $('<div>', {
                    id: 'block-' + uuid,
                    class: 'testReplaced'
                });
                return e;
            });

            updateTree(uuid, 0, "");

            expect($('#block-' + uuid).hasClass('testReplaced')).to.be.true;
        });
        
        it('should call toggleChildren for all elements with `class=hiddenChilds`', () => {
            var stubConstructTree = sinon.stub(window, 'constructTree').callsFake((uuid) => {
                var e = $('<div>', {
                    id: "block-" + uuid
                });
                return e;
            });
            var spyToggleChildren = sinon.spy(window, 'toggleChildren');

            updateTree(uuid, 0, "");

            expect(spyToggleChildren.callCount).to.equal(4);
        });

        describe('focused element was removed', () => {
            var spySetFocusByIndex;

            beforeEach(() => {
                updateElList();
                spySetFocusByIndex = sinon.spy(window, 'setFocusByIndex');
            });

            describe('there is previously focused element', () => {
                it('should set focus to previously focused element', () => {
                    keyboard_focus = 1;

                    var newNodeChildren = $(nodeChildren[0]);
                    var stubConstructTree = sinon.stub(window, 'constructTree').callsFake((uuid) => {
                        var e = $('<div>', {
                            id: "block-" + uuid
                        });
                        e.append($('<div>', {
                            id: faker.random.uuid(),
                            class: 'supported-node'
                        }));
                        e.append(newNodeChildren);
                        return e;
                    });
                    
                    updateTree(uuid, 0, "");

                    expect(spySetFocusByIndex.calledOnceWithExactly(1, true)).to.be.true;
                });
            });
            describe('there is not previously focused element', () => {
                it('should set focus to first element(with index 0)', () => {
                    $('.supported-node')[0].classList.remove('supported-node');

                    keyboard_focus = 1;

                    var newNodeChildren = $(nodeChildren)[0];
                    var stubConstructTree = sinon.stub(window, 'constructTree').callsFake((uuid) => {
                        var e = $('<div>', {
                            id: "block-" + uuid
                        });
                        e.append($('<div>', {
                            id: faker.random.uuid(),
                            class: 'supported-node'
                        }));
                        e.append(newNodeChildren);
                        return e;
                    });
                    
                    updateTree(uuid, 0, "");

                    expect(spySetFocusByIndex.calledOnceWithExactly(0, true)).to.be.true;
                });
            });
            describe('previously focused element was also removed', () => {
                it('should set focus to first element(with index 0)', () => {
                    keyboard_focus = 1;

                    var newNodeChildren = $(nodeChildren);
                    newNodeChildren.each((idx, elem) => {
                        elem.classList.remove('supported-node');
                    });
                    var stubConstructTree = sinon.stub(window, 'constructTree').callsFake((uuid) => {
                        var e = $('<div>', {
                            id: "block-" + uuid
                        });
                        e.append($('<div>', {
                            id: faker.random.uuid(),
                            class: 'supported-node'
                        }));
                        e.append(newNodeChildren);
                        return e;
                    });
                    
                    updateTree(uuid, 0, "");

                    expect(spySetFocusByIndex.calledOnceWithExactly(0, true)).to.be.true;
                });
            });
        });
    });

    xit('should update `all_active_elems` list', () => {
        
    });

    xdescribe('there is not focused elements', () => {
        it('should set focus to first element(with index 0)', () => {
            [{
                all_active_elems: null,
                keyboard_focus: -1
            }, {
                all_active_elems: $('.supported-node'),
                keyboard_focus: -1
            }]
        });
    });

    xdescribe('focused element was not removed', () => {
        it('should set focus on this element', () => {

        });
    });
});

describe('function replaceDummies(elem1, elem2)', () => {
    var uuid;

    beforeEach(() => {
        uuid = getStartNode();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('dummie elem2 is not `falsy`', () => {
        it('should replace parent of this this dummie', () => {
            $('body').append('<div id="test">');
            var parent = $('<div>', {
                class: 'testNotReplaced'
            });
            $('#test').append(parent);
            var elem2 = $('<div>', {
                id: 'smth-' + uuid,
            });
            parent.append(elem2);

            var stubConstructTree = sinon.stub(window, 'constructTree').callsFake((uuid) => {
                var e = $('<div>', {
                    id: 'block-' + uuid,
                    class: 'testReplaced'
                });
                return e;
            });

            replaceDummies(null, elem2);

            expect($('#block-' + uuid).hasClass('testReplaced')).to.be.true;
        });
    });
});