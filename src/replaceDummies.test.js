describe('function replaceDummies(elem1, elem2)', () => {
    var stubConstructTree;

    beforeEach(() => {
        $('body').append('<div id="test">');
    });

    afterEach(() => {
        $('#test').remove();
        sinon.restore();
    });

    describe('dummie elem2 is not `falsy`', () => {
        var uuid;
        var parent, elem2;

        beforeEach(() => {
            uuid = faker.random.uuid();
            
            parent = $('<div>', {
                id: 'block-' + uuid,
                class: 'testNotReplaced supported-node'
            });
            $('#test').append(parent);
            elem2 = $('<div>', {
                id: 'dummy-' + uuid,
                class: 'dummy'
            });
            parent.append(elem2);

            stubConstructTree = sinon.stub(window, 'constructTree').callsFake((uuid) => {
                var e = $('<div>', {
                    id: 'block-' + uuid,
                    class: 'testReplaced supported-node'
                });
                var dummy = $('#dummy-' + uuid);
                var dummyCopy = dummy.clone();
                dummyCopy.attr('id', 'node-' + extractUUID(dummy.attr('id')));
                dummyCopy.removeClass('dummy');
                dummyCopy.addClass('supported-node');
                e.append(dummyCopy);
                
                return e;
            });
        });

        describe('neither the dummie elem2 nor its parent were focused', () => {
            it('should replace parent of this dummie', () => {
                replaceDummies(null, elem2);

                expect($('#block-' + uuid).hasClass('testReplaced')).to.be.true;
            });
        });

        describe('parent of the dummie elem2 was focused', () => {
            beforeEach(() => {
                parent.addClass('focused');

                replaceDummies(null, elem2);
            });

            it('should replace parent of this this dummie', () => {
                expect($('#block-' + uuid).hasClass('testReplaced')).to.be.true;
            });

            it('should set focus to replaced dummie', () => {
                expect($('#node-' + uuid).hasClass('focused')).to.be.true;
            });
        });

        describe('the dummie elem2 was focused', () => {
            beforeEach(() => {
                elem2.addClass('focused');

                replaceDummies(null, elem2);
            });

            it('should replace parent of this this dummie', () => {
                expect($('#block-' + uuid).hasClass('testReplaced')).to.be.true;
            });

            it('should set focus to replaced dummie', () => {
                expect($('#node-' + uuid).hasClass('focused')).to.be.true;
            });
        });
    });

    describe('dummie elem2 is `falsy`', () => {
        var UUIDs = [];
        var numOfUUIDs;
        var block1, elem1;
        var stubConstructTree, stubIsInViewport;

        beforeEach(() => {
            numOfUUIDs = 3;
            for(var i = 0; i < numOfUUIDs; i++) {
                UUIDs[i] = faker.random.uuid();
            }

            block1 = $('<div id="' + 'block-' + UUIDs[0] + '" class="block supported-node testNotReplaced">');
            elem1 = $('<div id="' + 'dummy-' + UUIDs[0] + '">');
            $('#test').append(block1);
            block1.append(elem1);
            elem1.append(
                '<div id="' + 'block-' + UUIDs[1] + '" class="block supported-node testNotReplaced">' +
                    '<div id="' + 'dummy-' + UUIDs[1] + '" class="dummy"/>' +
                '</div>' +
                '<div id="' + 'block-' + UUIDs[2] + '" class="block supported-node testNotReplaced">' +
                    '<div id="' + 'dummy-' + UUIDs[2] + '" class="dummy">' +
                '</div>'
            );

            stubConstructTree = sinon.stub(window, 'constructTree').callsFake((uuid) => {
                var e = $('<div>', {
                    id: 'block-' + uuid,
                    class: 'testReplaced supported-node'
                });
                var dummy = $('#dummy-' + uuid);
                var dummyCopy = dummy.clone();
                dummyCopy.attr('id', 'node-' + extractUUID(dummy.attr('id')));
                dummyCopy.removeClass('dummy');
                dummyCopy.addClass('supported-node');
                e.append(dummyCopy);
                
                return e;
            });

            stubIsInViewport = sinon.stub($.fn, 'isInViewport').returns(true);
        });

        describe('elem1 has class `dummy`', () => {
            function assertParentReplacement() {
                expect($('#dummy-' + UUIDs[0]).length).to.equal(0);
                expect($('#block-' + UUIDs[0]).hasClass('testReplaced')).to.be.true;

                expect($('#dummy-' + UUIDs[1]).length).to.equal(1);
                expect($('#dummy-' + UUIDs[2]).length).to.equal(1);
                expect($('#block-' + UUIDs[1]).hasClass('testReplaced')).to.be.false;
                expect($('#block-' + UUIDs[2]).hasClass('testReplaced')).to.be.false;
            }

            beforeEach(() => {
                elem1.addClass('dummy');
            });

            describe('neither the dummie elem1 nor its parent were focused', () => {
                it('should replace elem1`s parent', () => {
                    replaceDummies(elem1);

                    assertParentReplacement();
                });
            });

            describe('parent of the dummie elem1 was focused', () => {
                beforeEach(() => {
                    block1.addClass('focused');

                    replaceDummies(elem1);
                });

                it('should replace elem1`s parent', () => {
                    assertParentReplacement();
                });

                it('should set focus to replaced dummie', () => {
                    expect($('#node-' + UUIDs[0]).hasClass('focused'));
                });
            });

            describe('the dummie elem1 was focused', () => {
                beforeEach(() => {
                    elem1.addClass('focused');

                    replaceDummies(elem1);
                });

                it('should replace elem1`s parent', () => {
                    assertParentReplacement();
                });

                it('should set focus to replaced dummie', () => {
                    expect($('#node-' + UUIDs[0]).hasClass('focused'));
                });
            });
        });

        describe('elem1 doesn`t have class `dummy`', () => {
            function assertChildrenReplacement() {
                expect($('#dummy-' + UUIDs[0]).length).to.equal(1);

                expect($('#dummy-' + UUIDs[1]).length).to.equal(0);
                expect($('#dummy-' + UUIDs[2]).length).to.equal(0);
                expect($('#block-' + UUIDs[1]).hasClass('testReplaced')).to.be.true;
                expect($('#block-' + UUIDs[2]).hasClass('testReplaced')).to.be.true;
            }

            describe('no node was focused in tree elem1', () => {
                it('should replace all dummy children trees', () => {
                    replaceDummies(elem1);

                    assertChildrenReplacement();
                });
            });

            describe('parent of one dummy child in elem1 tree was focused', () => {
                beforeEach(() => {
                    $('#block-' + UUIDs[1]).addClass('focused');

                    replaceDummies(elem1);
                });

                it('should replace all dummy children trees', () => {
                    assertChildrenReplacement();
                });

                it('should set focus to replaced dummy child of this parent', () => {
                    expect($('#node-' + UUIDs[1]).hasClass('focused')).to.be.true;
                });
            })

            describe('one dummy child in elem1 tree was focused', () => {
                beforeEach(() => {
                    $('#dummy-' + UUIDs[2]).addClass('focused');

                    replaceDummies(elem1);
                });

                it('should replace all dummy children trees', () => {
                    assertChildrenReplacement();
                });

                it('should set focus to replaced dummy child of this parent', () => {
                    expect($('#node-' + UUIDs[2]).hasClass('focused')).to.be.true;
                });
            });
        });

        describe('there aren`t any dummies in elem1 tree', () => {
            it('replace nothing', () => {
                block1.find('.dummy').each(function(idx, elem) {
                    elem.classList.remove('dummy');
                });

                replaceDummies(elem1);

                expect($('.testNotReplaced').length).to.equal(3);
            });
        });
    });
});