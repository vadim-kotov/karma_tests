describe('function onChangeNode(uuid, silent)', () => {
    var elemsModul;
    var stubConstructTree;

    beforeEach(() => {
        $('body').append('<div id="test">');
        $('#test').append('<div id="contents">');

        elemsModul = (function() {
            var elems = {};
            var parentsList = {};

            var rootNodeUUID = faker.random.uuid();
            var rootNode = {
                children : [],
                uuid : rootNodeUUID,
                deep : 0,
                path : '1.',

                testHeader : true
            };

            elems[rootNodeUUID] = rootNode;

            return {
                rootNodeUUID : rootNodeUUID,


                newElem : function(type, parentUUID, isHeader, deep, path) {
                    var uuid = faker.random.uuid();
                    var parent = elems[parentUUID];
                    var elem = {
                        attributes : {
                            _type : {
                                key : '_type',
                                type : 'STRING',
                                value : type
                            }
                        },
                        children : [],
                        uuid : uuid,
                        deep : deep, //Number(parent.deep) + 1,
                        path : path, //parent.path+id+'.',

                        testHeader : isHeader
                    }

                    parent.children.push(uuid);
                    parentsList[uuid] = parentUUID;

                    elems[uuid] = elem;
                    return elem;
                },

                getRootNode : function() {
                    return rootNodeUUID;
                },

                isNodeHeader : function(uuid) {
                    /*
                    var node = elems[uuid];
                    var type = node.attributes._type.value;
                    if(type == 'Requirement')
                        return true;
                    return false;*/
                    return elems[uuid].testHeader;
                },

                loadNodeByUUID : function(uuid) {
                    return elems[uuid];
                },

                // returns JSON String
                getParentUUID : function(uuid) {
                    return JSON.stringify(parentsList[uuid]);
                },

                renderNodes : function() {
                    $('#contents').append('<div id="block-' + rootNodeUUID + '">');
                    for(var i in elems) {
                        var elem = elems[i];
                        if(elem.uuid == rootNodeUUID)
                            continue;
                        
                        $('#block-' + parentsList[elem.uuid]).append('<div id="block-' + elem.uuid + '" class="testNotReplaced">');
                    }
                }
            }
        })();

        sinon.stub(window, 'getParentUUID').callsFake(elemsModul.getParentUUID);
        sinon.stub(window, 'loadNodeByUUID').callsFake(elemsModul.loadNodeByUUID);
        sinon.stub(window, 'isNodeHeader').callsFake(elemsModul.isNodeHeader);
    });

    xdescribe('node with passed uuid or its parent don`t exist', () => {
        it('should not call updateTree', () => {
            
        });
    });

    describe('both node with passed uuid and its parent actually exist', () => {
        describe('child with passed uuid is found among children of its parent', () => {
            beforeEach(() => {
                var mainReq01 = elemsModul.newElem('Requirement', elemsModul.rootNodeUUID, true, 2, '1.1.');
                    elemsModul.newElem('TextNode', elemsModul.rootNodeUUID, false, 2, '1.1.');
                    elemsModul.newElem('Requirement', mainReq01.uuid, false, 3, '1.1.1.');
                var mainReq02 = elemsModul.newElem('Requirement', elemsModul.rootNodeUUID, false, 2, '1.2.');
                    elemsModul.newElem('TextNode', elemsModul.rootNodeUUID, false, 2, '1.2.');
                var mainReq03 = elemsModul.newElem('Requirement', elemsModul.rootNodeUUID, true, 2, '1.2.');
                    elemsModul.newElem('Requirement', mainReq03.uuid, false, 3, '1.2.1.');

                var parent = elemsModul.newElem('Requirement', elemsModul.rootNodeUUID, true, 2, '1.3.');
                    elemsModul.newElem('TextNode', elemsModul.rootNodeUUID, false, 2, '1.3.');
                    var node = elemsModul.newElem('Requirement', parent.uuid, false, null, null);

                elemsModul.newElem('Requirement', elemsModul.rootNodeUUID, false, 2, '1.4.');
                elemsModul.newElem('Requirement', elemsModul.rootNodeUUID, false, 2, '1.4.');

                elemsModul.renderNodes();

                var rootDiv = $('#block-' + elemsModul.rootNodeUUID);
                rootDiv.addClass('testNotReplaced');
                rootDiv.find('div').addClass('testNotReplaced');
                /*rootDiv.find('div').each((i, elem) => {
                    elem.addClass('testNotReplaced');
                });*/

                var stubConstructTree = sinon.stub(window, 'constructTree').callsFake((uuid) => {
                    var e = $('<div>', {
                        id: 'block-' + uuid,
                        class: 'testReplaced'
                    });

                    return e;
                });

                onChangeNode(node.uuid, true);
            });

            it('should update this node', () => {
                
            });

            xit('should set proper deep and path to this node', () => {

            });
        });

        xdescribe('child with passed uuid is not found among children of its parent', () => {
        });
    });
});

var elem1 = {
    "attributes": {
        "_type": {
            "key": "_type",
            "type": "STRING",
            "value": "TestProcedure"
        }
    },
    "children": [
        "82f9c555-9c0c-43d8-9088-fc42b17f60b8",
        "68047e21-1e55-4450-9eea-9c072fd8d739",
        "19a3fb36-33c2-4479-aab9-cf372b6a2220"
    ],
    "id": "TestProcedure1",
    "uuid": "793445e9-a2ea-42dd-8a9e-9ffcde2227ae"
}

var elem2 = {
    "attributes": {
        "_type": { 
            "key": "_type", 
            "type": "STRING", 
            "value": "Requirement" 
        }
    }, 
    "children": [ 
        "648c2725-4db2-4ad1-8254-aaf4d1aa67fa", 
        "f6c854e9-9058-4b36-a6dc-461b059969cf", 
        "e23c5275-46c7-4e6f-8669-ee6d36f4003f", 
        "450d5815-da17-404d-af93-0e75976ef961" 
    ], 
    "id": "Requirements", 
    "uuid": "7547c386-6c11-43ce-843f-42a39642cd1e" 
}

describe('', () => {
    it('', () => {
        
    });
});